# PCI-DSS Compliance Rules (Delta)

## Overview

These PCI-DSS (Payment Card Industry Data Security Standard) compliance rules are MANDATORY cross-cutting constraints for applications that store, process, or transmit cardholder data (CHD).

**Important**: This document contains **ONLY** PCI-DSS-specific requirements beyond the baseline security rules. You MUST enforce **both** the baseline security rules (security-baseline.md) AND these PCI-DSS-specific rules for PCI-covered applications.

**Baseline Security Rules (Already Enforced)**:
- ✅ SECURITY-01: Encryption at Rest and in Transit → Maps to PCI-DSS Requirement 3.5, 4.1
- ✅ SECURITY-02: Access Logging → Maps to PCI-DSS Requirement 10
- ✅ SECURITY-05: Input Validation → Maps to PCI-DSS Requirement 6.3, 6.5 (injection prevention)
- ✅ SECURITY-06, SECURITY-08: Access Control → Maps to PCI-DSS Requirement 7, 8
- ✅ SECURITY-07: Restrictive Network Configuration → Maps to PCI-DSS Requirement 1.3
- ✅ SECURITY-09: Security Hardening → Maps to PCI-DSS Requirement 2 (misconfiguration prevention)
- ✅ SECURITY-10: Software Supply Chain Security → Maps to PCI-DSS Requirement 6.1, 6.2
- ✅ SECURITY-12: Authentication and Credential Management → Maps to PCI-DSS Requirement 8
- ✅ SECURITY-16: Change Management → Maps to PCI-DSS Requirement 6.4

**Applicability**: These rules apply to applications that store, process, or transmit cardholder data or sensitive authentication data.

**PCI-DSS Version**: These rules align with PCI-DSS v4.0 requirements.

**Enforcement**: At each applicable stage, the model MUST verify compliance with these rules before presenting the stage completion message to the user.

### Blocking Compliance Finding Behavior

A **blocking compliance finding** means:
1. The finding MUST be listed in the stage completion message under a "PCI-DSS Compliance Findings" section with the PCI rule ID and description
2. The stage MUST NOT present the "Continue to Next Stage" option until all blocking findings are resolved
3. The model MUST present only the "Request Changes" option with a clear explanation of what needs to change
4. The finding MUST be logged in `aidlc-docs/audit.md` with the PCI rule ID, description, and stage context

If a PCI rule is not applicable to the current project (e.g., PCI-01 when no cardholder data is stored), mark it as **N/A** in the compliance summary — this is not a blocking finding.

### Default Enforcement

All rules in this document are **blocking** by default. If any rule's verification criteria are not met, it is a blocking compliance finding — follow the blocking finding behavior defined above.

---

## Opt-In Configuration

**Opt-in prompt**: See `pci-dss-compliance.opt-in.md` (loaded separately for context efficiency)

**Project-level override**: Configure in `TECHNICAL_GUIDELINES.md` under `## Compliance Requirements` to skip opt-in prompt.

**Note**: PCI-DSS compliance requires Security Baseline to also be enabled. If PCI-DSS is enabled, Security Baseline is automatically enforced.

---

## Cardholder Data Elements Reference

**Cardholder Data (CHD)**:
- Primary Account Number (PAN) - the 16-digit card number
- Cardholder Name
- Expiration Date
- Service Code

**Sensitive Authentication Data (SAD)** - MUST NEVER be stored after authorization:
- Full magnetic stripe data (track data)
- Card Verification Code (CVV2/CVC2/CID)
- PIN/PIN block

---

# PCI-DSS-Specific Rules (Beyond Baseline)

## Rule PCI-01: Cardholder Data Discovery and Inventory

**Rule**: Every application handling cardholder data MUST maintain a data inventory:
- **Data discovery**: All locations where CHD is stored MUST be identified
- **Data flow mapping**: Document where CHD enters, is processed, stored, and exits the system
- **Scope minimization**: Reduce CHD storage to minimum necessary
- **Retention policy**: Define and enforce CHD retention periods (no longer than business justification)

**PCI-DSS Reference**: Requirement 3.2 - Keep cardholder data storage to a minimum

**Baseline Rule Enhancement**: Extends SECURITY-01 (Encryption) by requiring explicit CHD inventory before encryption.

**Verification**:
- CHD data flow diagram exists
- All CHD storage locations are documented
- Data retention policy is defined (must not exceed business justification)
- No CHD is stored beyond documented retention period

---

## Rule PCI-02: PAN Masking and Display

**Rule**: The Primary Account Number MUST be masked when displayed:
- **Masking requirement**: Display at most the first 6 and last 4 digits of PAN
- **Full PAN restriction**: Only personnel with legitimate business need may see full PAN
- **Screen masking**: User interfaces MUST mask PAN appropriately
- **Reports and logs**: PANs in reports and logs MUST be masked (even in audit logs - log PAN hash or masked version)

**PCI-DSS Reference**: Requirement 3.4 - Render PAN unreadable anywhere it is stored

**No Baseline Equivalent**: This is a unique PCI-DSS requirement for PAN display.

