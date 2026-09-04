from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional
import urllib3

# Suppress insecure HTTPS warning for benign testing
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

try:
    from .scanner import VulnerabilityScanner
except (ImportError, ValueError):
    from scanner import VulnerabilityScanner

app = FastAPI(
    title="VulnShield // Web Vulnerability & Penetration Auditor API",
    version="1.0.0",
    description="Automated scanning engine for XSS, SQLi, Security Headers, and Information Disclosure."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    target: str
    active_mode: Optional[bool] = False

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "VulnShield Security Auditor",
        "version": "1.0.0",
        "engine": "FASTAPI + BEAUTIFULSOUP + REQUESTS"
    }

@app.get("/api/presets")
def get_presets():
    return [
        {
            "id": "vulnweb",
            "name": "VulnWeb TestPHP (Acunetix)",
            "url": "http://testphp.vulnweb.com/listproducts.php?cat=1",
            "description": "Official legal OWASP benchmark target demonstrating parameter reflection and SQL vulnerabilities.",
            "category": "High-Risk Benchmark"
        },
        {
            "id": "testfire",
            "name": "Altoro Mutual (IBM Testfire)",
            "url": "http://demo.testfire.net/search.jsp?query=test",
            "description": "Enterprise banking test simulator for reflected input and form security.",
            "category": "Banking Testbed"
        },
        {
            "id": "github",
            "name": "GitHub.com",
            "url": "https://github.com",
            "description": "Hardened modern enterprise platform with strict CSP, HSTS, and zero disclosure.",
            "category": "A+ Hardened Production"
        },
        {
            "id": "google",
            "name": "Google.com",
            "url": "https://www.google.com",
            "description": "High-security production target with robust cookie and header defenses.",
            "category": "Hardened Baseline"
        }
    ]

@app.post("/api/scan")
def scan_target(req: ScanRequest):
    if not req.target or len(req.target.strip()) < 3:
        raise HTTPException(status_code=400, detail="Target URL must be specified.")
    
    scanner = VulnerabilityScanner(target_url=req.target, active_mode=req.active_mode or False)
    result = scanner.scan()
    
    if not result.get("success"):
        raise HTTPException(status_code=502, detail=result.get("error", "Scan failed"))
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
