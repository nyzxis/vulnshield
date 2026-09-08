import React, { useState } from 'react';
import { CheckCircle2, XCircle, Copy, Check, Shield } from 'lucide-react';
import { SecurityHeader } from '../types';

interface SecurityHeadersGridProps {
  headers: SecurityHeader[];
  theme: 'cyber' | 'minimalist';
}

export default function SecurityHeadersGrid({ headers, theme }: SecurityHeadersGridProps) {
  const isMinimal = theme === 'minimalist';
  const [copiedHeader, setCopiedHeader] = useState<string | null>(null);

  const handleCopy = (header: string, recommendation: string) => {
    navigator.clipboard.writeText(`${header}: ${recommendation}`);
    setCopiedHeader(header);
    setTimeout(() => setCopiedHeader(null), 1800);
  };

  const presentCount = headers.filter((h) => h.present).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-lg ${
              isMinimal ? 'bg-[#E2E8F0] text-[#0F172A]' : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
            }`}
          >
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h2
              className={`text-sm sm:text-base font-bold font-mono uppercase tracking-wide ${
                isMinimal ? 'text-[#0F172A]' : 'text-white'
              }`}
            >
              PERIMETER DEFENSE MATRIX // HTTP HEADERS BASELINE
            </h2>
            <p className={`text-[11px] font-mono ${isMinimal ? 'text-[#64748B]' : 'text-slate-400'}`}>
              Monitored HTTP attack surface boundaries • {presentCount}/{headers.length} Directives Active
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-mono px-3 py-1 rounded-lg border font-bold ${
            presentCount === headers.length
              ? 'bg-blue-500/15 border-blue-500/40 text-blue-300 shadow-[0_0_12px_rgba(37,99,235,0.25)]'
              : presentCount >= 3
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {presentCount === headers.length
            ? 'PERIMETER HARDENED'
            : presentCount >= 3
            ? 'PARTIALLY HARDENED'
            : 'DEFENSE WEAKNESS'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {headers.map((item) => (
          <div
            key={item.header}
            className={`rounded-xl border p-4 flex flex-col justify-between transition-all duration-150 ${
              isMinimal
                ? 'bg-[#F8FAFC] border-[#CBD5E1]'
                : 'bg-[#070C1A] border-blue-500/15 hover:border-blue-500/35'
            }`}
          >
            <div>
              {/* Header Title & Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3
                    className={`text-xs font-bold font-mono leading-snug ${
                      isMinimal ? 'text-[#0F172A]' : 'text-white'
                    }`}
                  >
                    {item.header}
                  </h3>
                  <span
                    className={`text-[10px] font-mono ${
                      isMinimal ? 'text-[#64748B]' : 'text-blue-400/60'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                {item.present ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-blue-500/15 border-blue-500/35 text-blue-300 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-rose-500/15 border-rose-500/35 text-rose-400 shrink-0">
                    <XCircle className="w-3 h-3" />
                    FAIL
                  </span>
                )}
              </div>

              {/* Observed Value or Description */}
              <div
                className={`p-2.5 rounded-lg text-[11px] font-mono break-all mb-3 ${
                  item.present
                    ? isMinimal
                      ? 'bg-[#EEF2F6] text-[#0F172A]'
                      : 'bg-[#040711] border border-blue-500/20 text-slate-200'
                    : isMinimal
                    ? 'bg-rose-50 border border-rose-200 text-rose-800'
                    : 'bg-rose-950/25 border border-rose-500/30 text-rose-300'
                }`}
              >
                {item.present ? item.value : 'Header absent from server responses.'}
              </div>
            </div>

            {/* Directive Recommendation with Copy Action */}
            <div
              className={`pt-2 border-t flex items-center justify-between gap-2 text-[10px] font-mono ${
                isMinimal ? 'border-[#CBD5E1]' : 'border-blue-500/15'
              }`}
            >
              <span
                className={`truncate ${
                  isMinimal ? 'text-[#64748B]' : 'text-slate-400'
                }`}
                title={`Recommended: ${item.recommendation}`}
              >
                Fix: {item.recommendation}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(item.header, item.recommendation)}
                title="Copy recommended header snippet"
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded border transition-all active:scale-95 ${
                  copiedHeader === item.header
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : isMinimal
                    ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A] hover:bg-[#E2E8F0]'
                    : 'bg-black/40 border-blue-500/20 text-slate-300 hover:text-blue-300 hover:border-blue-500/40'
                }`}
              >
                {copiedHeader === item.header ? (
                  <>
                    <Check className="w-3 h-3 text-blue-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