**Verification**:
- UI displays masked PAN (first 6/last 4 or less)
- Full PAN access requires explicit authorization and is logged
- Logs and reports show masked PAN only (or PAN hash/token)
- No full PAN in error messages or debug output

---

## Rule PCI-03: Enhanced Encryption Key Management

**Rule**: Beyond baseline key management (SECURITY-01), cryptographic keys for CHD MUST:
- **HSM requirement**: Keys SHOULD be stored in Hardware Security Module or cloud KMS with HSM backing
- **Split knowledge**: No single person has access to full key material (dual control)
- **Annual rotation**: Keys MUST be rotated at least annually (vs baseline discretion)
- **Key destruction**: Retired keys MUST be securely destroyed per documented procedures

**PCI-DSS Reference**: Requirement 3.6 - Key management procedures

**Baseline Rule Enhancement**: Adds stricter key management requirements beyond SECURITY-01.

**Verification**:
- Keys are stored in HSM, cloud KMS, or dedicated key vault with HSM backing
- Key access requires dual authorization (split knowledge enforced)
- Key rotation procedures are documented (annual minimum)
- Key destruction procedures are documented and followed
- No encryption keys in source code or configuration files

---

## Rule PCI-04: Sensitive Authentication Data Prohibition

**Rule**: Sensitive Authentication Data MUST NOT be stored after authorization (even if encrypted):
- **CVV/CVC prohibition**: NEVER store CVV/CVC/CID after authorization
- **Track data prohibition**: NEVER store full magnetic stripe data after authorization
- **PIN prohibition**: NEVER store PIN or PIN block after authorization
- **Pre-authorization handling**: SAD may be stored temporarily before authorization but MUST be securely deleted immediately after
- **Code review**: Verify no SAD persistence in code, logs, or temporary files

**PCI-DSS Reference**: Requirement 3.2 - Do not store sensitive authentication data after authorization

**No Baseline Equivalent**: This is a unique PCI-DSS prohibition.

**Verification**:
- No CVV/CVC storage in database, logs, or files (code review confirms)
- No track data storage
- No PIN/PIN block storage
- Temporary SAD is securely deleted after authorization (overwrite memory, not just delete pointer)
- No SAD in exception logs or debug traces

---

## Rule PCI-05: Extended Audit Log Retention and Content

**Rule**: Beyond baseline audit logging (SECURITY-02, SECURITY-03), CHD audit logs MUST:
- **Extended retention**: Audit logs MUST be retained for minimum **12 months** (3 months immediately available for analysis)
- **Enhanced log content**: Logs MUST include all access to CHD, success/failure, origination, and affected data
- **Daily log review**: Logs MUST be reviewed daily (automated or manual)
- **Time synchronization**: All systems MUST use synchronized time (NTP)

**PCI-DSS Reference**: Requirement 10 - Log and monitor all access to network resources and cardholder data

**Baseline Rule Enhancement**: Extends SECURITY-02/SECURITY-03 with longer retention and daily review requirement.

**Verification**:
- Log retention is configured for 12 months minimum (3 months hot, 9 months archived)
- CHD access logs include all required fields
- Daily log review process is documented and automated where possible
- Time synchronization (NTP) is configured across all CHD systems

---

## Rule PCI-06: Cardholder Data Environment (CDE) Network Segmentation

**Rule**: Beyond baseline network security (SECURITY-07), the CDE MUST be segmented:
- **Segmentation requirement**: Systems storing, processing, or transmitting CHD MUST be in a separate network segment
- **DMZ separation**: Public-facing systems MUST be in separate zone from CHD storage
- **Firewall documentation**: Document all connections in/out of CDE (data flow diagrams)
- **Penetration testing**: Annual penetration testing of CDE segmentation

**PCI-DSS Reference**: Requirement 1.3 - Restrict connections between publicly accessible servers and components storing CHD

**Baseline Rule Enhancement**: Adds CDE-specific segmentation beyond SECURITY-07 general network restrictions.

**Verification**:
- CDE is in a separate network segment (VPC, subnet, VLAN)
- Firewall rules restrict CDE access to documented flows only
- Web servers are not in same segment as CHD storage
- Network architecture diagram shows CDE segmentation
- Penetration testing schedule includes segmentation validation

---

## Rule PCI-07: Enhanced MFA and Session Requirements

**Rule**: Beyond baseline authentication (SECURITY-12), systems with CHD access MUST:
- **MFA requirement**: MFA required for ALL access to CDE (not just remote access)
- **Password length**: Minimum 12 characters (or 8 with complexity requirements)
- **Account lockout**: Lock accounts after maximum 10 invalid login attempts (stricter than baseline)
- **Session timeout**: 15 minutes maximum for CDE access (stricter than baseline)

**PCI-DSS Reference**: Requirement 8 - Identify users and authenticate access to system components

**Baseline Rule Enhancement**: Adds stricter authentication requirements beyond SECURITY-12.

