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
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg ${
              isMinimal ? 'bg-[#E2E8F0] text-[#0F172A]' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
            }`}
          >
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <h2
              className={`text-sm sm:text-base font-bold font-mono uppercase tracking-wide ${
                isMinimal ? 'text-[#0F172A]' : 'text-white'
              }`}
            >
              CLASSIFIED INCIDENT DOSSIER // VULNERABILITY AUDIT
            </h2>
            <p className={`text-[11px] font-mono ${isMinimal ? 'text-[#64748B]' : 'text-slate-400'}`}>
              Categorized attack vectors &amp; automated proof-of-concept verification ({vulnerabilities.length} Findings)
            </p>
          </div>
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
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-150 ${
                  activeFilter === f
                    ? isMinimal
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-blue-600 border border-blue-400 text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                    : isMinimal
                    ? 'bg-[#FFFFFF] border border-[#CBD5E1] text-[#64748B] hover:bg-[#E2E8F0]'
                    : 'bg-[#070C1A] border border-blue-500/20 text-slate-300 hover:text-blue-300 hover:bg-blue-500/10'
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
              isMinimal ? 'bg-[#F8FAFC] border-[#CBD5E1] text-[#64748B]' : 'soc-panel text-white/50'
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
                    ? 'bg-[#F8FAFC] border-[#CBD5E1]'
                    : 'bg-[#070C1A] border-blue-500/20 hover:border-blue-500/40'
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
                        className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${getSeverityBadge(
                          vuln.severity
                        )}`}
                      >
                        {vuln.severity}
                      </span>

                      <span
                        className={`text-[10px] uppercase font-mono tracking-wider ${
                          isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'
                        }`}
                      >
                        {vuln.category}
                      </span>
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-bold font-mono ${
                        isMinimal ? 'text-[#0F172A]' : 'text-white'
                      }`}
                    >
                      {vuln.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    aria-label="Toggle details"
                    className={`p-2 rounded-lg border transition-colors shrink-0 ${
                      isMinimal
                        ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
                        : 'bg-[#040711] border-blue-500/25 text-blue-400 hover:text-white'
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
                    className={`px-4 pb-5 sm:px-6 border-t space-y-4 text-xs font-mono animate-[fadeIn_0.2s_ease_forwards] ${
                      isMinimal ? 'border-[#CBD5E1] bg-[#EEF2F6]/50' : 'border-blue-500/15 bg-[#040711]/70'
                    }`}
                  >
                    {/* Description */}
                    <div className="pt-4 space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                        }`}
                      >
                        Vulnerability Summary:
                      </span>
                      <p
                        className={`leading-relaxed ${
                          isMinimal ? 'text-[#0F172A]' : 'text-slate-200'
                        }`}
                      >
                        {vuln.description}
                      </p>
                    </div>

                    {/* Impact */}
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                        }`}
                      >
                        Threat Impact:
                      </span>
                      <p
                        className={`leading-relaxed ${
                          isMinimal ? 'text-[#64748B]' : 'text-white/70'
                        }`}
                      >
                        {vuln.impact}
                      </p>
                    </div>

                    {/* Observed Proof / Canary */}
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] uppercase tracking-wider block font-bold ${
                          isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                        }`}
                      >
                        Telemetry Evidence / Verification:
                      </span>
                      <div
                        className={`p-3 rounded-xl border font-mono text-[11px] break-all ${
                          isMinimal
                            ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A]'
                            : 'bg-[#040711] border-blue-500/25 text-cyan-300'
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
                            isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'
                          }`}
                        >
                          Defensive Remediation Protocol:
                        </span>

                        <button
                          type="button"
                          onClick={() => handleCopyRemediation(vuln.id, vuln.remediation)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-mono transition-all active:scale-95 ${
                            copiedId === vuln.id
                              ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                              : isMinimal
                              ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                              : 'bg-black/40 border-blue-500/20 text-slate-300 hover:text-blue-300 hover:border-blue-500/40'
                          }`}
                        >
                          {copiedId === vuln.id ? (
                            <>
                              <Check className="w-3 h-3 text-blue-400" />
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
                        className={`p-3 rounded-xl border leading-relaxed ${
                          isMinimal
                            ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
                            : 'bg-blue-950/25 border-blue-500/30 text-blue-200'
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
