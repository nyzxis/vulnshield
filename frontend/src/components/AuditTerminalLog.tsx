import React, { useState } from 'react';
import { Terminal, ChevronDown, ChevronUp } from 'lucide-react';
import { ScanLog } from '../types';

interface AuditTerminalLogProps {
  logs: ScanLog[];
  theme: 'cyber' | 'minimalist';
}

export default function AuditTerminalLog({ logs, theme }: AuditTerminalLogProps) {
  const isMinimal = theme === 'minimalist';
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ALERT':
        return 'text-rose-400 font-bold';
      case 'SUCCESS':
        return 'text-emerald-400 font-semibold';
      case 'ERROR':
        return 'text-rose-500 font-bold';
      default:
        return isMinimal ? 'text-[#767066]' : 'text-cyan-400';
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
        isMinimal ? 'minimalist-card' : 'glass-panel'
      }`}
    >
      {/* Terminal Title Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <Terminal
            className={`w-3.5 h-3.5 ${isMinimal ? 'text-[#2C2924]' : 'text-emerald-400'}`}
          />
          <span
            className={`text-xs font-mono font-bold ${
              isMinimal ? 'text-[#2C2924]' : 'text-white'
            }`}
          >
            Audit Telemetry Stream ({logs.length} events recorded)
          </span>
        </div>

        <button
          type="button"
          className={`p-1 rounded-md border text-xs font-mono ${
            isMinimal
              ? 'bg-[#EAE5DB] border-[#D8D2C5] text-[#2C2924]'
              : 'bg-white/5 border-white/10 text-white/70'
          }`}
        >
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Terminal Output Area */}
      {isOpen && (
        <div
          className={`p-4 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto border-t space-y-1.5 ${
            isMinimal
              ? 'bg-[#2C2924] text-[#EBE7DF] border-[#D8D2C5]'
              : 'bg-black/80 text-white/80 border-white/10'
          }`}
        >
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-white/30 shrink-0">[{l.timestamp.toFixed(2)}s]</span>
              <span className={`shrink-0 font-bold uppercase ${getStatusBadge(l.status)}`}>
                [{l.phase}]
              </span>
              <span className="flex-1 break-all">{l.message}</span>
              {l.code && (
                <span className="shrink-0 px-1.5 py-0.2 rounded bg-white/10 text-white/60 text-[10px]">
                  HTTP {l.code}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
