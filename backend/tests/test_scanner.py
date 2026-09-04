import unittest
import re
from backend.scanner import VulnerabilityScanner
from backend.payloads import SQL_ERROR_PATTERNS, XSS_CANARIES, SECURITY_HEADERS

class TestScanner(unittest.TestCase):
    def test_url_normalization(self):
        scanner = VulnerabilityScanner("example.com")
        self.assertEqual(scanner.normalize_url(), "https://example.com")

        scanner2 = VulnerabilityScanner("http://test.local/path?q=1")
        self.assertEqual(scanner2.normalize_url(), "http://test.local/path?q=1")

    def test_score_calculation(self):
        scanner = VulnerabilityScanner("https://example.com")
        
        # 0 vulns -> 100 score, A+ grade
        res1 = scanner.calculate_score([], [])
        self.assertEqual(res1["score"], 100)
        self.assertEqual(res1["grade"], "A+")

        # Critical vuln -> 30 pt deduction
        res2 = scanner.calculate_score([{"severity": "CRITICAL"}], [])
        self.assertEqual(res2["score"], 70)
        self.assertEqual(res2["grade"], "B")

        # Multiple severe findings
        res3 = scanner.calculate_score([
            {"severity": "CRITICAL"},
            {"severity": "HIGH"},
            {"severity": "HIGH"},
            {"severity": "MEDIUM"}
        ], [])
        self.assertEqual(res3["score"], 32)
        self.assertEqual(res3["grade"], "F")

    def test_sql_error_patterns(self):
        sample_mysql_error = "You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version"
        found_mysql = any(re.search(p, sample_mysql_error, re.I) for p in SQL_ERROR_PATTERNS["MySQL"])
        self.assertTrue(found_mysql)

        sample_pg_error = "PostgreSQL query failed: ERROR: syntax error at or near 'admin'"
        found_pg = any(re.search(p, sample_pg_error, re.I) for p in SQL_ERROR_PATTERNS["PostgreSQL"])
        self.assertTrue(found_pg)

    def test_xss_canaries_structure(self):
        self.assertGreaterEqual(len(XSS_CANARIES), 3)
        for canary in XSS_CANARIES:
            self.assertIn("name", canary)
            self.assertIn("payload", canary)
            self.assertIn("marker", canary)
            self.assertIn(canary["marker"], canary["payload"])

    def test_security_headers_catalog(self):
        headers = [h["header"] for h in SECURITY_HEADERS]
        self.assertIn("Content-Security-Policy", headers)
        self.assertIn("Strict-Transport-Security", headers)
        self.assertIn("X-Frame-Options", headers)
        self.assertIn("X-Content-Type-Options", headers)

if __name__ == "__main__":
    unittest.main()
