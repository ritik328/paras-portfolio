'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { useTheme } from '@/app/lib/hooks/useTheme';

/**
 * 4D Klein Bottle site background — fire palette, stereographic projection.
 *
 * Mounted once at the app root (outside ScrollSmoother's transformed wrapper so
 * `position: fixed` keeps working) and rendered behind every section.
 *
 * Scroll interaction:
 *   - page scroll progress (0–1) drives camera orbit/dolly, hue drift and the
 *     4D rotation phase, so scrolling up literally rewinds the morph
 *   - signed scroll velocity adds a temporary forward/backward spin boost
 *
 * Performance:
 *   - colors + point sizes are computed on the GPU (static `aT` attribute)
 *   - CPU per frame only re-projects ~3.1k points (~1.2k on mobile)
 *   - position/`aT` buffers are shared between the point cloud and the wireframe
 *   - pixel ratio capped at 1.5, bloom skipped on mobile
 *   - RAF paused when the tab is hidden, full GPU disposal on unmount
 *   - never initialises WebGL under `prefers-reduced-motion` or light theme
 */

interface KleinBottleBackgroundProps {
  /** Force on/off. Defaults to `theme === 'dark'`. */
  active?: boolean;
  /** Force reduced motion. Defaults to the `prefers-reduced-motion` media query. */
  reducedMotion?: boolean;
}

