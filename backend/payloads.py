"""
VulnShield Benign Auditing Payloads & Signatures
Non-destructive test markers and database fingerprint catalogs.
"""

# Benign canary tokens for Reflected XSS inspection
XSS_CANARIES = [
    {
        "name": "Script Tag Reflection",
        "payload": "<script>/*vulnshield_canary*/</script>",
        "marker": "<script>/*vulnshield_canary*/</script>",
        "context": "HTML Body",
    },
    {
        "name": "SVG Vector Reflection",
        "payload": "<svg onload=/*vulnshield*/>",
        "marker": "<svg onload=/*vulnshield*/>",
        "context": "Event Handler",
    },
    {
        "name": "Attribute Breakout Probe",
        "payload": "\"><b id=vulnshield_canary>",
        "marker": "\"><b id=vulnshield_canary>",
        "context": "Input Attribute",
    },
]

# Benign syntax test vectors for SQL Injection heuristics
SQLI_PROBES = [
    {
        "name": "Single Quote Syntax Probe",
        "payload": "'",
        "type": "Error-Based",
    },
    {
        "name": "Tautology Boolean Probe",
        "payload": "' OR '1'='1",
        "type": "Boolean-Based",
    },
    {
        "name": "Double Quote Syntax Probe",
        "payload": "\"",
        "type": "Error-Based",
    },
    {
        "name": "Comment Sequence Probe",
        "payload": "1' -- -",
        "type": "Syntax Injection",
    },
]

# SQL Database Error Signatures for Fingerprinting
SQL_ERROR_PATTERNS = {
    "MySQL": [
        r"you have an error in your sql syntax",
        r"warning: mysql_",
        r"check the manual that corresponds to your mysql server version",
        r"valid mysql result",
        r"mySqlClient\.",
    ],
    "PostgreSQL": [
        r"postgresql query failed",
        r"syntax error at or near",
        r"pg::syntaxerror",
        r"warning: pg_exec",
        r"valid postgresql result",
    ],
    "SQLite": [
        r"sqlite3::sqlexception",
        r"unrecognized token:",
        r"near \".*\": syntax error",
        r"sqlite_error",
        r"sqlite3\.operationalerror",
    ],
    "Microsoft SQL Server": [
        r"unclosed quotation mark after the character string",
        r"microsoft ole db provider for sql server",
        r"driver.*sql[\-\_\ ]*server",
        r"ole db.*sql server",
    ],
    "Oracle": [
        r"ora-[0-9]{5}",
        r"oracle error",
        r"microsoft ole db provider for oracle",
    ],
}

# Sensitive Files & Exposed Assets
SENSITIVE_FILES = [
    {
        "path": "/.env",
        "name": "Environment Config File",
        "severity": "CRITICAL",
        "indicators": [r"DB_PASSWORD=", r"APP_SECRET=", r"AWS_ACCESS_KEY_ID=", r"API_KEY="],
    },
    {
        "path": "/.git/HEAD",
        "name": "Exposed Git Repository Metadata",
        "severity": "HIGH",
        "indicators": [r"ref: refs/heads/"],
    },
    {
        "path": "/robots.txt",
        "name": "Robots Directives Disclosure",
        "severity": "INFO",
        "indicators": [r"User-agent:", r"Disallow:"],
    },
    {
        "path": "/phpinfo.php",
        "name": "PHPInfo Diagnostic Page",
        "severity": "HIGH",
        "indicators": [r"PHP Version", r"Configuration File \(php\.ini\) Path"],
    },
    {
        "path": "/server-status",
        "name": "Apache Server Status Disclosure",
        "severity": "MEDIUM",
        "indicators": [r"Apache Server Status", r"Current Time:"],
    },
]

# HTTP Security Headers Baseline
SECURITY_HEADERS = [
    {
        "header": "Content-Security-Policy",
        "name": "Content Security Policy (CSP)",
        "severity": "HIGH",
        "description": "Restricts sources of executable scripts, preventing XSS and data injection.",
        "recommendation": "default-src 'self'; script-src 'self'; object-src 'none';",
    },
    {
        "header": "Strict-Transport-Security",
        "name": "HTTP Strict Transport Security (HSTS)",
        "severity": "HIGH",
        "description": "Forces browsers to exclusively communicate over encrypted HTTPS connections.",
        "recommendation": "max-age=63072000; includeSubDomains; preload",
    },
    {
        "header": "X-Frame-Options",
        "name": "Anti-Clickjacking Header (X-Frame-Options)",
        "severity": "MEDIUM",
        "description": "Prevents site from being embedded in iframes on unauthorized third-party sites.",
        "recommendation": "DENY or SAMEORIGIN",
    },
    {
        "header": "X-Content-Type-Options",
        "name": "MIME-Type Sniffing Protection",
        "severity": "MEDIUM",
        "description": "Stops browsers from MIME-sniffing a response away from declared content-type.",
        "recommendation": "nosniff",
    },
    {
        "header": "Referrer-Policy",
        "name": "Referrer Privacy Policy",
        "severity": "LOW",
        "description": "Governs how much referrer information is sent with outbound navigation requests.",
        "recommendation": "strict-origin-when-cross-origin",
    },
    {
        "header": "Permissions-Policy",
        "name": "Browser Permissions Policy",
        "severity": "LOW",
        "description": "Restricts access to browser features like geolocation, camera, and microphone.",
        "recommendation": "camera=(), microphone=(), geolocation=()",
    },
]
