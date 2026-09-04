import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Globe, FileDown, RefreshCw } from 'lucide-react';
import { ScanResult } from '../types';

interface AuditOverviewProps {
  result: ScanResult;
  onReScan: () => void;
  onOpenExportModal: () => void;
  theme: 'cyber' | 'minimalist';
}

export default function AuditOverview({
  result,
  onReScan,
  onOpenExportModal,
  theme,
}: AuditOverviewProps) {
  const isMinimal = theme === 'minimalist';
  const { score, grade, severity_counts, target, duration_seconds, scan_mode } = result;

  // Circle circumference calculation for radial dial
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 85) return '#10b981'; // emerald
    if (score >= 70) return '#06b6d4'; // cyan
    if (score >= 50) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  const getGradeBadgeClass = () => {
    if (score >= 85) return 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300';
    if (score >= 70) return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
    if (score >= 50) return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
    return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
  };

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-150 ${
        isMinimal
          ? 'minimalist-card'
          : 'glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Radial Posture Score Dial */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={isMinimal ? '#D8D2C5' : 'rgba(255,255,255,0.08)'}
                strokeWidth="10"
              />
              {/* Animated Value Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={getScoreColor()}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isMinimal ? 'none' : `drop-shadow(0 0 8px ${getScoreColor()}66)`,
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-3xl font-black font-mono tracking-tighter ${
                  isMinimal ? 'text-[#2C2924]' : 'text-white'
                }`}
              >
                {score}
              </span>
              <span
                className={`text-[10px] uppercase font-mono tracking-wider ${
                  isMinimal ? 'text-[#767066]' : 'text-white/40'
                }`}
              >
                Posture Score
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left space-y-1.5">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`text-xl font-black font-mono px-2.5 py-0.5 rounded-lg border ${getGradeBadgeClass()}`}
              >
                GRADE {grade}
              </span>
            </div>
            <p
              className={`text-xs font-mono leading-relaxed max-w-[24ch] ${
                isMinimal ? 'text-[#767066]' : 'text-white/50'
              }`}
            >
              {score >= 80
                ? 'Strong defenses. Hardened against automated intrusion.'
                : score >= 50
                ? 'Moderate exposure. Remediate missing defense headers.'
                : 'High vulnerability exposure. Immediate patching required.'}
            </p>
          </div>
        </div>

        {/* Center Column: Telemetry & Target Details */}
        <div
          className={`lg:col-span-5 border-y lg:border-y-0 lg:border-x py-4 lg:py-0 lg:px-6 space-y-3 ${
            isMinimal ? 'border-[#D8D2C5]' : 'border-white/10'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe
              className={`w-4 h-4 shrink-0 ${
                isMinimal ? 'text-[#2C2924]' : 'text-emerald-400'
              }`}
            />
            <span
              className={`text-xs font-mono truncate ${
                isMinimal ? 'text-[#2C2924]' : 'text-white'
              }`}
              title={target}
            >
              {target}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div
              className={`p-2 rounded-lg border ${
                isMinimal
                  ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#767066]'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Audit Mode</span>
              <span className="font-semibold">{scan_mode}</span>
            </div>

            <div
              className={`p-2 rounded-lg border ${
                isMinimal
                  ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#767066]'
                  : 'bg-white/5 border-white/10 text-white/60'
              }`}
            >
              <span className="block text-[9px] uppercase tracking-wider text-white/40">Latency</span>
              <span className="font-semibold">{duration_seconds}s</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenExportModal}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-mono transition-all duration-150 active:scale-95 ${
                isMinimal
                  ? 'bg-[#2C2924] text-[#F4F1EA] hover:bg-[#3D3A34]'
                  : 'bg-white/10 border-white/15 text-white hover:bg-white/20 hover:border-white/30'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>

            <button
              onClick={onReScan}
              title="Re-run audit"
              className={`p-2 rounded-lg border transition-all duration-150 active:scale-95 ${
                isMinimal
                  ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#2C2924] hover:bg-[#DFDACF]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Severity Findings Breakdown */}
        <div className="lg:col-span-3 flex flex-col justify-center gap-2 font-mono">
          <span
            className={`text-[10px] uppercase tracking-wider ${
              isMinimal ? 'text-[#767066]' : 'text-white/40'
            }`}
          >
            Finding Breakdown
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 rounded-lg border bg-rose-500/10 border-rose-500/25 text-rose-400">
              <span className="text-[10px] font-semibold uppercase">Critical</span>
              <span className="text-sm font-bold">{severity_counts.CRITICAL}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border bg-amber-500/10 border-amber-500/25 text-amber-400">
              <span className="text-[10px] font-semibold uppercase">High</span>
              <span className="text-sm font-bold">{severity_counts.HIGH}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border bg-yellow-500/10 border-yellow-500/25 text-yellow-400">
              <span className="text-[10px] font-semibold uppercase">Medium</span>
              <span className="text-sm font-bold">{severity_counts.MEDIUM}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg border bg-cyan-500/10 border-cyan-500/25 text-cyan-400">
              <span className="text-[10px] font-semibold uppercase">Low</span>
              <span className="text-sm font-bold">{severity_counts.LOW}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
