'use client';

import { useEffect, useRef } from 'react';

/**
 * TubesCursor component.
 * Imports and renders the 3D WebGL Tubes Cursor trailing effect.
 * Features client-side ESM dynamic loading to bypass Next.js build-time bundling constraints.
 */
export function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let app: any = null;
    let isDestroyed = false;

    const initCursor = async () => {
      try {
        // Safe runtime dynamic import of CDN ESM script to avoid Webpack compilation errors
        const module = await new Function(
          'return import("https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js")'
        )();

        if (isDestroyed || !canvasRef.current) return;

        const tubesCursorInit = module.default;
        app = tubesCursorInit(canvasRef.current, {
          tubes: {
            colors: ["#e07040", "#c8b89a", "#888884"], // Adapted to match our portfolio colors (orange, cream, gray)
            lights: {
              intensity: 200,
              colors: ["#e07040", "#c8b89a", "#50b450", "#60aed5"]
            }
          }
        });

        const randomColors = (count: number) => {
          return new Array(count)
            .fill(0)
            .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
        };

        const handleClick = () => {
          if (app && app.tubes) {
            const colors = randomColors(3);
            const lightsColors = randomColors(4);
            app.tubes.setColors(colors);
            app.tubes.setLightsColors(lightsColors);
          }
        };

        document.body.addEventListener('click', handleClick);

        // Save reference for cleanup function
        const cleanup = () => {
          document.body.removeEventListener('click', handleClick);
          if (app && typeof app.destroy === 'function') {
            app.destroy();
          }
        };

        // If component unmounted before load finished, clean up immediately
        if (isDestroyed) {
          cleanup();
        } else {
          (canvasRef as any)._cleanup = cleanup;
        }

      } catch (err) {
        console.error('Failed to load TubesCursor:', err);
      }
    };

    initCursor();

    return () => {
      isDestroyed = true;
      if ((canvasRef as any)._cleanup) {
        (canvasRef as any)._cleanup();
      }
    };
  }, []);

  return (
    <canvas
      id="cursor-canvas"
      ref={canvasRef}
      className="cursor-canvas"
      aria-hidden="true"
    />
  );
}