**Verification**:
- MFA is enabled for ALL CDE access (remote and local)
- Password policy enforces 12+ characters minimum (or 8+ with complexity)
- Account lockout after 10 failed attempts
- Session timeout configured (15 minutes maximum for CDE)

---

## Rule PCI-08: Anti-Malware and File Integrity Monitoring

**Rule**: Systems in the CDE MUST have:
- **Anti-malware**: Active anti-malware on all systems commonly affected by malware (periodic scanning if not real-time capable)
- **Integrity monitoring**: File integrity monitoring (FIM) on critical system files and CHD-related files
- **Alerting**: Alerts generated for malware detection and unauthorized file changes
- **Container scanning**: Container images MUST be scanned for vulnerabilities before deployment

**PCI-DSS Reference**: Requirement 5, 10.5 - Protect all systems against malware and integrity monitoring

**No Baseline Equivalent**: This is a unique PCI-DSS requirement (though related to SECURITY-10 supply chain).

**Verification**:
- Anti-malware is configured on applicable CDE systems
- File integrity monitoring is configured for critical system files
- Alerting is configured for malware and integrity violations
- Container images are scanned for vulnerabilities (if containers used)

---

## Rule PCI-09: Third-Party Service Provider PCI Compliance

**Rule**: Beyond baseline vendor management (SECURITY-10), third parties with CHD access MUST:
- **PCI compliance requirement**: Service providers MUST be PCI-DSS compliant (AOC required)
- **Due diligence**: Assess PCI compliance status before engagement
- **Written agreements**: Contracts MUST include PCI-DSS compliance requirements
- **Annual validation**: Validate service provider PCI compliance at least annually

**PCI-DSS Reference**: Requirement 12.8 - Maintain a policy that addresses information security for service providers

**Baseline Rule Enhancement**: Adds PCI-specific compliance requirements beyond SECURITY-10 vendor management.

**Verification**:
- Third-party service provider inventory exists
- Service provider PCI compliance status is documented (AOC on file)
- Contracts include PCI-DSS compliance requirements
- Annual compliance validation is scheduled

---

## Enforcement Integration

These PCI-DSS-specific rules work in conjunction with baseline security rules. At each stage:

1. **Verify baseline compliance first**: Ensure all applicable SECURITY-01 through SECURITY-16 rules are met
2. **Then verify PCI-DSS deltas**: Evaluate all PCI rule verification criteria against the artifacts produced
3. **Include comprehensive compliance section**: In the stage completion summary, list:
   - Baseline security rules: compliant/non-compliant/N/A
   - PCI-DSS-specific rules: compliant/non-compliant/N/A
4. **Blocking finding behavior**: If any baseline OR PCI-DSS rule is non-compliant, follow blocking finding behavior
5. **Documentation**: Include both SECURITY and PCI rule references in design documentation and test instructions

---

## Appendix: Rule Comparison with Baseline

| PCI-DSS Rule | Baseline Rule | Relationship |
|---|---|---|
| PCI-01 | SECURITY-01 (partial) | Extends: Requires explicit CHD inventory |
| PCI-02 | None | Delta: Unique PCI-DSS PAN masking requirement |
| PCI-03 | SECURITY-01 | Extends: Adds HSM, split knowledge, annual rotation |
| PCI-04 | None | Delta: Unique PCI-DSS SAD prohibition |
| PCI-05 | SECURITY-02, SECURITY-03 | Extends: 12-month retention + daily review |
| PCI-06 | SECURITY-07 | Extends: Adds CDE-specific segmentation |
| PCI-07 | SECURITY-12 | Extends: Stricter MFA, lockout, timeout |
| PCI-08 | SECURITY-10 (related) | Delta: Anti-malware + FIM requirement |
| PCI-09 | SECURITY-10 | Extends: Adds PCI compliance validation for vendors |

**Result**: 9 PCI-DSS-specific rules (vs original 15) — 40% reduction

---

## Appendix: PCI-DSS Requirement Mapping

For human reviewers, the following maps PCI delta rules to PCI-DSS v4.0 requirements:

| PCI Rule | PCI-DSS Requirement | Category |
|---|---|---|
| PCI-01 | 3.2 | Protect Stored Data |
| PCI-02 | 3.4 | Protect Stored Data |
| PCI-03 | 3.6 | Protect Stored Data |
| PCI-04 | 3.2 | Protect Stored Data |
| PCI-05 | 10 | Logging & Monitoring |
| PCI-06 | 1.3 | Network Security |
| PCI-07 | 8 | Authentication |
| PCI-08 | 5, 10.5 | Malware Protection |
| PCI-09 | 12.8 | Vendor Management |

---

## Appendix: Cardholder Data Environment (CDE) Scope

Systems are in scope for PCI-DSS if they:
1. Store, process, or transmit cardholder data
2. Are connected to systems that store, process, or transmit CHD
3. Could impact the security of CHD (security-relevant systems)

**Scope reduction strategies** (recommended):
- Tokenization (replace PAN with non-sensitive token via third-party service)
- Point-to-point encryption (P2PE)
- Network segmentation (isolate CDE)
- Outsourcing to PCI-compliant service providers (reduces your scope)
