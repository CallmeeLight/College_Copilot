// =============================================
// College Copilot — Auth Background Component
// Deep Blue/Black Ambient Glow with Cursor Light
// =============================================

import React from 'react';

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden bg-[#020810]">
      {/* Deep atmospheric ambient gradients in cool blues and greens */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left soft sky blue ambient glow */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full opacity-35 blur-[120px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, rgba(2, 8, 16, 0) 70%)',
            animationDuration: '10s',
          }}
        />

        {/* Bottom-right soft emerald green ambient glow */}
        <div
          className="absolute -bottom-[15%] -right-[10%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full opacity-30 blur-[130px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.16) 0%, rgba(2, 8, 16, 0) 70%)',
            animationDuration: '12s',
          }}
        />

        {/* Center subtle teal depth light */}
        <div
          className="absolute top-[40%] left-[30%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, rgba(2, 8, 16, 0) 70%)',
          }}
        />

        {/* Subtle grid mesh overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
