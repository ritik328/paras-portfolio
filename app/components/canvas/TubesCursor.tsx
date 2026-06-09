'use client';

import { useEffect, useRef } from 'react';

/**
 * TubesCursor component.
 * Imports and renders the 3D WebGL Tubes Cursor trailing effect.
 * Uses client-side dynamic import of the local 'threejs-components' library to prevent SSR issues.
 */
export function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let app: any = null;
    let isDestroyed = false;

    const initCursor = async () => {
      try {
        // Dynamic import of the local node_module inside useEffect ensures it is client-only
        const module = await import('threejs-components/build/cursors/tubes1.min.js' as any);

        if (isDestroyed || !canvasRef.current) return;

        const tubesCursorInit = module.default;
        app = tubesCursorInit(canvasRef.current, {
          tubes: {
            colors: ["#e07040", "#c8b89a", "#888884"], // Adapted to match portfolio themes
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
