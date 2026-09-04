import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Copy, Check, Bug, ShieldAlert, Terminal } from 'lucide-react';
import { Vulnerability, Severity } from '../types';

interface FindingsDossierProps {
  vulnerabilities: Vulnerability[];
  theme: 'cyber' | 'minimalist';
}

export default function FindingsDossier({ vulnerabilities, theme }: FindingsDossierProps) {
  const isMinimal = theme === 'minimalist';
  const [activeFilter, setActiveFilter] = useState<'ALL' | Severity>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filterOptions: ('ALL' | Severity)[] = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'];

  const filteredVulns = activeFilter === 'ALL'
    ? vulnerabilities
    : vulnerabilities.filter((v) => v.severity === activeFilter);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopyRemediation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/15 border-rose-500/40 text-rose-300';
      case 'HIGH':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'MEDIUM':
        return 'bg-yellow-500/15 border-yellow-500/40 text-yellow-300';
      case 'LOW':
        return 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300';
      case 'INFO':
        return 'bg-slate-500/15 border-slate-500/40 text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header and Filter Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bug className={`w-4 h-4 ${isMinimal ? 'text-[#2C2924]' : 'text-emerald-400'}`} />
          <h2
            className={`text-sm sm:text-base font-bold font-mono uppercase tracking-wide ${
              isMinimal ? 'text-[#2C2924]' : 'text-white'
            }`}
          >
            Audit Findings Dossier ({vulnerabilities.length} Total Findings)
          </h2>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterOptions.map((f) => {
            const count = f === 'ALL'
              ? vulnerabilities.length
              : vulnerabilities.filter((v) => v.severity === f).length;

            if (count === 0 && f !== 'ALL') return null;

            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all duration-150 ${
                  activeFilter === f
                    ? isMinimal
                      ? 'bg-[#2C2924] text-[#F4F1EA] shadow-sm'
                      : 'bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : isMinimal
                    ? 'bg-[#F4F1EA] border border-[#D8D2C5] text-[#767066] hover:bg-[#EAE5DB]'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredVulns.length === 0 ? (
          <div
            className={`p-8 rounded-2xl border text-center font-mono text-xs ${
              isMinimal ? 'minimalist-card text-[#767066]' : 'glass-panel text-white/50'
            }`}
          >
            No security findings matching current filter selection.
          </div>
        ) : (
          filteredVulns.map((vuln) => {
            const isExpanded = expandedId === vuln.id;

            return (
              <div
                key={vuln.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isMinimal
                    ? 'minimalist-card'
                    : 'glass-panel hover:border-white/20'
                }`}
              >
                {/* Finding Summary Bar */}
                <div
                  onClick={() => toggleExpand(vuln.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border ${getSeverityBadge(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>

                      <span
                        className={`text-[10px] uppercase font-mono tracking-wider ${
                          isMinimal ? 'text-[#767066]' : 'text-white/40'
                        }`}
                      >
                        {vuln.category}
                      </span>
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-bold font-mono ${
                        isMinimal ? 'text-[#2C2924]' : 'text-white'
                      }`}
                    >
                      {vuln.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle details"
                    className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                      isMinimal
                        ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#2C2924]'
                        : 'bg-white/5 border-white/10 text-white/70 hover:text-white'
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Expanded Details Dossier */}
                {isExpanded && (
                  <div
                    className={`px-4 pb-5 sm:px-5 border-t space-y-4 text-xs font-mono animate-[fadeIn_0.2s_ease_forwards] ${
                      isMinimal ? 'border-[#D8D2C5] bg-[#EAE5DB]/40' : 'border-white/10 bg-black/30'
                    }`}
                  >
                    {/* Description */}
                    <div className="pt-4 space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#767066]' : 'text-white/40'
                        }`}
                      >
                        Vulnerability Summary:
                      </span>
                      <p
                        className={`leading-relaxed ${
                          isMinimal ? 'text-[#2C2924]' : 'text-slate-200'
                        }`}
                      >
                        {vuln.description}
                      </p>
                    </div>

                    {/* Impact */}
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#767066]' : 'text-white/40'
                        }`}
                      >
                        Threat Impact:
                      </span>
                      <p
                        className={`leading-relaxed ${
                          isMinimal ? 'text-[#767066]' : 'text-white/70'
                        }`}
                      >
                        {vuln.impact}
                      </p>
                    </div>

                    {/* Observed Proof / Canary */}
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#767066]' : 'text-white/40'
                        }`}
                      >
                        Telemetry Evidence / Verification:
                      </span>
                      <div
                        className={`p-2.5 rounded-lg border font-mono text-[11px] break-all ${
                          isMinimal
                            ? 'bg-[#F4F1EA] border-[#D8D2C5] text-[#2C2924]'
                            : 'bg-black/60 border-white/10 text-emerald-300'
                        }`}
                      >
                        {vuln.proof}
                      </div>
                    </div>

                    {/* Remediation Directives */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold ${
                            isMinimal ? 'text-[#767066]' : 'text-white/40'
                          }`}
                        >
                          Defensive Remediation Protocol:
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyRemediation(vuln.id, vuln.remediation)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-mono transition-all active:scale-95 ${
                            copiedId === vuln.id
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : isMinimal
                              ? 'bg-[#F4F1EA] border-[#D8D2C5] text-[#2C2924] hover:bg-[#DFDACF]'
                              : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {copiedId === vuln.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Fix</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div
                        className={`p-3 rounded-lg border leading-relaxed ${
                          isMinimal
                            ? 'bg-[#DEE7DC]/50 border-[#C7D7C4] text-[#2A522E]'
                            : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
                        }`}
                      >
                        {vuln.remediation}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
