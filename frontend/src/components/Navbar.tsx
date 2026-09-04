import React from 'react';
import { ShieldAlert, Sun, Moon, Github, Radio } from 'lucide-react';

interface NavbarProps {
  systemOnline: boolean;
  engineName: string;
  theme: 'cyber' | 'minimalist';
  onToggleTheme: () => void;
}

export default function Navbar({
  systemOnline,
  engineName,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const isMinimal = theme === 'minimalist';

  return (
    <header className="sticky top-4 sm:top-6 z-50 px-4 sm:px-6 w-full max-w-7xl mx-auto transition-colors duration-150">
      <nav
        className={`w-full px-4 sm:px-6 py-3 rounded-full flex items-center justify-between gap-4 transition-colors duration-150 ${
          isMinimal
            ? 'bg-[#F4F1EA]/95 border border-[#D8D2C5] shadow-[0_2px_12px_rgba(44,38,27,0.06)]'
            : 'glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
        }`}
      >
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-150 ${
              isMinimal
                ? 'bg-[#2C2924] text-[#F4F1EA]'
                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`font-bold tracking-tight text-sm ${
                isMinimal ? 'font-sans-clean text-[#2C2924]' : 'font-mono text-white'
              }`}
            >
              VULNSHIELD
            </span>
            <span
              className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full ${
                isMinimal
                  ? 'bg-[#DEE7DC] text-[#2A522E] border border-[#C7D7C4]'
                  : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              PEN-AUDITOR
            </span>
          </div>
        </div>

        {/* Engine Status & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Capsule */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono transition-colors duration-150 ${
              isMinimal
                ? 'bg-[#EAE5DB] text-[#767066] border border-[#D8D2C5]'
                : 'bg-white/5 border border-white/10 text-white/70'
            }`}
          >
            <Radio
              className={`w-3 h-3 ${
                systemOnline ? 'text-emerald-400 animate-pulse' : 'text-cyan-400'
              }`}
            />
            <span className="text-[10px] uppercase tracking-wider font-semibold">
              {systemOnline ? 'FASTAPI ENGINE ACTIVE' : 'CLIENT-SIDE SECURE'}
            </span>
          </div>

          {/* Theme Switcher Island */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Minimalist Theme"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors duration-150 active:scale-95 ${
              isMinimal
                ? 'bg-[#EAE5DB] border border-[#D8D2C5] text-[#2C2924] hover:bg-[#DFDACF]'
                : 'bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {isMinimal ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#2C2924]" />
                <span className="hidden sm:inline">Cyber</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Minimal</span>
              </>
            )}
          </button>

          {/* GitHub Island */}
          <a
            href="https://github.com/nyzxis/vulnshield"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-colors duration-150 active:scale-95 ${
              isMinimal
                ? 'bg-[#2C2924] text-[#F4F1EA] hover:bg-[#3D3A34]'
                : 'bg-white/10 border border-white/15 text-white hover:bg-white/20 hover:border-emerald-500/40'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">nyzxis</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
