'use client';

import { useEffect, useRef } from 'react';

/**
 * 4D Klein Bottle hero background — fire palette, stereographic projection.
 *
 * Renders a WebGL particle + wireframe Klein bottle behind the Hero section.
 * Dark-mode only, pauses when out of view or tab backgrounded, full cleanup on unmount.
 *
 * All 6 required corrections applied:
 *   1. No OrbitControls — time-based rotation, pointer-events: none
 *   2. Reduced density (~3,150 pts desktop, ~1,200 mobile)
 *   3. Pixel ratio capped at 1.5
 *   4. Visibility pause/resume (ScrollTrigger + visibilitychange)
 *   5. Full disposal on unmount (geometry, materials, composer, renderer, forceContextLoss)
 *   6. Reduced-motion fallback (return null, never init WebGL)
 */

interface KleinBottleBackgroundProps {
  /** Mount only in dark mode — parent should pass `theme === 'dark'` */
  active: boolean;
  /** From GSAPProvider's isReducedMotion — skip WebGL entirely if true */
  reducedMotion: boolean;
}

export function KleinBottleBackground({ active, reducedMotion }: KleinBottleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Correction #6: reduced-motion fallback — never initialize WebGL
    if (reducedMotion || !active) return;
    if (!containerRef.current) return;
    if (isInitializedRef.current) return;

    isInitializedRef.current = true;

    let rafId = 0;
    let isDestroyed = false;

    // Visibility tracking refs
    let heroVisible = true;
    let tabVisible = true;
    let isAnimating = false;

    // Scroll-linked parameter refs
    let scrollProgress = 0;     // 0–1 from internal ScrollTrigger
    let scrollVelocity = 0;     // normalized scroll velocity for speed boost
    let speedMultiplier = 1.0;  // decays back to 1.0 over time

    const initScene = async () => {
      try {
        const THREE = await import('three');
        const { EffectComposer } = await import('three/addons/postprocessing/EffectComposer.js');
        const { RenderPass } = await import('three/addons/postprocessing/RenderPass.js');
        const { UnrealBloomPass } = await import('three/addons/postprocessing/UnrealBloomPass.js');
        const { OutputPass } = await import('three/addons/postprocessing/OutputPass.js');

        if (isDestroyed || !containerRef.current) return;

        const container = containerRef.current;

        // ── Mobile detection for density/bloom downgrade ──────────────
        const isMobile = window.innerWidth < 768;
        const Ntheta = isMobile ? 40 : 70;
        const Nphi = isMobile ? 30 : 45;
        const totalPoints = Ntheta * Nphi;

        // ── Scene setup ──────────────────────────────────────────────
        const scene = new THREE.Scene();
        // Transparent background — blends over existing Hero gradient
        scene.background = null;

        const camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          100
        );
        camera.position.set(5, 3.5, 6);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true, // transparent canvas
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        // Correction #3: capped pixel ratio at 1.5
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.7;
        renderer.setClearColor(0x000000, 0);

        const canvas = renderer.domElement;
        canvas.classList.add('klein-bottle-canvas');
        // Correction #1: pointer-events: none — no click/drag capture
        canvas.style.pointerEvents = 'none';
        container.appendChild(canvas);

        // ── Post-processing (skip bloom on mobile) ───────────────────
        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        if (!isMobile) {
          // Bloom values are a starting point — tunable, not settled.
          // May need adjustment since point density is ~3x lower than the reference.
          const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(container.clientWidth, container.clientHeight),
            0.4, // strength — may need increase for sparser points
            0.3, // radius
            0.2  // threshold
          );
          composer.addPass(bloomPass);
        }
        composer.addPass(new OutputPass());

        // ── 4D Math ──────────────────────────────────────────────────
        function klein4D(u: number, v: number): [number, number, number, number] {
          const r = 1 + 0.5 * Math.cos(u);
          const x = r * Math.cos(v);
          const y = r * Math.sin(v);
          const z = 0.5 * Math.sin(u) * Math.cos(v / 2);
          const w = 0.5 * Math.sin(u) * Math.sin(v / 2);
          return [x, y, z, w];
        }

        function rotate4D(
          p: [number, number, number, number],
          angleXY: number,
          angleZW: number,
        ): [number, number, number, number] {
          const [x, y, z, w] = p;
          const ca = Math.cos(angleXY), sa = Math.sin(angleXY);
          const cb = Math.cos(angleZW), sb = Math.sin(angleZW);
          return [
            x * ca - y * sa,
            x * sa + y * ca,
            z * cb - w * sb,
            z * sb + w * cb,
          ];
        }

        function stereographic3D(p: [number, number, number, number]): [number, number, number] {
          const [x, y, z, w] = p;
          const d = 1 - w;
          const f = 1 / (d || 0.001);
          return [x * f, y * f, z * f];
        }

        // ── Pre-compute base points ─────────────────────────────────
        const basePoints: [number, number, number, number][] = [];
        for (let i = 0; i < Ntheta; i++) {
          const u = (i / Ntheta) * 2 * Math.PI;
          for (let j = 0; j < Nphi; j++) {
            const v = (j / Nphi) * 2 * Math.PI;
            basePoints.push(klein4D(u, v));
          }
        }

        // ── Particle geometry & buffers ──────────────────────────────
        const positions = new Float32Array(totalPoints * 3);
        const colors = new Float32Array(totalPoints * 3);
        const sizes = new Float32Array(totalPoints);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Particle material (fire palette)
        const vertexShader = `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (350.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `;
        const fragmentShader = `
          varying vec3 vColor;
          void main() {
            vec2 center = gl_PointCoord - 0.5;
            float dist = length(center);
            if (dist > 0.5) discard;
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha *= alpha;
            float glow = exp(-dist * 8.0);
            vec3 col = vColor + 0.15 * glow * vColor;
            gl_FragColor = vec4(col, alpha * 0.6);
          }
        `;

        const particleMat = new THREE.ShaderMaterial({
          uniforms: {},
          vertexShader,
          fragmentShader,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const particles = new THREE.Points(geometry, particleMat);
        scene.add(particles);

        // ── Wireframe lines ──────────────────────────────────────────
        const lineIndices: number[] = [];
        for (let i = 0; i < Ntheta; i++) {
          for (let j = 0; j < Nphi; j++) {
            const idx = i * Nphi + j;
            const iNext = (i + 1) % Ntheta;
            const idxH = iNext * Nphi + j;
            lineIndices.push(idx, idxH);
            const jNext = (j + 1) % Nphi;
            const idxV = i * Nphi + jNext;
            lineIndices.push(idx, idxV);
          }
        }

        const linePositions = new Float32Array(totalPoints * 3);
        const lineColors = new Float32Array(totalPoints * 3);

        const lineGeom = new THREE.BufferGeometry();
        lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        lineGeom.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
        lineGeom.setIndex(lineIndices);

        const lineMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.15,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const lines = new THREE.LineSegments(lineGeom, lineMat);
        scene.add(lines);

        // ── Background stars ─────────────────────────────────────────
        const starCount = 2000;
        const starGeom = new THREE.BufferGeometry();
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
          starPos[i] = (Math.random() - 0.5) * 80;
        }
        starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
          color: 0x667799,
          size: 0.04,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const stars = new THREE.Points(starGeom, starMat);
        scene.add(stars);

        // ── Per-frame update function ────────────────────────────────
        // Re-usable Color instance to avoid per-point allocation
        const tmpColor = new THREE.Color();

        function updateKlein(time: number) {
          const angleXY = time * 0.35;
          const angleZW = time * 0.55;

          const posArray = positions;
          const colArray = colors;
          const sizeArray = sizes;
          const linePosArray = linePositions;
          const lineColArray = lineColors;

          let minDist = Infinity;
          let maxDist = -Infinity;

          // Temp storage for 3D projected points (avoid allocation)
          const temp3D: number[] = new Array(totalPoints * 3);

          for (let k = 0; k < totalPoints; k++) {
            const p4 = basePoints[k];
            const rotated = rotate4D(p4, angleXY, angleZW);
            const p3 = stereographic3D(rotated);

            const idx3 = k * 3;
            posArray[idx3] = p3[0];
            posArray[idx3 + 1] = p3[1];
            posArray[idx3 + 2] = p3[2];
            temp3D[idx3] = p3[0];
            temp3D[idx3 + 1] = p3[1];
            temp3D[idx3 + 2] = p3[2];

            // Fire palette: hue from 0.0 to 0.15 (red–orange–yellow)
            const thetaIdx = Math.floor(k / Nphi);
            const phiIdx = k % Nphi;
            const theta = (thetaIdx / Ntheta) * 2 * Math.PI;
            const phi = (phiIdx / Nphi) * 2 * Math.PI;
            const t = (theta / (2 * Math.PI) + phi / (2 * Math.PI)) / 2;
            const hue = 0.0 + t * 0.15;
            const sat = 1.0;
            const lig = 0.3 + 0.6 * t;
            tmpColor.setHSL(hue, sat, lig);

            colArray[idx3] = tmpColor.r;
            colArray[idx3 + 1] = tmpColor.g;
            colArray[idx3 + 2] = tmpColor.b;

            const dist = Math.sqrt(p3[0] * p3[0] + p3[1] * p3[1] + p3[2] * p3[2]);
            if (dist < minDist) minDist = dist;
            if (dist > maxDist) maxDist = dist;
          }

          const range = maxDist - minDist || 0.001;
          for (let k = 0; k < totalPoints; k++) {
            const idx3 = k * 3;
            const px = temp3D[idx3], py = temp3D[idx3 + 1], pz = temp3D[idx3 + 2];
            const dist = Math.sqrt(px * px + py * py + pz * pz);
            const t = (dist - minDist) / range;
            const size = 0.05 + 0.25 * (1 - t) + 0.06 * Math.sin(k * 0.1);
            sizeArray[k] = Math.max(0.02, size);

            lineColArray[idx3] = colArray[idx3];
            lineColArray[idx3 + 1] = colArray[idx3 + 1];
            lineColArray[idx3 + 2] = colArray[idx3 + 2];
          }

          // Copy positions to line geometry
          linePosArray.set(posArray);

          // Flag attributes for GPU upload
          geometry.attributes.position.needsUpdate = true;
          geometry.attributes.color.needsUpdate = true;
          geometry.attributes.size.needsUpdate = true;
          lineGeom.attributes.position.needsUpdate = true;
          lineGeom.attributes.color.needsUpdate = true;
        }

        // ── Resize handler ───────────────────────────────────────────
        const handleResize = () => {
          if (!container) return;
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          composer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // ── ScrollTrigger setup (internal, ref-based) ────────────────
        let scrollTriggerInstance: any = null;

        const initScrollTrigger = async () => {
          try {
            const { ScrollTrigger } = await import('@/app/lib/gsap');
            if (isDestroyed) return;

            scrollTriggerInstance = ScrollTrigger.create({
              trigger: '#top', // Hero section
              start: 'top top',
              end: 'bottom top',
              onUpdate: (self: any) => {
                scrollProgress = self.progress; // 0–1
                // Normalize velocity: getVelocity() returns px/s, clamp to 0–3 range
                const rawVel = Math.abs(self.getVelocity()) / 1000;
                scrollVelocity = Math.min(rawVel, 3);
                if (heroVisible && tabVisible && scrollProgress < 1.0) {
                  tryStartLoop();
                }
              },
              onEnter: () => { heroVisible = true; tryStartLoop(); },
              onEnterBack: () => { heroVisible = true; tryStartLoop(); },
              onLeave: () => { heroVisible = false; tryStopLoop(); },
              onLeaveBack: () => { heroVisible = false; tryStopLoop(); },
            });
          } catch (err) {
            console.error('KleinBottle ScrollTrigger init error:', err);
          }
        };
        initScrollTrigger();

        // ── Visibility change handler ────────────────────────────────
        const handleVisibilityChange = () => {
          tabVisible = !document.hidden;
          if (tabVisible && heroVisible) {
            tryStartLoop();
          } else if (!tabVisible) {
            tryStopLoop();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // ── Animation loop ───────────────────────────────────────────
        const clock = new THREE.Clock();

        function tryStartLoop() {
          if (isAnimating || isDestroyed) return;
          if (!heroVisible || !tabVisible) return;
          if (scrollProgress >= 1.0) return;
          isAnimating = true;
          clock.start();
          rafId = requestAnimationFrame(animate);
        }

        function tryStopLoop() {
          if (!isAnimating) return;
          isAnimating = false;
          cancelAnimationFrame(rafId);
          clock.stop();
        }

        function animate() {
          if (!isAnimating || isDestroyed) return;

          const elapsed = clock.getElapsedTime();

          // Scroll-linked speed boost: scroll velocity adds temporary boost,
          // decayed back to 1.0 over ~600ms (exponential damping)
          speedMultiplier += (scrollVelocity - (speedMultiplier - 1.0)) * 0.02;
          speedMultiplier = 1.0 + (speedMultiplier - 1.0) * 0.97; // decay toward 1.0
          // Clamp between 0.5 and 4
          speedMultiplier = Math.max(0.5, Math.min(4, speedMultiplier));

          // Scroll-linked camera Z dolly: 6 at top → 4.8 at bottom
          const targetZ = 6 - scrollProgress * 1.2;
          camera.position.z += (targetZ - camera.position.z) * 0.05;

          // Scroll-linked opacity: full at 0–0.7, fade to 0 over 0.7–1.0
          let targetOpacity = 1;
          if (scrollProgress > 0.7) {
            targetOpacity = 1 - (scrollProgress - 0.7) / 0.3;
          }
          targetOpacity = Math.max(0, Math.min(1, targetOpacity));
          canvas.style.opacity = String(targetOpacity);

          // Stop RAF loop once fully transparent
          if (targetOpacity <= 0) {
            tryStopLoop();
            return;
          }

          // Update Klein bottle with time * speedMultiplier
          updateKlein(elapsed * speedMultiplier);

          // Decay scroll velocity toward 0 between scroll events
          scrollVelocity *= 0.95;

          composer.render();
          rafId = requestAnimationFrame(animate);
        }

        // Initial render + start loop
        updateKlein(0);
        tryStartLoop();

        // ── Cleanup (Correction #5) ──────────────────────────────────
        return () => {
          isDestroyed = true;
          isAnimating = false;
          cancelAnimationFrame(rafId);

          window.removeEventListener('resize', handleResize);
          document.removeEventListener('visibilitychange', handleVisibilityChange);

          if (scrollTriggerInstance) {
            scrollTriggerInstance.kill();
          }

          // Dispose all GPU resources
          geometry.dispose();
          lineGeom.dispose();
          starGeom.dispose();
          particleMat.dispose();
          lineMat.dispose();
          starMat.dispose();

          // Dispose composer passes
          composer.dispose();

          // Dispose renderer and force context loss
          renderer.dispose();
          renderer.forceContextLoss();

          // Remove canvas from DOM
          if (canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        };
      } catch (err) {
        console.error('KleinBottleBackground init error:', err);
        return undefined;
      }
    };

    let cleanup: (() => void) | undefined;

    initScene().then((cleanupFn) => {
      if (isDestroyed) {
        // Component unmounted before init finished
        cleanupFn?.();
      } else {
        cleanup = cleanupFn;
      }
    });

    return () => {
      isDestroyed = true;
      isInitializedRef.current = false;
      cleanup?.();
    };
  }, [active, reducedMotion]);

  // Correction #6: if reduced motion, render nothing
  if (reducedMotion || !active) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="klein-bottle-wrap"
      aria-hidden="true"
    />
  );
}
