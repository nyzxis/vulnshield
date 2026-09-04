import re
import time
from urllib.parse import urlparse, urljoin, parse_qs, urlencode, urlunparse
from typing import Dict, Any, List, Optional
import requests
from bs4 import BeautifulSoup

try:
    from .payloads import (
        XSS_CANARIES,
        SQLI_PROBES,
        SQL_ERROR_PATTERNS,
        SENSITIVE_FILES,
        SECURITY_HEADERS,
    )
except (ImportError, ValueError):
    from payloads import (
        XSS_CANARIES,
        SQLI_PROBES,
        SQL_ERROR_PATTERNS,
        SENSITIVE_FILES,
        SECURITY_HEADERS,
    )

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 VulnShield/1.0"

class VulnerabilityScanner:
    def __init__(self, target_url: str, active_mode: bool = False, timeout: int = 6):
        self.raw_url = target_url.strip()
        self.active_mode = active_mode
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT})
        self.logs: List[Dict[str, Any]] = []

    def log_event(self, phase: str, message: str, status: str = "INFO", code: Optional[int] = None):
        self.logs.append({
            "timestamp": round(time.time(), 3),
            "phase": phase,
            "message": message,
            "status": status,
            "code": code
        })

    def normalize_url(self) -> str:
        url = self.raw_url
        if not url.startswith("http://") and not url.startswith("https://"):
            url = "https://" + url
        parsed = urlparse(url)
        if not parsed.netloc:
            raise ValueError(f"Invalid target URL: {self.raw_url}")
        return url

    def scan(self) -> Dict[str, Any]:
        start_time = time.time()
        url = self.normalize_url()
        parsed = urlparse(url)
        base_url = f"{parsed.scheme}://{parsed.netloc}"

        vulnerabilities: List[Dict[str, Any]] = []
        headers_report: List[Dict[str, Any]] = []
        form_findings: List[Dict[str, Any]] = []
        exposed_files: List[Dict[str, Any]] = []
        
        self.log_event("INITIALIZATION", f"Target verified: {url} | Mode: {'ACTIVE FUZZING' if self.active_mode else 'PASSIVE AUDIT'}")

        # 1. Primary Request & Header Analysis
        try:
            res = self.session.get(url, timeout=self.timeout, allow_redirects=True, verify=False)
            status_code = res.status_code
            self.log_event("HTTP_PROBE", f"Root probe responded with HTTP {status_code}", "SUCCESS", status_code)
            html_content = res.text
            response_headers = res.headers
        except Exception as e:
            self.log_event("HTTP_PROBE", f"Connection failed: {str(e)}", "ERROR")
            return {
                "success": False,
                "target": url,
                "error": f"Failed to connect to target: {str(e)}",
                "logs": self.logs
            }

        # 2. Audit Security Headers
        self.log_event("SECURITY_HEADERS", "Analyzing HTTP defense headers")
        for h in SECURITY_HEADERS:
            header_key = h["header"]
            val = response_headers.get(header_key)
            present = val is not None
            headers_report.append({
                "header": header_key,
                "name": h["name"],
                "present": present,
                "value": val or "Not Set",
                "severity": h["severity"],
                "description": h["description"],
                "recommendation": h["recommendation"]
            })

            if not present:
                vulnerabilities.append({
                    "id": f"MISSING_{header_key.upper().replace('-', '_')}",
                    "title": f"Missing Security Header: {header_key}",
                    "category": "Configuration Hardening",
                    "severity": h["severity"],
                    "description": f"The '{header_key}' header is not implemented. {h['description']}",
                    "impact": "Exposes client browsers to downgrade attacks, clickjacking, or data injection.",
                    "proof": "Header absent from HTTP response",
                    "remediation": f"Configure server to return: {header_key}: {h['recommendation']}"
                })

        # Check Server Banner Information Disclosure
        server_banner = response_headers.get("Server") or response_headers.get("X-Powered-By")
        if server_banner:
            vulnerabilities.append({
                "id": "SERVER_BANNER_DISCLOSURE",
                "title": f"Server Technology Disclosure: {server_banner}",
                "category": "Information Disclosure",
                "severity": "LOW",
                "description": f"Server revealed infrastructure software signature: '{server_banner}'.",
                "impact": "Aids adversaries in fingerprinting specific software versions for targeted CVE exploitation.",
                "proof": f"Server / X-Powered-By header: {server_banner}",
                "remediation": "Suppress 'Server' and 'X-Powered-By' tokens in server configuration (e.g. server_tokens off; in Nginx)."
            })

        # Check Insecure CORS Wildcard
        cors_origin = response_headers.get("Access-Control-Allow-Origin")
        if cors_origin == "*":
            vulnerabilities.append({
                "id": "CORS_WILDCARD_ORIGIN",
                "title": "Insecure CORS Policy (Wildcard Access)",
                "category": "CORS Security",
                "severity": "MEDIUM",
                "description": "Access-Control-Allow-Origin is set to '*' allowing any external origin to read response data.",
                "impact": "May allow malicious sites to make cross-origin requests and read sensitive responses.",
                "proof": "Access-Control-Allow-Origin: *",
                "remediation": "Restrict CORS origins explicitly to authorized client domains instead of wildcard."
            })

        # 3. DOM & Form Security Audits with BeautifulSoup
        self.log_event("DOM_INSPECTION", "Parsing HTML DOM and form parameters via BeautifulSoup")
        soup = BeautifulSoup(html_content, "html.parser")
        forms = soup.find_all("form")
        
        csrf_pattern = re.compile(r"csrf|token|_csrf|authenticity_token|xsrf", re.I)
        
        for idx, f in enumerate(forms):
            action = f.get("action") or ""
            method = (f.get("method") or "GET").upper()
            form_url = urljoin(url, action)
            
            inputs = f.find_all(["input", "textarea", "select"])
            input_names = [inp.get("name") for inp in inputs if inp.get("name")]
            has_password = any(inp.get("type") == "password" for inp in inputs)
            has_csrf = any(csrf_pattern.search(inp.get("name") or "") for inp in inputs)

            # Flag insecure password over HTTP
            if has_password and form_url.startswith("http://"):
                vulnerabilities.append({
                    "id": f"PLAINTEXT_PASSWORD_FORM_{idx}",
                    "title": "Plaintext Password Transmission",
                    "category": "Transport Security",
                    "severity": "CRITICAL",
                    "description": f"Form at action '{action or 'self'}' accepts password input over plaintext HTTP.",
                    "impact": "Credentials can be intercepted via unencrypted Man-in-the-Middle (MitM) sniffing.",
                    "proof": f"Form action target: {form_url}",
                    "remediation": "Enforce HTTPS transport across all authentication and submission forms."
                })

            # Flag missing CSRF on POST forms
            if method == "POST" and not has_csrf:
                vulnerabilities.append({
                    "id": f"MISSING_CSRF_FORM_{idx}",
                    "title": "Missing Anti-CSRF Token in Form",
                    "category": "Form Security",
                    "severity": "MEDIUM",
                    "description": f"POST form at action '{action or 'self'}' lacks an anti-CSRF synchronizer token.",
                    "impact": "Allows cross-site attackers to submit unauthorized state-changing requests on behalf of victims.",
                    "proof": f"Inputs analyzed: {', '.join(input_names) or 'None'}",
                    "remediation": "Implement cryptographic anti-CSRF tokens for all state-altering POST/PUT/DELETE forms."
                })

            form_findings.append({
                "index": idx + 1,
                "action": action or "self",
                "method": method,
                "inputs": input_names,
                "has_password": has_password,
                "has_csrf": has_csrf
            })

        # 4. Sensitive Files Probing
        self.log_event("FILE_ENUMERATION", "Checking common exposed files & repository artifacts")
        for sfile in SENSITIVE_FILES:
            probe_path = sfile["path"]
            probe_url = urljoin(base_url, probe_path)
            try:
                fres = self.session.get(probe_url, timeout=4, allow_redirects=False, verify=False)
                if fres.status_code == 200:
                    text_sample = fres.text[:2000]
                    # Validate content matches real indicator to avoid false-positive SPA/404s
                    matches = any(re.search(pat, text_sample) for pat in sfile["indicators"])
                    if matches:
                        self.log_event("FILE_EXPOSURE", f"Found accessible asset: {probe_path}", "ALERT", 200)
                        exposed_files.append({"path": probe_path, "url": probe_url, "name": sfile["name"]})
                        vulnerabilities.append({
                            "id": f"EXPOSED_{probe_path.replace('/', '_').replace('.', '').upper()}",
                            "title": f"Exposed Sensitive Resource: {sfile['name']} ({probe_path})",
                            "category": "Information Disclosure",
                            "severity": sfile["severity"],
                            "description": f"Accessible file at '{probe_path}' was confirmed exposed to public requests.",
                            "impact": "May expose server credentials, secret API keys, or directory structures to attackers.",
                            "proof": f"HTTP 200 OK at {probe_url} containing verified signature",
                            "remediation": f"Block public access to {probe_path} in web server rules or remove from public root."
                        })
            except Exception:
                pass

        # 5. Active Fuzzing: Reflected XSS & SQLi (If Active Mode Enabled)
        if self.active_mode:
            self.log_event("ACTIVE_FUZZING", "Starting benign payload fuzzing on query parameters and forms")
            parsed_query = parse_qs(parsed.query)
            
            # 5a. Test URL Query Parameters
            if parsed_query:
                for param, vals in parsed_query.items():
                    # Test XSS Reflection
                    for xss in XSS_CANARIES:
                        test_params = parsed_query.copy()
                        test_params[param] = [xss["payload"]]
                        test_query = urlencode(test_params, doseq=True)
                        test_url = urlunparse(parsed._replace(query=test_query))
                        
                        try:
                            xres = self.session.get(test_url, timeout=self.timeout, verify=False)
                            if xss["marker"] in xres.text:
                                self.log_event("XSS_FINDING", f"Unsanitized parameter reflection found on '{param}'", "ALERT")
                                vulnerabilities.append({
                                    "id": f"REFLECTED_XSS_PARAM_{param.upper()}",
                                    "title": f"Reflected XSS on Parameter '{param}'",
                                    "category": "Cross-Site Scripting (XSS)",
                                    "severity": "HIGH",
                                    "description": f"Payload parameter '{param}' is reflected into the document without context-aware HTML entity encoding.",
                                    "impact": "Enables malicious script execution in visitor browser sessions, cookie theft, or session hijacking.",
                                    "proof": f"Canary token reflected unescaped at: {test_url}",
                                    "remediation": "Apply context-aware output encoding (e.g. htmlspecialchars / OWASP Java Encoder) and enforce a strict CSP."
                                })
                                break
                        except Exception:
                            pass

                    # Test SQLi Error Heuristics
                    for sqli in SQLI_PROBES:
                        test_params = parsed_query.copy()
                        test_params[param] = [vals[0] + sqli["payload"] if vals else sqli["payload"]]
                        test_query = urlencode(test_params, doseq=True)
                        test_url = urlunparse(parsed._replace(query=test_query))
                        
                        try:
                            sres = self.session.get(test_url, timeout=self.timeout, verify=False)
                            # Check database error signatures
                            for db_name, patterns in SQL_ERROR_PATTERNS.items():
                                found_err = any(re.search(p, sres.text, re.I) for p in patterns)
                                if found_err:
                                    self.log_event("SQLI_FINDING", f"SQL error detected on '{param}' ({db_name})", "ALERT")
                                    vulnerabilities.append({
                                        "id": f"SQLI_ERROR_PARAM_{param.upper()}",
                                        "title": f"Potential SQL Injection ({db_name}) on '{param}'",
                                        "category": "SQL Injection",
                                        "severity": "CRITICAL",
                                        "description": f"Injecting syntax probes into parameter '{param}' triggered an explicit {db_name} database syntax error.",
                                        "impact": "May allow unauthorized database read/write access, credential dumping, or authentication bypass.",
                                        "proof": f"Database syntax error fingerprint triggered by probe: {sqli['name']}",
                                        "remediation": "Use parameterized queries / Prepared Statements with bound parameters (e.g. PDO in PHP or SQLAlchemy in Python)."
                                    })
                                    break
                        except Exception:
                            pass
            else:
                self.log_event("ACTIVE_FUZZING", "No URL query parameters detected for direct GET fuzzing.")

        # 6. Calculate Security Posture Score & Letter Grade
        duration = round(time.time() - start_time, 2)
        score_data = self.calculate_score(vulnerabilities, headers_report)
        self.log_event("AUDIT_COMPLETED", f"Audit finished in {duration}s. Final Posture Score: {score_data['score']}/100 ({score_data['grade']})", "SUCCESS")

        return {
            "success": True,
            "target": url,
            "scan_mode": "ACTIVE FUZZING" if self.active_mode else "PASSIVE AUDIT",
            "duration_seconds": duration,
            "score": score_data["score"],
            "grade": score_data["grade"],
            "severity_counts": score_data["severity_counts"],
            "vulnerabilities": vulnerabilities,
            "security_headers": headers_report,
            "forms": form_findings,
            "exposed_files": exposed_files,
            "logs": self.logs
        }

    def calculate_score(self, vulns: List[Dict[str, Any]], headers: List[Dict[str, Any]]) -> Dict[str, Any]:
        counts = {"CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0}
        
        deductions = 0
        for v in vulns:
            sev = v.get("severity", "LOW").upper()
            if sev in counts:
                counts[sev] += 1
            
            if sev == "CRITICAL":
                deductions += 30
            elif sev == "HIGH":
                deductions += 15
            elif sev == "MEDIUM":
                deductions += 8
            elif sev == "LOW":
                deductions += 3

        final_score = max(0, min(100, 100 - deductions))

        if final_score >= 90:
            grade = "A+"
        elif final_score >= 80:
            grade = "A"
        elif final_score >= 70:
            grade = "B"
        elif final_score >= 55:
            grade = "C"
        elif final_score >= 40:
            grade = "D"
        else:
            grade = "F"

        return {
            "score": final_score,
            "grade": grade,
            "severity_counts": counts
        }
