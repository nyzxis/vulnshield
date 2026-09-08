import React from 'react';
import { ShieldAlert, Sun, Moon, Radio, Crosshair, Radar } from 'lucide-react';

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
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200">
      {/* Top War Room Telemetry Breadcrumb */}
      <div
        className={`w-full border-b text-[11px] font-mono px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 transition-colors ${
          isMinimal
            ? 'bg-[#E2E8F0] border-[#CBD5E1] text-[#475569]'
            : 'bg-[#03060E]/90 border-blue-500/15 text-blue-400/80'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span className="opacity-40 select-none">[SOC-WAR-ROOM]</span>
          <a
            href="https://nyzxis.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-1 font-semibold"
          >
            <span>✦ ARFA DANIAL</span>
            <span className="opacity-40">/</span>
            <span>PORTFOLIO</span>
          </a>
          <span className="opacity-40">›</span>
          <span className="opacity-75">DEFENSE SUITE</span>
          <span className="opacity-40">›</span>
          <span
            className={`font-black flex items-center gap-1.5 ${
              isMinimal ? 'text-[#0F172A]' : 'text-blue-300'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>VULNSHIELD</span>
          </span>
        </div>

        {/* Global Coordinates & Cross-Suite Links */}
        <div className="flex items-center gap-3 text-[10px]">
          <div className="hidden lg:flex items-center gap-2 opacity-60">
            <span>COORD: 37.7749°N 122.4194°W</span>
            <span>|</span>
            <span>SECTOR: 07-SOC</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-semibold">
            <span className="opacity-40">SUITE:</span>
            <a
              href="https://apishield-pi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              APIShield
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://malguard.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-400 transition-colors"
            >
              MalGuard
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://pwsec-nyz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors"
            >
              KeyVault
            </a>
            <span className="opacity-40">•</span>
            <a
              href="https://phishingdetector-nyzxis.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              PhishGuard
            </a>
          </div>
        </div>
      </div>

      {/* Main SOC Command Bar */}
      <div
        className={`px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors ${
          isMinimal
            ? 'bg-[#EEF2F6]/95 border-b border-[#CBD5E1]'
            : 'bg-[#040711]/90 border-b border-blue-500/20'
        }`}
      >
        {/* Brand & Radar Signature */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isMinimal
                ? 'bg-[#0F172A] border-[#0F172A] text-white shadow-sm'
                : 'bg-blue-600/15 border-blue-500/40 text-blue-400 shadow-[0_0_16px_rgba(37,99,235,0.35)]'
            }`}
          >
            <Crosshair className="w-5 h-5 animate-[spin_12s_linear_infinite]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-black tracking-wider text-base font-mono ${
                  isMinimal ? 'text-[#0F172A]' : 'text-white'
                }`}
              >
                VULNSHIELD
              </span>
              <span
                className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded border font-bold ${
                  isMinimal
                    ? 'bg-[#E2E8F0] text-[#0F172A] border-[#CBD5E1]'
                    : 'bg-blue-500/15 border-blue-500/35 text-blue-300 shadow-[0_0_10px_rgba(37,99,235,0.2)]'
                }`}
              >
                SOC::COMMAND
              </span>
            </div>
            <p
              className={`text-[10px] font-mono leading-none mt-0.5 ${
                isMinimal ? 'text-[#64748B]' : 'text-slate-400'
              }`}
            >
              GLOBAL WEB PEN-TESTING &amp; CANARY AUDIT ENGINE
            </p>
          </div>
        </div>

        {/* Engine Telemetry, Theme Toggle, & Repo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Engine Status Chip */}
          <div
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors ${
              isMinimal
                ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A]'
                : 'bg-[#070C1A] border-blue-500/25 text-slate-200'
            }`}
          >
            <Radio
              className={`w-3.5 h-3.5 ${
                systemOnline ? 'text-blue-400 animate-pulse' : 'text-cyan-400'
              }`}
            />
            <span className="text-[10px] uppercase tracking-wider font-bold">
              {systemOnline ? 'WAR-ROOM KERNEL: ONLINE' : 'CLIENT-SIDE HEURISTICS'}
            </span>
          </div>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme"
            className={`p-2 rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isMinimal
                ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                : 'bg-[#070C1A] border-blue-500/25 text-blue-400 hover:bg-blue-500/15 hover:border-blue-500/50'
            }`}
            title={`Switch to ${isMinimal ? 'War Room Dark' : 'Aviation Blueprint'} mode`}
          >
            {isMinimal ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-blue-300" />}
          </button>

          {/* GitHub Source Link with inline SVG */}
          <a
            href="https://github.com/nyzxis/vulnshield"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className={`p-2 rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isMinimal
                ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                : 'bg-[#070C1A] border-blue-500/25 text-slate-300 hover:text-blue-300 hover:border-blue-500/50'
            }`}
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