const HSL2RGB = `
  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }
`;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function KleinBottleBackground({ active, reducedMotion }: KleinBottleBackgroundProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const systemReduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false // server snapshot
  );

  const isReduced = reducedMotion ?? systemReduced;
  const enabled = !isReduced && (active ?? theme === 'dark');

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    // Lets globals.css punch holes in the opaque section backgrounds.
    document.documentElement.setAttribute('data-klein', 'on');

    let rafId = 0;
    let isDestroyed = false;
    let cleanupScene: (() => void) | undefined;

    const initScene = async () => {
      const THREE = await import('three');
      const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
      const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
      const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
      const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');

      if (isDestroyed) return;

      const isMobile = window.innerWidth < 768;
      const Ntheta = isMobile ? 40 : 70;
      const Nphi = isMobile ? 30 : 45;
      const totalPoints = Ntheta * Nphi;

      let width = window.innerWidth;
      let height = window.innerHeight;

      // ── Scene ──────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      scene.background = null;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
      camera.position.set(4.6, 3.2, 5.6);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.classList.add('klein-bottle-canvas');
      canvas.style.pointerEvents = 'none';
      container.appendChild(canvas);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      if (!isMobile) {
        composer.addPass(
          new UnrealBloomPass(new THREE.Vector2(width, height), 0.55, 0.4, 0.15)
        );
      }
      composer.addPass(new OutputPass());

      // ── 4D math ────────────────────────────────────────────────────
      const klein4D = (u: number, v: number): [number, number, number, number] => {
        const r = 1 + 0.5 * Math.cos(u);
        return [
          r * Math.cos(v),
          r * Math.sin(v),
          0.5 * Math.sin(u) * Math.cos(v / 2),
          0.5 * Math.sin(u) * Math.sin(v / 2),
        ];
      };

      // Flat base buffer (x, y, z, w) — avoids per-frame array churn.
      const base = new Float32Array(totalPoints * 4);
      const tValues = new Float32Array(totalPoints);
      for (let i = 0; i < Ntheta; i++) {
        const u = (i / Ntheta) * 2 * Math.PI;
        for (let j = 0; j < Nphi; j++) {
          const v = (j / Nphi) * 2 * Math.PI;
          const k = i * Nphi + j;
          const p = klein4D(u, v);
          base[k * 4] = p[0];
          base[k * 4 + 1] = p[1];
          base[k * 4 + 2] = p[2];
          base[k * 4 + 3] = p[3];
          tValues[k] = (i / Ntheta + j / Nphi) / 2;
        }
      }

      // ── Shared geometry buffers ────────────────────────────────────
      const positions = new Float32Array(totalPoints * 3);
      const posAttr = new THREE.BufferAttribute(positions, 3);
      posAttr.setUsage(THREE.DynamicDrawUsage);
      const tAttr = new THREE.BufferAttribute(tValues, 1);

      const pointGeom = new THREE.BufferGeometry();
      pointGeom.setAttribute('position', posAttr);
      pointGeom.setAttribute('aT', tAttr);

      const lineIndices: number[] = [];
      for (let i = 0; i < Ntheta; i++) {
        for (let j = 0; j < Nphi; j++) {
          const idx = i * Nphi + j;
          lineIndices.push(idx, ((i + 1) % Ntheta) * Nphi + j);
          lineIndices.push(idx, i * Nphi + ((j + 1) % Nphi));
        }
      }
      const lineGeom = new THREE.BufferGeometry();
      lineGeom.setAttribute('position', posAttr); // same GL buffer as the points
      lineGeom.setAttribute('aT', tAttr);
      lineGeom.setIndex(lineIndices);

      const commonUniforms = {
        uHueShift: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uOpacity: { value: 0.18 },
      };

      const particleMat = new THREE.ShaderMaterial({
        uniforms: {
          uHueShift: commonUniforms.uHueShift,
          uPixelRatio: commonUniforms.uPixelRatio,
        },
        vertexShader: `
          attribute float aT;
          uniform float uHueShift;
          uniform float uPixelRatio;
          varying vec3 vColor;
          ${HSL2RGB}
          void main() {
            float hue = mod(0.015 + aT * 0.135 + uHueShift, 1.0);
            float lig = 0.32 + 0.5 * aT;
            vColor = hsl2rgb(vec3(hue, 1.0, lig));
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            float d = length(position);
            float sz = 0.07 + 0.24 / (1.0 + d * 0.45);
            gl_PointSize = sz * uPixelRatio * (340.0 / max(0.001, -mv.z));
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float dist = length(c);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= alpha;
            float glow = exp(-dist * 8.0);
            gl_FragColor = vec4(vColor + 0.18 * glow * vColor, alpha * 0.62);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const lineMat = new THREE.ShaderMaterial({
        uniforms: {
          uHueShift: commonUniforms.uHueShift,
          uOpacity: commonUniforms.uOpacity,
        },
        vertexShader: `
          attribute float aT;
          uniform float uHueShift;
          varying vec3 vColor;
          ${HSL2RGB}
          void main() {
            float hue = mod(0.015 + aT * 0.135 + uHueShift, 1.0);
            vColor = hsl2rgb(vec3(hue, 1.0, 0.34 + 0.4 * aT));
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4(vColor, uOpacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(pointGeom, particleMat);
      const lines = new THREE.LineSegments(lineGeom, lineMat);
      // Positions morph every frame — a stale bounding sphere would cull the mesh.
      particles.frustumCulled = false;
      lines.frustumCulled = false;
      scene.add(particles, lines);

      // ── Background stars ───────────────────────────────────────────
      const starCount = isMobile ? 900 : 1800;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i++) {
        starPos[i] = (Math.random() - 0.5) * 90;
      }
      const starGeom = new THREE.BufferGeometry();
      starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x8899bb,
        size: 0.05,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const stars = new THREE.Points(starGeom, starMat);
      scene.add(stars);

      // ── Per-frame projection ───────────────────────────────────────
      const updateKlein = (angleXY: number, angleZW: number) => {
        const ca = Math.cos(angleXY), sa = Math.sin(angleXY);
        const cb = Math.cos(angleZW), sb = Math.sin(angleZW);

        for (let k = 0; k < totalPoints; k++) {
          const i4 = k * 4;
          const x0 = base[i4], y0 = base[i4 + 1], z0 = base[i4 + 2], w0 = base[i4 + 3];

          const x = x0 * ca - y0 * sa;
          const y = x0 * sa + y0 * ca;
          const z = z0 * cb - w0 * sb;
          const w = z0 * sb + w0 * cb;

          // Stereographic projection from 4D to 3D.
          const d = 1 - w;
          const f = 1 / (Math.abs(d) < 0.001 ? 0.001 : d);

          const i3 = k * 3;
          positions[i3] = x * f;
          positions[i3 + 1] = y * f;
          positions[i3 + 2] = z * f;
        }
        posAttr.needsUpdate = true;
      };

      // ── Resize ─────────────────────────────────────────────────────
      const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        composer.setSize(width, height);
      };
      window.addEventListener('resize', handleResize);

      // ── Scroll state ───────────────────────────────────────────────
      let scrollProgress = 0; // 0–1 across the whole page
      let signedVel = 0;      // -1 (scrolling up fast) … 1 (down fast)

      let scrollTriggerInstance: { kill: (r?: boolean) => void } | null = null;
      let nativeScrollHandler: (() => void) | null = null;

      const attachNativeScroll = () => {
        let lastY = window.scrollY;
        let lastT = performance.now();
        nativeScrollHandler = () => {
          const y = window.scrollY;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          scrollProgress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
          const now = performance.now();
          const dt = Math.max(16, now - lastT);
          signedVel = Math.max(-1, Math.min(1, ((y - lastY) / dt) * 0.35));
          lastY = y;
          lastT = now;
        };
        window.addEventListener('scroll', nativeScrollHandler, { passive: true });
        nativeScrollHandler();
      };

      try {
        const { ScrollTrigger } = await import('@/app/lib/gsap');
        if (isDestroyed) return;
        // No trigger element: start/end map to raw scroll positions, so
        // `progress` is the whole-page scroll progress (works with ScrollSmoother).
        scrollTriggerInstance = ScrollTrigger.create({
          start: 0,
          end: 'max',
          onUpdate: (self) => {
            scrollProgress = self.progress;
            signedVel = Math.max(-1, Math.min(1, self.getVelocity() / 2500));
          },
        });
      } catch {
        attachNativeScroll();
      }

      // ── Loop ───────────────────────────────────────────────────────
      let isRunning = false;
      let lastFrame = performance.now();
      let phase = 0;
      let smoothProgress = scrollProgress;
      const camTarget = new THREE.Vector3();

      const render = (now: number) => {
        if (isDestroyed || !isRunning) return;

        const dt = Math.min((now - lastFrame) / 1000, 0.05);
        lastFrame = now;

        // Velocity decays back to rest between scroll events.
        signedVel *= Math.exp(-dt * 3.2);
        smoothProgress += (scrollProgress - smoothProgress) * Math.min(1, dt * 6);

        // Idle drift + signed scroll boost: scrolling up rewinds the morph.
        phase += dt * (0.22 + signedVel * 2.6);

        const angleXY = phase * 0.9 + smoothProgress * Math.PI * 3;
        const angleZW = phase * 1.35 + smoothProgress * Math.PI * 4;
        updateKlein(angleXY, angleZW);

        // Camera orbits and dollies in as the page advances.
        const az = 0.68 + smoothProgress * 1.7;
        const radius = 7.0 - smoothProgress * 1.9;
        camTarget.set(
          Math.sin(az) * radius,
          3.0 - smoothProgress * 5.2,
          Math.cos(az) * radius
        );
        camera.position.lerp(camTarget, Math.min(1, dt * 2.5));
        camera.lookAt(0, 0, 0);

        // Hue drifts within the fire range across the page.
        commonUniforms.uHueShift.value = smoothProgress * 0.055;
        commonUniforms.uOpacity.value = 0.14 + 0.1 * Math.abs(signedVel);

        stars.rotation.y = smoothProgress * 0.5 + phase * 0.01;
        stars.rotation.x = smoothProgress * 0.2;

        composer.render();
        rafId = requestAnimationFrame(render);
      };

      const start = () => {
        if (isRunning || isDestroyed || document.hidden) return;
        isRunning = true;
        lastFrame = performance.now();
        rafId = requestAnimationFrame(render);
      };

      const stop = () => {
        isRunning = false;
        cancelAnimationFrame(rafId);
      };

      const handleVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener('visibilitychange', handleVisibility);

      updateKlein(0, 0);
      start();

      cleanupScene = () => {
        stop();
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibility);
        if (nativeScrollHandler) window.removeEventListener('scroll', nativeScrollHandler);
        scrollTriggerInstance?.kill();

        pointGeom.dispose();
        lineGeom.dispose();
        starGeom.dispose();
        particleMat.dispose();
        lineMat.dispose();
        starMat.dispose();
        composer.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      };
    };

    initScene().catch((err) => {
      console.error('KleinBottleBackground init error:', err);
    });

    return () => {
      isDestroyed = true;
      cancelAnimationFrame(rafId);
      document.documentElement.removeAttribute('data-klein');
      cleanupScene?.();
    };
  }, [enabled]);

  // Always rendered so the ref is available on mount; stays visually empty
  // (and the CSS scrim stays off) until the scene initialises.
  return <div ref={containerRef} className="klein-bottle-wrap" aria-hidden="true" />;
}
