# 🛡️ Security Policy

## Supported Versions

We actively provide security updates for the following versions:

| Version | Supported |
| :--- | :--- |
| 1.0.x | ✅ Yes |
| < 1.0 | ❌ No |

## Reporting a Vulnerability

We take the security of AAMS seriously. If you believe you have found a security vulnerability, please do not open a public issue. Instead, follow these steps:

1.  **Email Us**: Send a detailed report to `kinshuk.saxena@example.com` (Project Lead).
2.  **Wait for Response**: We aim to acknowledge all reports within 48 hours.
3.  **Coordination**: We will coordinate with you to understand the issue and develop a fix.
4.  **Disclosure**: Once a fix is deployed, we will acknowledge your contribution (unless you prefer to remain anonymous).

### Please include:
*   Description of the vulnerability.
*   Potential impact.
*   Steps to reproduce (Proof of Concept).
*   Any suggested mitigations.

## Security Features in AAMS
AAMS implements several layers of security:
*   **JWT Authentication**: Secure, stateless authentication with role-based access control.
*   **Anti-Spoofing**: 4-stage AI pipeline to prevent presentation attacks.
*   **Data Encryption**: Biometric embeddings are stored in encrypted formats.
*   **Secure Tokens**: QR codes use time-bounded, single-use UUIDs.

---

*Thank you for helping keep AAMS secure!*
