import { ScanResult, PresetTarget } from '../types';
import { runClientHeuristicScan, BENCHMARK_PRESETS } from './clientScanner';

export async function checkBackendHealth(): Promise<{ status: string; engine: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('/api/health', { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const data = await res.json();
      return { status: 'online', engine: data.engine || 'FASTAPI BACKEND' };
    }
  } catch {
    // Backend offline or running purely client-side
  }
  return { status: 'client', engine: 'CLIENT-SIDE ZERO-KNOWLEDGE' };
}

export async function scanTarget(target: string, activeMode: boolean): Promise<ScanResult> {
  // Try Python backend first
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, active_mode: activeMode }),
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    if (res.ok) {
      const data: ScanResult = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend API request bypassed or timed out, executing client heuristic engine:', err);
  }

  // Graceful client-side fallback
  return runClientHeuristicScan(target, activeMode);
}

export async function getPresets(): Promise<PresetTarget[]> {
  try {
    const res = await fetch('/api/presets');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }
  return BENCHMARK_PRESETS;
}
