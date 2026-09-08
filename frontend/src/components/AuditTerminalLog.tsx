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
        return 'text-blue-400 font-bold';
      case 'ERROR':
        return 'text-rose-500 font-bold';
      default:
        return isMinimal ? 'text-[#0F172A]' : 'text-cyan-400 font-medium';
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-150 overflow-hidden ${
        isMinimal ? 'bg-[#F8FAFC] border-[#CBD5E1]' : 'soc-panel'
      }`}
    >
      {/* Terminal Title Bar */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 mr-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/80" />
          </div>

          <Terminal
            className={`w-4 h-4 ${isMinimal ? 'text-[#0F172A]' : 'text-blue-400'}`}
          />
          <span
            className={`text-xs font-mono font-bold tracking-wide ${
              isMinimal ? 'text-[#0F172A]' : 'text-white'
            }`}
          >
            WAR ROOM AUDIT TELEMETRY STREAM ({logs.length} EVENTS)
          </span>
        </div>

        <button
          type="button"
          aria-label="Toggle terminal"
          className={`p-1.5 rounded-lg border text-xs font-mono ${
            isMinimal
              ? 'bg-[#EEF2F6] border-[#CBD5E1] text-[#0F172A]'
              : 'bg-[#040711] border-blue-500/20 text-blue-400'
          }`}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Terminal Output Area */}
      {isOpen && (
        <div
          className={`p-4 sm:p-5 font-mono text-[11px] leading-relaxed max-h-64 overflow-y-auto border-t space-y-1.5 ${
            isMinimal
              ? 'bg-[#0F172A] text-[#F8FAFC] border-[#CBD5E1]'
              : 'bg-[#03060E] text-slate-200 border-blue-500/20'
          }`}
        >
          {logs.map((l, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-white/30 shrink-0 select-none">[{l.timestamp.toFixed(2)}s]</span>
              <span className={`shrink-0 font-bold uppercase ${getStatusBadge(l.status)}`}>
                [{l.phase}]
              </span>
              <span className="flex-1 break-all">{l.message}</span>
              {l.code && (
                <span className="shrink-0 px-1.5 py-0.2 rounded bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[10px]">
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
