import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldCheck, ShieldAlert, FileText } from 'lucide-react';
import { ScanResult } from '../types';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ScanResult;
  theme: 'cyber' | 'minimalist';
}

export default function ExportReportModal({
  isOpen,
  onClose,
  result,
  theme,
}: ExportReportModalProps) {
  if (!isOpen) return null;
  const isMinimal = theme === 'minimalist';
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `
# VulnShield Executive Security Audit Report
**Target**: ${result.target}
**Audit Mode**: ${result.scan_mode}
**Posture Score**: ${result.score}/100 (Grade: ${result.grade})
**Scan Duration**: ${result.duration_seconds}s
**Generated**: ${new Date().toUTCString()}

## Severity Breakdown
- Critical: ${result.severity_counts.CRITICAL}
- High: ${result.severity_counts.HIGH}
- Medium: ${result.severity_counts.MEDIUM}
- Low: ${result.severity_counts.LOW}
- Info: ${result.severity_counts.INFO}

## Security Findings
${result.vulnerabilities.map((v, i) => `
### ${i + 1}. [${v.severity}] ${v.title}
- **Category**: ${v.category}
- **Summary**: ${v.description}
- **Impact**: ${v.impact}
- **Proof / Evidence**: \`${v.proof}\`
- **Remediation**: ${v.remediation}
`).join('\n')}

## Baseline Security Headers Status
${result.security_headers.map(h => `- ${h.header}: ${h.present ? 'IMPLEMENTED' : 'ABSENT'} (${h.present ? h.value : 'Fix: ' + h.recommendation})`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className={`w-full max-w-3xl max-h-[90vh] rounded-2xl border overflow-hidden flex flex-col shadow-2xl ${
          isMinimal ? 'bg-[#F8FAFC] border-[#CBD5E1]' : 'bg-[#040711] border-blue-500/30'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
            isMinimal ? 'border-[#CBD5E1]' : 'border-blue-500/20'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileText
              className={`w-4 h-4 shrink-0 ${isMinimal ? 'text-[#0F172A]' : 'text-blue-400'}`}
            />
            <h3
              className={`font-mono font-bold text-xs sm:text-sm truncate ${
                isMinimal ? 'text-[#0F172A]' : 'text-white'
              }`}
            >
              Executive Security Audit Dossier
            </h3>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-mono transition-all active:scale-95 ${
                copied
                  ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                  : isMinimal
                  ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-black/40 border-blue-500/25 text-slate-300 hover:text-blue-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden xs:inline sm:inline">{copied ? 'Copied' : 'Copy Markdown'}</span>
              <span className="xs:hidden sm:hidden">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-[11px] sm:text-xs font-mono transition-all active:scale-95 ${
                isMinimal
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-blue-600/20 border-blue-500/40 text-blue-300 hover:bg-blue-500/30'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isMinimal
                  ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
                  : 'bg-black/40 border-blue-500/25 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className={`p-4 sm:p-6 overflow-y-auto space-y-6 font-mono text-xs ${isMinimal ? 'text-[#0F172A]' : 'text-slate-200'}`}>
          {/* Executive Overview Box */}
          <div
            className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isMinimal ? 'bg-[#EEF2F6] border-[#CBD5E1]' : 'bg-[#070C1A] border-blue-500/20'
            }`}
          >
            <div className="min-w-0 w-full flex-1">
              <span className={`text-[10px] uppercase block ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'}`}>Evaluated Target</span>
              <span className={`text-xs sm:text-sm font-bold block truncate max-w-full ${isMinimal ? 'text-[#0F172A]' : 'text-white'}`}>{result.target}</span>
              <span className={`text-[10px] block mt-1 ${isMinimal ? 'text-[#64748B]' : 'text-slate-400'}`}>
                Mode: {result.scan_mode} • Duration: {result.duration_seconds}s
              </span>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <span className={`text-[10px] uppercase block ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'}`}>Final Rating</span>
              <span className="text-xl sm:text-2xl font-black text-blue-400">{result.score}/100 (GRADE {result.grade})</span>
            </div>
          </div>

          {/* Finding Count Tiles */}
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="p-2.5 rounded-lg border bg-rose-950/20 border-rose-500/30 text-rose-400">
              <div className="text-[9px] uppercase font-bold">Critical</div>
              <div className="text-base font-black">{result.severity_counts.CRITICAL}</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-amber-950/20 border-amber-500/30 text-amber-400">
              <div className="text-[9px] uppercase font-bold">High</div>
              <div className="text-base font-black">{result.severity_counts.HIGH}</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-yellow-950/20 border-yellow-500/30 text-yellow-400">
              <div className="text-[9px] uppercase font-bold">Medium</div>
              <div className="text-base font-black">{result.severity_counts.MEDIUM}</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-blue-950/20 border-blue-500/30 text-blue-400">
              <div className="text-[9px] uppercase font-bold">Low</div>
              <div className="text-base font-black">{result.severity_counts.LOW}</div>
            </div>
            <div className="p-2.5 rounded-lg border bg-slate-900/30 border-slate-700/40 text-slate-400">
              <div className="text-[9px] uppercase font-bold">Info</div>
              <div className="text-base font-black">{result.severity_counts.INFO}</div>
            </div>
          </div>

          {/* Detailed Vulnerability Findings */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isMinimal ? 'text-[#64748B]' : 'text-blue-400/70'}`}>
              Identified Vulnerability Entries
            </h4>
            {result.vulnerabilities.map((v, i) => (
              <div
                key={v.id}
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isMinimal ? 'bg-white border-[#CBD5E1]' : 'bg-[#070C1A] border-blue-500/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">{i + 1}. {v.title}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded border bg-blue-500/10 border-blue-500/30 text-blue-300">
                    {v.severity}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${isMinimal ? 'text-[#64748B]' : 'text-slate-300'}`}>{v.description}</p>
                <div className={`text-[10px] p-2.5 rounded-lg border leading-relaxed ${
                  isMinimal
                    ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
                    : 'bg-blue-950/25 border-blue-500/30 text-blue-200'
                }`}>
                  <span className="font-bold block text-blue-400">Remediation:</span>
                  {v.remediation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
