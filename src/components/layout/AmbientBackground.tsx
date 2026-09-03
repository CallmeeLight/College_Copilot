import React, { useEffect, useRef } from 'react';

/**
 * AmbientBackground
 * Provides a subtle, continuously drifting ambient background with organic
 * light orbs and very gentle cursor-based parallax on desktop.
 * Keeps opacity restrained so all content remains legible through glassmorphic panels.
 */
export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized offset from center: -1 to 1, scaled to subtle 16px max parallax
      targetX = ((e.clientX / window.innerWidth) - 0.5) * 20;
      targetY = ((e.clientY / window.innerHeight) - 0.5) * 20;
    };

    const updateParallax = () => {
      // Smooth lerp interpolation for fluid, cinematic movement
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--parallax-x', `${currentX.toFixed(2)}px`);
        containerRef.current.style.setProperty('--parallax-y', `${currentY.toFixed(2)}px`);
      }

      rafId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ambient-background-layer"
      aria-hidden="true"
    >
      {/* Orb 1: Soft Sky / Cyan light - drifts from top-left */}
      <div className="ambient-orb-wrapper orb-parallax-1">
        <div className="ambient-orb ambient-orb-1" />
      </div>

      {/* Orb 2: Soft Emerald / Green light - drifts from bottom-right */}
      <div className="ambient-orb-wrapper orb-parallax-2">
        <div className="ambient-orb ambient-orb-2" />
      </div>

      {/* Orb 3: Soft Teal light - drifts across center */}
      <div className="ambient-orb-wrapper orb-parallax-3">
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Orb 4: Subtle Indigo accent light - drifts across top-right */}
      <div className="ambient-orb-wrapper orb-parallax-4">
        <div className="ambient-orb ambient-orb-4" />
      </div>

      {/* Subtle fine ambient noise/vignette overlay */}
      <div className="ambient-vignette" />
    </div>
  );
}
