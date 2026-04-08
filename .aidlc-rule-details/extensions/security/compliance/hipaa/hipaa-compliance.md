# HIPAA Compliance Rules (Delta)

## Overview

These HIPAA (Health Insurance Portability and Accountability Act) compliance rules are MANDATORY cross-cutting constraints for healthcare applications handling Protected Health Information (PHI).

**Important**: This document contains **ONLY** HIPAA-specific requirements beyond the baseline security rules. You MUST enforce **both** the baseline security rules (security-baseline.md) AND these HIPAA-specific rules for HIPAA-covered applications.

**Baseline Security Rules (Already Enforced)**:
- ✅ SECURITY-01: Encryption at Rest and in Transit → Maps to HIPAA 45 CFR 164.312(a)(2)(iv), 164.312(e)(1)
- ✅ SECURITY-02, SECURITY-03: Access Logging → Maps to HIPAA 45 CFR 164.312(b)
- ✅ SECURITY-06, SECURITY-08: Access Control → Maps to HIPAA 45 CFR 164.312(a)(1)
- ✅ SECURITY-12: Authentication and Credential Management → Maps to HIPAA 45 CFR 164.312(d)
- ✅ SECURITY-10: Software Supply Chain Security → Supports HIPAA integrity controls
- ✅ SECURITY-05: Input Validation → Maps to HIPAA 45 CFR 164.312(c)(1) - Integrity

**Applicability**: These rules apply to applications that create, receive, maintain, or transmit Protected Health Information (PHI) or electronic PHI (ePHI).

**Enforcement**: At each applicable stage, the model MUST verify compliance with these rules before presenting the stage completion message to the user.

### Blocking Compliance Finding Behavior

A **blocking compliance finding** means:
1. The finding MUST be listed in the stage completion message under a "HIPAA Compliance Findings" section with the HIPAA rule ID and description
2. The stage MUST NOT present the "Continue to Next Stage" option until all blocking findings are resolved
3. The model MUST present only the "Request Changes" option with a clear explanation of what needs to change
4. The finding MUST be logged in `aidlc-docs/audit.md` with the HIPAA rule ID, description, and stage context

If a HIPAA rule is not applicable to the current project (e.g., HIPAA-01 when no PHI is stored), mark it as **N/A** in the compliance summary — this is not a blocking finding.

### Default Enforcement

All rules in this document are **blocking** by default. If any rule's verification criteria are not met, it is a blocking compliance finding — follow the blocking finding behavior defined above.

---

## Opt-In Configuration

**Opt-in prompt**: See `hipaa-compliance.opt-in.md` (loaded separately for context efficiency)

**Project-level override**: Configure in `TECHNICAL_GUIDELINES.md` under `## Compliance Requirements` to skip opt-in prompt.

**Note**: HIPAA compliance requires Security Baseline to also be enabled. If HIPAA is enabled, Security Baseline is automatically enforced.

---

# HIPAA-Specific Rules (Beyond Baseline)

## Rule HIPAA-01: PHI Data Classification and Inventory

**Rule**: Every application handling PHI MUST maintain a data classification inventory:
- **PHI identification**: All data elements containing PHI MUST be explicitly identified and documented
- **Data flow mapping**: Document where PHI enters, is processed, stored, and exits the system
- **Minimum necessary**: Only collect and retain PHI that is necessary for the intended purpose
- **Data dictionary**: Maintain a data dictionary identifying which fields contain PHI

**HIPAA Reference**: 45 CFR 164.502(b) - Minimum Necessary Standard

**Baseline Rule Enhancement**: This extends SECURITY-01 (Encryption) by requiring explicit PHI identification before encryption can be properly applied.

**Verification**:
- A PHI data inventory document exists identifying all PHI data elements
- Data flow diagrams show PHI movement through the system
- No PHI is collected beyond what is documented as necessary
- Database schemas clearly indicate which columns contain PHI

---

## Rule HIPAA-02: Enhanced PHI Access Controls

**Rule**: Beyond baseline access controls (SECURITY-06, SECURITY-08), PHI access MUST include:
- **Emergency access**: Procedures MUST exist for emergency access to PHI (break-glass scenarios)
- **Automatic logoff**: Sessions accessing PHI MUST have automatic timeout (recommended: 15 minutes of inactivity)
- **Access termination**: Procedures MUST exist to immediately revoke access when no longer needed

