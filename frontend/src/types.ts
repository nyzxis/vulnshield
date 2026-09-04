export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export interface Vulnerability {
  id: string;
  title: string;
  category: string;
  severity: Severity;
  description: string;
  impact: string;
  proof: string;
  remediation: string;
}

export interface SecurityHeader {
  header: string;
  name: string;
  present: boolean;
  value: string;
  severity: string;
  description: string;
  recommendation: string;
}

export interface FormFinding {
  index: number;
  action: string;
  method: string;
  inputs: string[];
  has_password: boolean;
  has_csrf: boolean;
}

export interface ExposedFile {
  path: string;
  url: string;
  name: string;
}

export interface ScanLog {
  timestamp: number;
  phase: string;
  message: string;
  status: 'INFO' | 'SUCCESS' | 'ALERT' | 'ERROR';
  code?: number;
}

export interface ScanResult {
  success: boolean;
  target: string;
  scan_mode: string;
  duration_seconds: number;
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  severity_counts: {
    CRITICAL: number;
    HIGH: number;
    MEDIUM: number;
    LOW: number;
    INFO: number;
  };
  vulnerabilities: Vulnerability[];
  security_headers: SecurityHeader[];
  forms: FormFinding[];
  exposed_files: ExposedFile[];
  logs: ScanLog[];
  error?: string;
}

export interface PresetTarget {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  activeDefault?: boolean;
}
