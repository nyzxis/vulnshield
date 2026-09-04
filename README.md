# 🛡️ VULNSHIELD // Automated Web Vulnerability Scanner

[![Live Demo](https://img.shields.io/badge/Live_Demo-vulnshield.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://vulnshield.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-nyzxis%2Fvulnshield-10b981?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nyzxis/vulnshield)
[![Python](https://img.shields.io/badge/Python-3.12%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> 🌐 **Live Demo**: **[https://vulnshield.vercel.app/](https://vulnshield.vercel.app/)**  
> **Automated Web Security Posture Analysis & Heuristic Vulnerability Detection**  
> Engineered by **Arfa Danial** ([@nyzxis](https://github.com/nyzxis)).

---

## ⚡ Overview

**VulnShield** is a modern, high-performance web vulnerability scanner and offensive security posture analyzer. It inspects target URLs, evaluates HTTP defense headers, checks for exposed sensitive files, extracts and audits HTML form endpoints, and performs heuristic active fuzzing against **OWASP Top 10** attack vectors (Reflected Cross-Site Scripting and SQL Injection) using strictly non-destructive, benign canary probes.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons |
| **Backend API** | Python 3.12+, FastAPI, Uvicorn, BeautifulSoup4, Requests, Pydantic |
| **Security Engine** | Multi-vector heuristic scanner, benign token verification, multi-RDBMS error signature matching |
| **Deployment** | Vercel Serverless (`api/index.py` Python Runtime + Static React SPA) |

---

## 🔍 Core Detection Capabilities

### 1. Reflected Cross-Site Scripting (XSS)
- Heuristically tests URL query parameters and HTML inputs with non-destructive, benign probe tokens (`<script>/*vulnshield_canary*/</script>`).
- Validates whether user-controlled input reflects unescaped into response HTML without executing malicious JavaScript.

### 2. SQL Injection (SQLi) Heuristics
- Injects standard benign single/double quote and boolean delta payloads (`' OR '1'='1`, `1' AND '1'='2`).
- Detects diagnostic error messages across major database engines:
  - **MySQL / MariaDB** (`SQL syntax.*MySQL`, `Warning.*mysql_`)
  - **PostgreSQL** (`PostgreSQL.*ERROR`, `pg_query\(\)`)
  - **SQLite** (`SQLite/JDBCDriver`, `System.Data.SQLite.SQLiteException`)
  - **Microsoft SQL Server** (`Driver.*SQLServer`, `OLE DB.*SQL Server`)
  - **Oracle** (`ORA-[0-9]{5}`, `Oracle error`)

### 3. HTTP Security Headers Baseline
- Thoroughly analyzes response headers against standard defensive hardening standards:
  - `Content-Security-Policy` (CSP)
  - `Strict-Transport-Security` (HSTS)
  - `X-Frame-Options` (Clickjacking mitigation)
  - `X-Content-Type-Options` (MIME-sniffing prevention)
  - `Referrer-Policy` (Origin leakage control)
  - `Permissions-Policy` (Client feature access control)
- Delivers one-click copyable server configuration snippets (Nginx, Apache, Caddy).

### 4. Sensitive Information Disclosure
- Probes target paths for sensitive configuration leaks:
  - Environment configurations (`/.env`)
  - Git repository metadata (`/.git/HEAD`)
  - Crawler navigation instructions (`/robots.txt`)
  - Technology stack server banner disclosures (`Server`, `X-Powered-By`)

### 5. Form & Transmission Auditing
- Scrapes HTML forms using BeautifulSoup to verify transmission security:
  - Unprotected `POST` action targets lacking Anti-CSRF tokens.
  - Plaintext password input elements transmitted over insecure HTTP connections.

---

## 🎨 UI & Ergonomic Highlights

- **Executive Posture Dial**: Real-time calculated 0–100 numerical score paired with an authoritative A–F grading scale.
- **Findings Dossier**: Expandable accordion cards categorized by severity (Critical, High, Medium, Low, Info) featuring Root Cause analysis, Evidence Proof, Impact assessment, and Remediation steps with code snippets.
- **Real-Time Telemetry Terminal**: Collapsible live terminal console logging every HTTP request, header test, and fuzzing operation step-by-step.
- **One-Click Audit Export**: Generates comprehensive printable executive summary reports and copyable Markdown documents for penetration test documentation.
- **Dual Aesthetic Modes**:
  - **Cyber Obsidian**: High-contrast terminal glow with doppelrand enclosures and subtle emerald highlights.
  - **Minimalist Paper**: Warm editorial monochrome styling with crisp typography.
- **Micro-Interactions**: Hardware-accelerated custom cursor with magnetic hover physics and a custom solid scrollbar.

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.11 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/nyzxis/vulnshield.git
cd vulnshield
```

### 2. Backend Setup
```bash
# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Launch FastAPI development server (port 8000)
uvicorn backend.app:app --reload --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite dev server (port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Running Unit Tests

VulnShield includes automated unit test suites covering the core heuristic scanner algorithms:

```bash
# Run backend test suite
python -m unittest discover -s backend/tests
```

---

## ⚖️ Legal & Ethical Disclaimer

> **VulnShield is designed strictly for authorized security assessments, academic research, and defensive hardening.**  
> Scanning targets without prior explicit written authorization from the system owner is illegal and unethical. The author assumes no liability for misuse or damages resulting from this software.

---

## 👤 Author

**Arfa Danial**
- GitHub: [@nyzxis](https://github.com/nyzxis)
- Portfolio: [nyzxis.vercel.app](https://nyzxis.vercel.app/)
