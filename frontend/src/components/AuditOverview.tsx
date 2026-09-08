import React from 'react';
import { ShieldCheck, AlertCircle, Clock, Globe, FileDown, RefreshCw, Radar, ShieldAlert } from 'lucide-react';
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
    if (score >= 85) return '#38bdf8'; // radar cyan
    if (score >= 70) return '#3b82f6'; // cobalt blue
    if (score >= 50) return '#f59e0b'; // amber
    return '#dc2626'; // threat crimson
  };

  const getDefconStatus = () => {
    if (score < 50) {
      return {
        level: 'DEFCON 1',
        label: 'MAXIMUM ALERT',
        badge: 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-[0_0_16px_rgba(220,38,38,0.3)]',
        desc: 'Critical vulnerabilities actively exposed. Intrusion vectors primed.',
      };
    }
    if (score < 70) {
      return {
        level: 'DEFCON 2',
        label: 'HIGH THREAT',
        badge: 'bg-orange-500/20 border-orange-500/50 text-orange-300 shadow-[0_0_16px_rgba(249,115,22,0.3)]',
        desc: 'High severity attack vectors present. Immediate remediation advised.',
      };
    }
    if (score < 85) {
      return {
        level: 'DEFCON 3',
        label: 'ELEVATED RISK',
        badge: 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.3)]',
        desc: 'Missing key perimeter defense headers and configuration anomalies.',
      };
    }
    return {
      level: 'DEFCON 5',
      label: 'NOMINAL DEFENSE',
      badge: 'bg-blue-500/20 border-blue-500/50 text-blue-300 shadow-[0_0_16px_rgba(37,99,235,0.3)]',
      desc: 'Robust perimeter defense. Automated intrusion vectors thwarted.',
    };
  };

  const defcon = getDefconStatus();

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-all duration-150 ${
        isMinimal
          ? 'bg-[#F8FAFC] border-[#CBD5E1]'
          : 'soc-panel border-blue-500/20'
      }`}
    >
      <div className="flex flex-col gap-5">
        {/* Section 1: Radial Posture Score Dial & DEFCON Level */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-5 border-b border-inherit">
          <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
              {/* Background Track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={isMinimal ? '#CBD5E1' : 'rgba(37,99,235,0.12)'}
                strokeWidth="11"
              />
              {/* Animated Value Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={getScoreColor()}
                strokeWidth="11"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: isMinimal ? 'none' : `drop-shadow(0 0 10px ${getScoreColor()}88)`,
                }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`text-3xl font-black font-mono tracking-tighter ${
                  isMinimal ? 'text-[#0F172A]' : 'text-white'
                }`}
              >
                {score}
              </span>
              <span
                className={`text-[9px] uppercase font-mono tracking-widest ${
                  isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                }`}
              >
                Posture Score
              </span>
            </div>
          </div>

          <div className="text-center sm:text-left space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span
                className={`text-xs font-black font-mono px-3 py-1 rounded-lg border tracking-wider ${defcon.badge}`}
              >
                {defcon.level} • {defcon.label}
              </span>
            </div>

            <div className="text-xs font-mono font-bold">
              POSTURE GRADE: <span className="text-blue-400">CLASS-{grade}</span>
            </div>

            <p
              className={`text-xs font-mono leading-relaxed ${
                isMinimal ? 'text-[#64748B]' : 'text-slate-300'
              }`}
            >
              {defcon.desc}
            </p>
          </div>
        </div>

        {/* Section 2: Telemetry & Target Details */}
        <div className="space-y-3 pb-5 border-b border-inherit min-w-0">
          <div className="space-y-1 min-w-0">
            <span className={`text-[10px] uppercase font-mono tracking-wider block ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'}`}>
              Audited Surface Target:
            </span>
            <div className="flex items-center gap-2 min-w-0 max-w-full">
              <Globe
                className={`w-4 h-4 shrink-0 ${
                  isMinimal ? 'text-[#0F172A]' : 'text-blue-400'
                }`}
              />
              <span
                className={`text-xs font-mono font-bold truncate min-w-0 flex-1 ${
                  isMinimal ? 'text-[#0F172A]' : 'text-white'
                }`}
                title={target}
              >
                {target}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div
              className={`p-2.5 rounded-xl border ${
                isMinimal
                  ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-[#040711] border-blue-500/20 text-slate-200'
              }`}
            >
              <span className={`block text-[9px] uppercase tracking-wider ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'}`}>
                Surveillance Mode
              </span>
              <span className="font-semibold">{scan_mode}</span>
            </div>

            <div
              className={`p-2.5 rounded-xl border ${
                isMinimal
                  ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-[#040711] border-blue-500/20 text-slate-200'
              }`}
            >
              <span className={`block text-[9px] uppercase tracking-wider ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'}`}>
                Probe Latency
              </span>
              <span className="font-semibold">{duration_seconds}s</span>
            </div>
          </div>
        </div>

        {/* Section 3: Severity Findings Breakdown & Actions */}
        <div className="space-y-3 font-mono">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold block ${
              isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
            }`}
          >
            Tactical Findings Breakdown:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="flex items-center justify-between p-2 rounded-xl border bg-rose-950/20 border-rose-500/30 text-rose-400">
              <span className="text-[10px] font-bold uppercase">Crit</span>
              <span className="text-sm font-black">{severity_counts.CRITICAL}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl border bg-amber-950/20 border-amber-500/30 text-amber-400">
              <span className="text-[10px] font-bold uppercase">High</span>
              <span className="text-sm font-black">{severity_counts.HIGH}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl border bg-yellow-950/20 border-yellow-500/30 text-yellow-400">
              <span className="text-[10px] font-bold uppercase">Med</span>
              <span className="text-sm font-black">{severity_counts.MEDIUM}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl border bg-blue-950/20 border-blue-500/30 text-blue-400">
              <span className="text-[10px] font-bold uppercase">Low</span>
              <span className="text-sm font-black">{severity_counts.LOW}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenExportModal}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all duration-150 active:scale-95 shadow-md ${
                isMinimal
                  ? 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
                  : 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(37,99,235,0.35)]'
              }`}
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>EXPORT WAR ROOM DOSSIER</span>
            </button>

            <button
              onClick={onReScan}
              title="Re-run audit vectors"
              className={`p-2.5 rounded-xl border transition-all duration-150 active:scale-95 shrink-0 ${
                isMinimal
                  ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                  : 'bg-[#040711] border-blue-500/20 text-slate-300 hover:text-blue-300 hover:border-blue-500/50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