**HIPAA Reference**: 45 CFR 164.312(a)(1) - Access Control (Emergency Access Procedure)

**Baseline Rule Enhancement**: Adds emergency access and stricter timeout requirements beyond SECURITY-08.

**Verification**:
- Emergency access procedures are documented (break-glass workflows)
- Session timeout is configured (15 minutes maximum for PHI access)
- Access provisioning/deprovisioning procedures are documented
- Emergency access events are logged and reviewed

---

## Rule HIPAA-03: Extended Audit Log Retention

**Rule**: Beyond baseline audit logging (SECURITY-02, SECURITY-03), PHI audit logs MUST:
- **Extended retention**: Audit logs MUST be retained for minimum **6 years** (vs baseline 90 days)
- **Log content enhancement**: Logs MUST include PHI affected (by identifier, not content)

**HIPAA Reference**: 45 CFR 164.312(b) - Audit Controls

**Baseline Rule Enhancement**: Extends SECURITY-02/SECURITY-03 retention period and log detail requirements.

**Verification**:
- Log storage is configured for 6-year retention (vs baseline 90 days)
- PHI access logs include resource identifiers (patient ID, record ID)
- Retention policy is documented and enforced

---

## Rule HIPAA-04: Business Associate Agreements

**Rule**: All third parties with PHI access MUST have Business Associate Agreements:
- **BAA requirement**: Every vendor, subcontractor, or service processing PHI MUST have a signed BAA
- **BAA tracking**: Maintain an inventory of all Business Associates
- **Cloud services**: Cloud providers handling PHI MUST have HIPAA-eligible services and signed BAAs
- **Subcontractor flow-down**: BAAs MUST require subcontractors to also comply

**HIPAA Reference**: 45 CFR 164.502(e) - Business Associates

**No Baseline Equivalent**: This is a unique HIPAA requirement.

**Verification**:
- Third-party service inventory exists
- BAAs are documented for all services handling PHI
- Cloud services used are HIPAA-eligible (e.g., AWS BAA, Azure BAA, Google Cloud BAA)
- No PHI is sent to services without BAAs

---

## Rule HIPAA-05: Breach Notification Capability

**Rule**: Beyond baseline monitoring (SECURITY-14), systems MUST support:
- **Breach detection**: Monitoring MUST exist to detect unauthorized PHI access
- **Notification support**: System MUST support identifying affected individuals for breach notification
- **Risk assessment**: Capability to assess breach risk (low probability threshold analysis)

**HIPAA Reference**: 45 CFR 164.400-414 - Breach Notification Rule

**Baseline Rule Enhancement**: Adds breach notification support beyond SECURITY-14 alerting.

**Verification**:
- Alerting exists for anomalous PHI access patterns
- System can identify which individuals' PHI was affected in an incident
- Breach risk assessment template or procedure exists
- Incident response procedures include breach notification steps

---

## Rule HIPAA-06: Patient Rights Support

**Rule**: Systems MUST support patient rights under HIPAA:
- **Access right**: Patients MUST be able to access their PHI (within 30 days of request)
- **Amendment right**: Patients MUST be able to request amendments to their PHI
- **Accounting of disclosures**: System MUST track and report PHI disclosures
- **Restriction requests**: System MUST support patient requests to restrict PHI use
- **Data portability**: PHI MUST be exportable in a usable electronic format (FHIR, CCD, etc.)

**HIPAA Reference**: 45 CFR 164.524-528 - Individual Rights

**No Baseline Equivalent**: This is a unique HIPAA requirement.

**Verification**:
- Patient portal or process exists for PHI access requests
- Amendment request workflow is implemented
- Disclosure tracking is logged (beyond baseline access logging)
- PHI can be exported in standard formats (e.g., FHIR, CCD, HL7)
- Restriction flags can be applied to patient records

---

## Rule HIPAA-07: De-identification and Anonymization

