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
      {/* SOC Target Command Terminal Shell */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 transition-all duration-150 ${
          isMinimal ? 'bg-[#F8FAFC] border-[#CBD5E1]' : 'soc-panel'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Header */}
          <div className="flex items-center justify-between border-b pb-3 border-current/10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold">
                RADAR VECTOR
              </span>
              <span className={`text-xs font-mono font-bold ${isMinimal ? 'text-[#0F172A]' : 'text-white'}`}>
                TARGET URL &amp; ATTACK SURFACE SPECIFICATION
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono opacity-50">
              <span>PROTOCOL: HTTP/S</span>
              <span>•</span>
              <span>CANARIES: ARMED</span>
            </div>
          </div>

          {/* Input Row with Mode Toggle */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* URL Field */}
            <div
              className={`relative flex-1 flex items-center rounded-xl border px-4 py-3 transition-all duration-150 ${
                isMinimal
                  ? 'bg-[#FFFFFF] border-[#CBD5E1] focus-within:border-[#0F172A] focus-within:shadow-[0_0_0_2px_rgba(15,23,42,0.1)]'
                  : 'bg-[#040711] border-blue-500/25 focus-within:border-blue-500 focus-within:shadow-[0_0_20px_rgba(37,99,235,0.25)]'
              }`}
            >
              <Globe
                className={`w-4 h-4 mr-3 shrink-0 ${
                  isMinimal ? 'text-[#64748B]' : 'text-blue-400'
                }`}
              />
              <input
                type="text"
                value={target}
                onChange={(e) => onTargetChange(e.target.value)}
                placeholder="Specify target domain or URL (e.g. testphp.vulnweb.com or https://example.com)..."
                disabled={loading}
                className={`w-full bg-transparent text-xs sm:text-sm font-mono outline-none ${
                  isMinimal
                    ? 'text-[#0F172A] placeholder:text-[#94A3B8]'
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
              className={`flex items-center justify-between lg:justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-mono transition-all duration-150 ${
                activeMode
                  ? isMinimal
                    ? 'bg-[#E2E8F0] border-[#0F172A] text-[#0F172A] font-bold'
                    : 'bg-blue-600/20 border-blue-500/40 text-blue-300 font-bold shadow-[0_0_14px_rgba(37,99,235,0.25)]'
                  : isMinimal
                  ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#64748B] hover:text-[#0F172A]'
                  : 'bg-black/40 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {activeMode ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
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
              className={`flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-mono text-xs sm:text-sm font-bold tracking-wide transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                isMinimal
                  ? 'bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-md'
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_24px_rgba(37,99,235,0.45)]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>SCANNING VECTORS...</span>
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
                  isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                }`}
              >
                Benchmark Vectors:
              </span>
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectPreset(p.url)}
                  disabled={loading}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all duration-150 ${
                    isMinimal
                      ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                      : 'bg-[#070C1A] border-blue-500/20 text-slate-300 hover:text-blue-300 hover:bg-blue-500/10 hover:border-blue-500/40'
                  }`}
                >
                  {p.name.split(' (')[0]}
                </button>
              ))}
            </div>

            <div
              className={`flex items-center gap-1.5 text-[10px] font-mono ${
                isMinimal ? 'text-[#64748B]' : 'text-white/40'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Only audit targets with explicit authorized consent</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
