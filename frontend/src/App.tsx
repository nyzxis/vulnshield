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
    document.documentElement.style.backgroundColor = isMinimal ? '#EBE7DF' : '#07090E';
    document.body.style.backgroundColor = isMinimal ? '#EBE7DF' : '#07090E';

    const metaTheme = document.getElementById('meta-theme-color');
    if (metaTheme) {
      metaTheme.setAttribute('content', isMinimal ? '#EBE7DF' : '#07090E');
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
      className={`min-h-[100dvh] flex flex-col antialiased transition-colors duration-150 ${
        isMinimal
          ? 'bg-[#EBE7DF] text-[#2C2924] selection:bg-[#DEE7DC] selection:text-[#2A522E] font-sans-clean theme-minimalist'
          : 'bg-[#07090E] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200'
      }`}
    >
      {/* Precision Hardware Cursor */}
      <CustomCursor theme={theme} />

      {/* Background Cyber Grid - persistent GPU layer */}
      <div
        className={`fixed inset-0 cyber-grid-bg pointer-events-none z-0 transition-opacity duration-200 ${
          isMinimal ? 'opacity-0' : 'opacity-35'
        }`}
        style={{ willChange: 'opacity' }}
      />

      {/* Top Ambient Glow */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[850px] h-[350px] bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12)_0%,rgba(6,182,212,0.04)_50%,transparent_70%)] pointer-events-none z-0 transition-opacity duration-200 ${
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
            isMinimal ? 'border-b border-[#D8D2C5]' : 'border-b border-white/10'
          }`}
        >
          <div>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-2.5 ${
                isMinimal
                  ? 'border border-[#D8D2C5] bg-[#F4F1EA] text-[#767066]'
                  : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>OWASP VULNERABILITY MATRIX • REFLECTED XSS &amp; SQLI PROBER</span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] ${
                isMinimal ? 'font-serif-editorial text-[#2C2924]' : 'font-mono text-white'
              }`}
              style={{ textWrap: 'balance' }}
            >
              Web Vulnerability Scanner
            </h1>

            <p
              className={`text-xs sm:text-sm mt-1.5 max-w-[65ch] leading-relaxed ${
                isMinimal ? 'text-[#767066]' : 'text-white/50 font-mono'
              }`}
              style={{ textWrap: 'pretty' }}
            >
              Automated penetration auditing for Cross-Site Scripting (XSS), SQL injection error heuristics, security headers, and sensitive file disclosures.
            </p>
          </div>

          <div
            className={`hidden md:flex flex-col items-end text-right text-xs font-mono p-3.5 rounded-xl border ${
              isMinimal ? 'minimalist-card text-[#767066]' : 'glass-panel text-white/50'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold mb-0.5">
              <Shield className={`w-3.5 h-3.5 ${isMinimal ? 'text-[#2C2924]' : 'text-emerald-400'}`} />
              <span className={isMinimal ? 'text-[#2C2924]' : 'text-white'}>Non-Destructive Canaries</span>
            </div>
            <span>Safe audit &amp; reflection detection</span>
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

        {/* Vulnerability Findings Dossier */}
        <FindingsDossier
          vulnerabilities={result.vulnerabilities}
          theme={theme}
        />

        {/* Terminal Telemetry Log */}
        <AuditTerminalLog
          logs={result.logs}
          theme={theme}
        />
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
            ? 'border-t border-[#D8D2C5] bg-[#E2DDD5] text-[#767066]'
            : 'border-t border-white/10 text-white/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>VulnShield • Built by Arfa Danial</span>
          <span>Stack: Python • Requests • BeautifulSoup4 • FastAPI • React 19 • Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
