import React from 'react';
import { Globe, Search, ShieldCheck, Zap, X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { PresetTarget } from '../types';

interface TargetInputBarProps {
  target: string;
  onTargetChange: (val: string) => void;
  activeMode: boolean;
  onToggleActiveMode: () => void;
  loading: boolean;
  onRunScan: () => void;
  presets: PresetTarget[];
  onSelectPreset: (url: string) => void;
  theme: 'cyber' | 'minimalist';
}

export default function TargetInputBar({
  target,
  onTargetChange,
  activeMode,
  onToggleActiveMode,
  loading,
  onRunScan,
  presets,
  onSelectPreset,
  theme,
}: TargetInputBarProps) {
  const isMinimal = theme === 'minimalist';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (target.trim() && !loading) {
      onRunScan();
    }
  };

  return (
    <div className="space-y-4">
      {/* Doppelrand Target Input Shell */}
      <div className={isMinimal ? 'doppelrand-shell-minimal' : 'doppelrand-shell'}>
        <div className={`p-4 sm:p-5 ${isMinimal ? 'doppelrand-core-minimal' : 'doppelrand-core'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Row with Mode Toggle */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* URL Field */}
              <div
                className={`relative flex-1 flex items-center rounded-xl border px-3.5 py-2.5 transition-all duration-150 ${
                  isMinimal
                    ? 'bg-[#F4F1EA] border-[#D8D2C5] focus-within:border-[#2C2924] focus-within:shadow-[0_0_0_2px_rgba(44,41,36,0.1)]'
                    : 'bg-black/40 border-white/10 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                }`}
              >
                <Globe
                  className={`w-4 h-4 mr-2.5 shrink-0 ${
                    isMinimal ? 'text-[#767066]' : 'text-emerald-400'
                  }`}
                />
                <input
                  type="text"
                  value={target}
                  onChange={(e) => onTargetChange(e.target.value)}
                  placeholder="Enter target domain or URL (e.g. testphp.vulnweb.com or https://example.com)..."
                  disabled={loading}
                  className={`w-full bg-transparent text-xs sm:text-sm font-mono outline-none ${
                    isMinimal
                      ? 'text-[#2C2924] placeholder:text-[#A8A196]'
                      : 'text-white placeholder:text-white/35'
                  }`}
                />

                {target && !loading && (
                  <button
                    type="button"
                    onClick={() => onTargetChange('')}
                    title="Clear input"
                    className="p-1 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Mode Toggle Button */}
              <button
                type="button"
                onClick={onToggleActiveMode}
                disabled={loading}
                className={`flex items-center justify-between lg:justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono transition-all duration-150 ${
                  activeMode
                    ? isMinimal
                      ? 'bg-[#DEE7DC] border-[#2A522E] text-[#2A522E] font-semibold'
                      : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                    : isMinimal
                    ? 'bg-[#F4F1EA] border-[#D8D2C5] text-[#767066] hover:text-[#2C2924]'
                    : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {activeMode ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>ACTIVE FUZZING (PROBES)</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PASSIVE AUDIT ONLY</span>
                  </>
                )}
              </button>

              {/* Primary Scan Trigger Button */}
              <button
                type="submit"
                disabled={loading || !target.trim()}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wide transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isMinimal
                    ? 'bg-[#2C2924] text-[#F4F1EA] hover:bg-[#3D3A34] shadow-md'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_24px_rgba(16,185,129,0.4)]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>PROBING TARGET...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>INITIATE AUDIT</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets & Legal Safety Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-mono tracking-wider ${
                    isMinimal ? 'text-[#767066]' : 'text-white/40'
                  }`}
                >
                  Benchmark Targets:
                </span>
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPreset(p.url)}
                    disabled={loading}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all duration-150 ${
                      isMinimal
                        ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#2C2924] hover:bg-[#DFDACF]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    {p.name.split(' (')[0]}
                  </button>
                ))}
              </div>

              <div
                className={`flex items-center gap-1.5 text-[10px] font-mono ${
                  isMinimal ? 'text-[#767066]' : 'text-white/40'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>Only audit targets with authorized consent</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
