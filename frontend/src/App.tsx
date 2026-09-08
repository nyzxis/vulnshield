import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import TargetInputBar from './components/TargetInputBar';
import AuditOverview from './components/AuditOverview';
import SecurityHeadersGrid from './components/SecurityHeadersGrid';
import FindingsDossier from './components/FindingsDossier';
import AuditTerminalLog from './components/AuditTerminalLog';
import ExportReportModal from './components/ExportReportModal';
import { ScanResult, PresetTarget } from './types';
import { checkBackendHealth, scanTarget, getPresets } from './lib/api';
import { runClientHeuristicScan } from './lib/clientScanner';

export default function App() {
  const [target, setTarget] = useState('http://testphp.vulnweb.com/listproducts.php?cat=1');
  const [activeMode, setActiveMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [systemOnline, setSystemOnline] = useState(false);
  const [engineName, setEngineName] = useState('FASTAPI PEN-ENGINE');
  const [presets, setPresets] = useState<PresetTarget[]>([]);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Initial pre-loaded scan result for instant visual richness
  const [result, setResult] = useState<ScanResult>(() =>
    runClientHeuristicScan('http://testphp.vulnweb.com/listproducts.php?cat=1', true)
  );

  const [theme, setTheme] = useState<'cyber' | 'minimalist'>(() => {
    const saved = localStorage.getItem('vulnshield_theme');
    return saved === 'minimalist' || saved === 'cyber' ? saved : 'cyber';
  });

  const isMinimal = theme === 'minimalist';

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'cyber' ? 'minimalist' : 'cyber';
      localStorage.setItem('vulnshield_theme', next);
      return next;
    });
  };

  // Sync theme attribute/class on document root for custom scrollbars
  useEffect(() => {
    document.documentElement.classList.toggle('theme-minimalist', isMinimal);
    document.body.classList.toggle('theme-minimalist', isMinimal);
    document.documentElement.style.colorScheme = isMinimal ? 'light' : 'dark';
    document.documentElement.style.backgroundColor = isMinimal ? '#EEF2F6' : '#040711';
    document.body.style.backgroundColor = isMinimal ? '#EEF2F6' : '#040711';

    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.setAttribute('content', isMinimal ? '#EEF2F6' : '#040711');
    }
  }, [isMinimal]);

  // Initial health check & preset load
  useEffect(() => {
    async function init() {
      const h = await checkBackendHealth();
      setSystemOnline(h.status === 'online');
      setEngineName(h.engine);

      const p = await getPresets();
      setPresets(p);
    }
    init();
  }, []);

  const handleRunScan = async (targetOverride?: string) => {
    const urlToScan = (targetOverride || target).trim();
    if (!urlToScan) return;

    setLoading(true);
    try {
      const data = await scanTarget(urlToScan, activeMode);
      setResult(data);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (presetUrl: string) => {
    setTarget(presetUrl);
    handleRunScan(presetUrl);
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col antialiased transition-colors duration-150 soc-radar-grid ${
        isMinimal
          ? 'bg-[#EEF2F6] text-[#0F172A] selection:bg-blue-100 selection:text-blue-900 font-sans-clean theme-minimalist'
          : 'bg-[#040711] text-slate-100 selection:bg-blue-500/30 selection:text-blue-200'
      }`}
    >
      {/* Precision Hardware Cursor */}
      <CustomCursor theme={theme} />

      {/* Top Ambient Glow */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.18)_0%,rgba(56,189,248,0.06)_50%,transparent_70%)] pointer-events-none z-0 transition-opacity duration-200 ${
          isMinimal ? 'opacity-0' : 'opacity-100'
        }`}
        style={{ willChange: 'opacity' }}
      />

      {/* Navigation Island */}
      <Navbar
        systemOnline={systemOnline}
        engineName={engineName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Top Hero / Intro Banner */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 ${
            isMinimal ? 'border-b border-[#CBD5E1]' : 'border-b border-blue-500/20'
          }`}
        >
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono mb-2.5 ${
                isMinimal
                  ? 'border border-[#CBD5E1] bg-[#FFFFFF] text-[#0F172A]'
                  : 'border border-blue-500/30 bg-blue-500/10 text-blue-300 shadow-[0_0_12px_rgba(37,99,235,0.25)]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>OWASP VULNERABILITY MATRIX • REFLECTED XSS &amp; SQLI PROBER</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-black font-defense tracking-wider uppercase ${
                isMinimal ? 'text-[#0F172A]' : 'text-white'
              }`}
              style={{ textWrap: 'balance' }}
            >
              VulnShield <span className="text-blue-400 font-light">//</span> War Room
            </h1>

            <p
              className={`text-xs sm:text-sm mt-1.5 max-w-[68ch] leading-relaxed font-mono ${
                isMinimal ? 'text-[#64748B]' : 'text-slate-400'
              }`}
              style={{ textWrap: 'pretty' }}
            >
              Global Attack Surface Auditor &amp; Automated Penetration Radar. Executes safe canaries to unmask Cross-Site Scripting (XSS), SQL injection error leaks, missing HTTP perimeter headers, and critical endpoint exposures.
            </p>
          </div>

          <div
            className={`hidden md:flex flex-col items-end text-right text-xs font-mono p-4 rounded-xl border ${
              isMinimal ? 'bg-[#FFFFFF] border-[#CBD5E1] text-[#64748B]' : 'bg-[#070C1A] border-blue-500/25 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <Shield className={`w-4 h-4 ${isMinimal ? 'text-[#0F172A]' : 'text-blue-400'}`} />
              <span className={isMinimal ? 'text-[#0F172A]' : 'text-white'}>NON-DESTRUCTIVE CANARIES</span>
            </div>
            <span className="text-[10px] opacity-70">Safe fuzzing &amp; reflection heuristics</span>
          </div>
        </div>

        {/* Target Input & Mode Switcher Bar */}
        <TargetInputBar
          target={target}
          onTargetChange={setTarget}
          activeMode={activeMode}
          onToggleActiveMode={() => setActiveMode(!activeMode)}
          loading={loading}
          onRunScan={() => handleRunScan()}
          presets={presets}
          onSelectPreset={handleSelectPreset}
          theme={theme}
        />

        {/* 2-Column SOC Command Center War Room Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Tactical Radar Deck: DEFCON Dial, Headers & Telemetry Log */}
          <div className="lg:col-span-5 space-y-6">
            {/* Audit Overview & Posture Grade */}
            <AuditOverview
              result={result}
              onReScan={() => handleRunScan()}
              onOpenExportModal={() => setIsExportOpen(true)}
              theme={theme}
            />

            {/* HTTP Defense Security Headers Baseline Grid */}
            <SecurityHeadersGrid
              headers={result.security_headers}
              theme={theme}
            />

            {/* Terminal Telemetry Log */}
            <AuditTerminalLog
              logs={result.logs}
              theme={theme}
            />
          </div>

          {/* Right Tactical Findings Deck: Incident Dossier */}
          <div className="lg:col-span-7 space-y-6">
            <FindingsDossier
              vulnerabilities={result.vulnerabilities}
              theme={theme}
            />
          </div>
        </div>
      </main>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        result={result}
        theme={theme}
      />

      {/* Footer */}
      <footer
        className={`relative z-10 py-6 text-center font-mono text-xs transition-colors duration-150 ${
          isMinimal
            ? 'border-t border-[#CBD5E1] bg-[#E2E8F0] text-[#64748B]'
            : 'border-t border-blue-500/15 bg-[#03060E] text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            VULNSHIELD // Engineered by <strong className={isMinimal ? 'text-[#0F172A]' : 'text-slate-200'}>Arfa Danial</strong> (<a href="https://github.com/nyzxis" target="_blank" rel="noopener noreferrer" className="hover:underline">@nyzxis</a>)
          </div>
          <div className="flex items-center gap-4">
            <a href="https://nyzxis.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </a>
            <span>•</span>
            <a href="https://github.com/nyzxis/vulnshield" target="_blank" rel="noopener noreferrer" className="hover:underline">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