**Rule**: When PHI is used for secondary purposes (analytics, research, testing), de-identification MUST be applied:
- **Safe Harbor method**: Remove all 18 HIPAA identifiers, OR
- **Expert determination**: Statistical/scientific expert certifies re-identification risk is minimal
- **Limited data sets**: When full de-identification is not possible, use limited data sets with data use agreements
- **Test/dev environments**: MUST NOT use real PHI (use de-identified, synthetic, or masked data)

**HIPAA Reference**: 45 CFR 164.514 - De-identification of Protected Health Information

**No Baseline Equivalent**: This is a unique HIPAA requirement.

**Verification**:
- Analytics and reporting use de-identified data where possible
- De-identification method is documented (Safe Harbor or Expert Determination)
- Test/development environments do not use real PHI
- Data masking or synthetic data is used for non-production environments

---

## Rule HIPAA-08: Contingency Planning and Backup

**Rule**: Beyond baseline backup (SECURITY-09), PHI systems MUST have:
- **Data backup plan**: PHI MUST be backed up regularly with documented procedures
- **Disaster recovery plan**: Recovery procedures MUST exist for PHI systems
- **Emergency mode operations**: Procedures for operating in emergency mode with critical PHI access
- **Testing requirement**: Backup and recovery procedures MUST be tested periodically

**HIPAA Reference**: 45 CFR 164.308(a)(7) - Contingency Plan

**Baseline Rule Enhancement**: Adds testing and emergency mode requirements beyond any baseline backup considerations.

**Verification**:
- Automated backup is configured for PHI data stores
- Recovery procedures are documented
- Recovery time objective (RTO) and recovery point objective (RPO) are defined
- Backup restoration has been tested or test plan exists
- Emergency mode operation procedures exist

---

## Enforcement Integration

These HIPAA-specific rules work in conjunction with baseline security rules. At each stage:

1. **Verify baseline compliance first**: Ensure all applicable SECURITY-01 through SECURITY-16 rules are met
2. **Then verify HIPAA deltas**: Evaluate all HIPAA rule verification criteria against the artifacts produced
3. **Include comprehensive compliance section**: In the stage completion summary, list:
   - Baseline security rules: compliant/non-compliant/N/A
   - HIPAA-specific rules: compliant/non-compliant/N/A
4. **Blocking finding behavior**: If any baseline OR HIPAA rule is non-compliant, follow blocking finding behavior
5. **Documentation**: Include both SECURITY and HIPAA rule references in design documentation and test instructions

---

## Appendix: Rule Comparison with Baseline

| HIPAA Rule | Baseline Rule | Relationship |
|---|---|---|
| HIPAA-01 | SECURITY-01 (partial) | Extends: Requires explicit PHI identification before encryption |
| HIPAA-02 | SECURITY-08 | Extends: Adds emergency access and stricter timeouts |
| HIPAA-03 | SECURITY-02, SECURITY-03 | Extends: 6-year retention vs 90-day baseline |
| HIPAA-04 | None | Delta: Unique HIPAA BAA requirement |
| HIPAA-05 | SECURITY-14 | Extends: Adds breach notification support |
| HIPAA-06 | None | Delta: Unique HIPAA patient rights requirement |
| HIPAA-07 | None | Delta: Unique HIPAA de-identification requirement |
| HIPAA-08 | SECURITY-09 (partial) | Extends: Adds testing and emergency mode |

**Result**: 8 HIPAA-specific rules (vs original 15) — 47% reduction

---

## Appendix: HIPAA Safeguard Categories

For human reviewers, the following maps HIPAA delta rules to safeguard categories:

| HIPAA Rule | Safeguard Category | CFR Reference |
|---|---|---|
| HIPAA-01 | Administrative | 45 CFR 164.502(b) |
| HIPAA-02 | Technical | 45 CFR 164.312(a)(1) |
| HIPAA-03 | Technical | 45 CFR 164.312(b) |
| HIPAA-04 | Administrative | 45 CFR 164.502(e) |
| HIPAA-05 | Administrative | 45 CFR 164.400-414 |
| HIPAA-06 | Administrative | 45 CFR 164.524-528 |
| HIPAA-07 | Technical | 45 CFR 164.514 |
| HIPAA-08 | Administrative | 45 CFR 164.308(a)(7) |
