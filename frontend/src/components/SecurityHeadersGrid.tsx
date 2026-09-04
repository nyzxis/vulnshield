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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield
            className={`w-4 h-4 ${isMinimal ? 'text-[#2C2924]' : 'text-emerald-400'}`}
          />
          <h2
            className={`text-sm sm:text-base font-bold font-mono uppercase tracking-wide ${
              isMinimal ? 'text-[#2C2924]' : 'text-white'
            }`}
          >
            HTTP Defense Headers Baseline ({presentCount}/{headers.length} Implemented)
          </h2>
        </div>

        <span
          className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
            presentCount === headers.length
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : presentCount >= 3
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          {presentCount === headers.length
            ? 'FULLY HARDENED'
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
                ? 'minimalist-card'
                : 'glass-panel hover:border-white/20'
            }`}
          >
            <div>
              {/* Header Title & Status Badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3
                    className={`text-xs font-bold font-mono leading-snug ${
                      isMinimal ? 'text-[#2C2924]' : 'text-white'
                    }`}
                  >
                    {item.header}
                  </h3>
                  <span
                    className={`text-[10px] font-mono ${
                      isMinimal ? 'text-[#767066]' : 'text-white/40'
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                {item.present ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0">
                    <XCircle className="w-3 h-3" />
                    FAIL
                  </span>
                )}
              </div>

              {/* Observed Value or Description */}
              <div
                className={`p-2 rounded-lg text-[11px] font-mono break-all mb-3 ${
                  item.present
                    ? isMinimal
                      ? 'bg-[#EAE5DB] text-[#2C2924]'
                      : 'bg-white/5 text-slate-200'
                    : isMinimal
                    ? 'bg-rose-50 text-rose-800'
                    : 'bg-rose-950/20 text-rose-300'
                }`}
              >
                {item.present ? item.value : 'Header absent from server responses.'}
              </div>
            </div>

            {/* Directive Recommendation with Copy Action */}
            <div
              className={`pt-2 border-t flex items-center justify-between gap-2 text-[10px] font-mono ${
                isMinimal ? 'border-[#D8D2C5]' : 'border-white/10'
              }`}
            >
              <span
                className={`truncate ${
                  isMinimal ? 'text-[#767066]' : 'text-white/50'
                }`}
                title={`Recommended: ${item.recommendation}`}
              >
                Fix: {item.recommendation}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(item.header, item.recommendation)}
                title="Copy recommended header snippet"
                className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-md border transition-all active:scale-95 ${
                  copiedHeader === item.header
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : isMinimal
                    ? 'bg-[#F4F1EA] border-[#D8D2C5] text-[#2C2924] hover:bg-[#EAE5DB]'
                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {copiedHeader === item.header ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
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
