# SOC 2 Compliance Rules (Delta)

## Overview

These SOC 2 (Service Organization Control 2) compliance rules are MANDATORY cross-cutting constraints for service organizations providing services to other entities.

**Important**: This document contains **ONLY** SOC 2-specific requirements beyond the baseline security rules. You MUST enforce **both** the baseline security rules (security-baseline.md) AND these SOC 2-specific rules for SOC 2-covered applications.

**Baseline Security Rules (Already Enforced for Security Common Criteria)**:
- ✅ SECURITY-01: Encryption → Maps to SOC 2 CC6.1, CC6.7
- ✅ SECURITY-02, SECURITY-03: Logging → Maps to SOC 2 CC7.1, CC7.2
- ✅ SECURITY-06, SECURITY-08: Access Control → Maps to SOC 2 CC6.1, CC6.2
- ✅ SECURITY-07: Network Configuration → Maps to SOC 2 CC6.1
- ✅ SECURITY-09: Security Hardening → Maps to SOC 2 CC6.1
- ✅ SECURITY-10: Supply Chain Security → Maps to SOC 2 CC9.2 (partial)
- ✅ SECURITY-12: Authentication → Maps to SOC 2 CC6.1, CC6.2
- ✅ SECURITY-14: Alerting and Monitoring → Maps to SOC 2 CC7.2, CC7.3
- ✅ SECURITY-16: Change Management → Maps to SOC 2 CC8.1

**SOC 2 Trust Services Criteria (TSC)**: These rules cover five Trust Services Criteria:
- **Security (Common Criteria)** - REQUIRED for all SOC 2 (mostly covered by baseline + deltas below)
- **Availability** - Optional (delta rules below)
- **Processing Integrity** - Optional (delta rules below)
- **Confidentiality** - Optional (delta rules below)
- **Privacy** - Optional (delta rules below)

**Applicability**: Service organizations that store, process, or transmit customer data and need to demonstrate trustworthy systems.

**Enforcement**: At each applicable stage, the model MUST verify compliance with these rules before presenting the stage completion message to the user.

### Blocking Compliance Finding Behavior

A **blocking compliance finding** means:
1. The finding MUST be listed in the stage completion message under a "SOC 2 Compliance Findings" section with the SOC2 rule ID and description
2. The stage MUST NOT present the "Continue to Next Stage" option until all blocking findings are resolved
3. The model MUST present only the "Request Changes" option with a clear explanation of what needs to change
4. The finding MUST be logged in `aidlc-docs/audit.md` with the SOC2 rule ID, description, and stage context

If a SOC2 rule is not applicable to the current project (e.g., SOC2-PRIV rules when privacy criteria not in scope), mark it as **N/A** in the compliance summary — this is not a blocking finding.

### Default Enforcement

All rules in this document are **blocking** by default. If any rule's verification criteria are not met, it is a blocking compliance finding — follow the blocking finding behavior defined above.

---

## Opt-In Configuration

**Opt-in prompt**: See `soc2-compliance.opt-in.md` (loaded separately for context efficiency)

**Project-level override**: Configure in `TECHNICAL_GUIDELINES.md` under `## Compliance Requirements` to skip opt-in prompt.

**Note**: SOC 2 compliance requires Security Baseline to also be enabled. If SOC 2 is enabled, Security Baseline is automatically enforced.

---

# Security (Common Criteria) - Delta Rules

**Note**: Most Security Common Criteria requirements are already covered by baseline security rules. The following are SOC 2-specific additions.

## Rule SOC2-SEC-01: Risk Assessment and Management

**Rule**: Beyond baseline security, formal risk management MUST exist:
- **Risk identification**: Regular identification of risks to security objectives
- **Risk assessment**: Evaluate likelihood and impact of identified risks
- **Risk treatment**: Document how risks are mitigated, accepted, or transferred
- **Vendor risk**: Assess risks from third-party service providers (beyond baseline vendor management)

**TSC Reference**: CC3.1, CC3.2, CC3.3 - Risk Assessment

**No Direct Baseline Equivalent**: Baseline focuses on controls; SOC 2 requires formal risk management process.

**Verification**:
- Risk assessment process is documented (at least annually)
- Design documentation includes risk considerations
- Third-party services are evaluated for security (SOC reports requested/reviewed)
- Accepted risks are documented with rationale and management approval

---

## Rule SOC2-SEC-02: Policies and Procedures Documentation

**Rule**: Security policies and procedures MUST be documented:
- **Policy documentation**: Written security policies covering all relevant areas
- **Procedure documentation**: Documented operational procedures
- **Annual review**: Policies reviewed and updated at least annually
- **Communication**: Policies communicated to personnel and acknowledgment tracked

**TSC Reference**: CC1.1, CC1.2 - Control Environment

**No Direct Baseline Equivalent**: Baseline focuses on technical controls; SOC 2 requires documented governance.

**Verification**:
- Security policies are documented (access control, incident response, change management, etc.)
- Operational procedures are documented
- Policy review dates are tracked (annual minimum)
- Policy acknowledgment by personnel is tracked

---

## Rule SOC2-SEC-03: Security Awareness and Training

**Rule**: Personnel MUST receive security training:
- **Security awareness**: Regular security awareness training (at least annually)
- **Role-specific training**: Training appropriate to job function
- **New hire training**: Security training for new personnel (within 30 days)
- **Training records**: Maintain training completion records

**TSC Reference**: CC1.4 - Commitment to Competence

**No Direct Baseline Equivalent**: Baseline focuses on technical controls; SOC 2 requires training program.

**Verification**:
- Security training program is documented
- Training completion is tracked
- New hire onboarding includes security training
- Training is refreshed at least annually

---

## Rule SOC2-SEC-04: Management Oversight

**Rule**: Management oversight MUST exist:
- **Governance**: Security governance structure defined (roles and responsibilities)
- **Management review**: Regular management review of security (at least quarterly)
- **Risk acceptance**: Management approval required for risk acceptance decisions
- **Resource allocation**: Adequate resources allocated for security

**TSC Reference**: CC1.1, CC1.2 - Governance and Oversight

**No Direct Baseline Equivalent**: Baseline focuses on technical controls; SOC 2 requires governance.

**Verification**:
- Security governance structure is documented
- Management review of security is scheduled (quarterly minimum)
- Risk acceptance decisions require management approval and documentation
- Security responsibilities are assigned with adequate resources

---

# Availability Criteria - Delta Rules

**Note**: These rules are ONLY applicable if Availability is a selected Trust Services Criterion.

## Rule SOC2-AVAIL-01: System Availability Commitments

**Rule**: Availability commitments MUST be defined and monitored:
- **SLA definition**: Define availability targets (e.g., 99.9% uptime)
- **Monitoring**: Monitor system availability continuously
- **Reporting**: Track and report availability metrics against SLA
- **Communication**: Communicate availability status to customers (status page)

**TSC Reference**: A1.1 - Availability Commitments

**No Baseline Equivalent**: This is a unique SOC 2 Availability requirement.

**Verification**:
- Availability SLA is documented
- Uptime monitoring is configured
- Availability metrics are tracked and reported
- Status page or communication mechanism exists

---

## Rule SOC2-AVAIL-02: Capacity Management

**Rule**: System capacity MUST be planned and monitored:
- **Capacity planning**: Forecast and plan for capacity needs
- **Monitoring**: Monitor capacity utilization (CPU, memory, storage, network)
- **Scaling**: Ability to scale resources as needed (auto-scaling configured)
- **Thresholds**: Alerting when capacity thresholds approached

**TSC Reference**: A1.1 - Capacity Management

**No Baseline Equivalent**: This is a unique SOC 2 Availability requirement.

**Verification**:
- Auto-scaling is configured where applicable
- Capacity monitoring alerts are configured
- Capacity planning is documented (reviewed at least quarterly)
- Resource limits are defined and monitored

---

## Rule SOC2-AVAIL-03: Backup and Recovery

**Rule**: Data and systems MUST be recoverable:
- **Backup procedures**: Regular backups of data and configurations (automated)
- **Recovery testing**: Periodic testing of recovery procedures (at least annually)
- **RTO/RPO**: Define Recovery Time and Point Objectives
- **Geographic redundancy**: Consider off-site/multi-region backups

**TSC Reference**: A1.2 - System Recovery

**Baseline Reference**: SECURITY-09 mentions backups but not with SOC 2 rigor.

**Verification**:
- Automated backups are configured
- RTO and RPO are documented
- Backup restoration has been tested or test plan exists
- Backups are stored in separate location/region

---

## Rule SOC2-AVAIL-04: Disaster Recovery

**Rule**: Disaster recovery capabilities MUST exist:
- **DR plan**: Documented disaster recovery plan
- **DR testing**: Regular testing of DR procedures (at least annually)
- **Business continuity**: Procedures for continued operations during incidents
- **Communication plan**: Stakeholder communication during disasters

**TSC Reference**: A1.3 - Disaster Recovery

**No Baseline Equivalent**: This is a unique SOC 2 Availability requirement.

**Verification**:
- Disaster recovery plan is documented
- DR testing schedule exists (annual minimum)
- Multi-region or multi-AZ deployment for critical systems
- Communication plan for outages exists

---

# Processing Integrity Criteria - Delta Rules

**Note**: These rules are ONLY applicable if Processing Integrity is a selected Trust Services Criterion.

## Rule SOC2-PI-01: Complete and Accurate Processing

**Rule**: System processing MUST be complete, valid, accurate, and timely:
- **Input validation**: Validate all inputs for completeness and accuracy (extends SECURITY-05)
- **Processing verification**: Verify processing produces correct results
- **Output validation**: Validate outputs before delivery
- **Error handling**: Detect and handle processing errors appropriately

**TSC Reference**: PI1.1 - Processing Integrity

**Baseline Reference**: SECURITY-05 covers input validation; PI extends to output validation and processing verification.

**Verification**:
- Input validation exists for all data entry points
- Business rule validation is implemented
- Error handling provides meaningful feedback
- Processing results can be verified/audited

---

## Rule SOC2-PI-02: Data Quality

**Rule**: Data quality MUST be maintained:
- **Data validation**: Validate data accuracy at input
- **Referential integrity**: Maintain data relationships (foreign keys, constraints)
- **Duplicate prevention**: Prevent or detect duplicate records
- **Data reconciliation**: Reconcile data between systems

**TSC Reference**: PI1.2, PI1.3 - Data Quality

**No Direct Baseline Equivalent**: Baseline focuses on security; PI focuses on data quality.

**Verification**:
- Database constraints enforce referential integrity
- Duplicate detection mechanisms exist where applicable
- Data validation rules are implemented
- Audit trails track data changes

---

## Rule SOC2-PI-03: Processing Monitoring

**Rule**: Processing MUST be monitored:
- **Transaction logging**: Log significant transactions
- **Error monitoring**: Monitor for processing errors
- **Alerting**: Alert on processing anomalies
- **Audit trails**: Maintain audit trails for processing

**TSC Reference**: PI1.4, PI1.5 - Processing Monitoring

**Baseline Reference**: SECURITY-03 covers application logging; PI extends to transaction-specific logging.

**Verification**:
- Transaction logging is implemented
- Error monitoring and alerting is configured
- Audit trails exist for significant transactions
- Processing metrics are tracked

---

# Confidentiality Criteria - Delta Rules

**Note**: These rules are ONLY applicable if Confidentiality is a selected Trust Services Criterion.

## Rule SOC2-CONF-01: Confidential Information Classification

**Rule**: Confidential information MUST be identified and classified:
- **Classification scheme**: Define confidentiality levels (e.g., Public, Internal, Confidential, Restricted)
- **Labeling**: Mark or tag confidential data in data models
- **Inventory**: Maintain inventory of confidential data
- **Handling procedures**: Define procedures for each classification level

**TSC Reference**: C1.1 - Confidential Information Identification

**No Direct Baseline Equivalent**: Baseline encrypts all sensitive data; Confidentiality requires explicit classification.

**Verification**:
- Data classification scheme is documented
- Confidential data is identified in data models
- Handling procedures exist for confidential data
- Code and schemas reflect data sensitivity (field-level classification)

---

## Rule SOC2-CONF-02: Confidentiality Protection

**Rule**: Beyond baseline encryption (SECURITY-01), confidential information MUST be protected:
- **Access control**: Restrict access to authorized personnel (role-based, least privilege)
- **Data masking**: Mask confidential data in non-production environments
- **Secure disposal**: Securely dispose of confidential data when no longer needed (crypto-shredding or secure deletion)

**TSC Reference**: C1.2 - Confidentiality Protection

**Baseline Reference**: SECURITY-01 covers encryption; Confidentiality extends to masking and disposal.

**Verification**:
- Access to confidential data requires explicit authorization
- Non-production environments use masked/synthetic data
- Data retention and disposal procedures are documented
- Crypto-shredding or secure deletion is used for confidential data disposal

---

# Privacy Criteria - Delta Rules

**Note**: These rules are ONLY applicable if Privacy is a selected Trust Services Criterion.

## Rule SOC2-PRIV-01: Privacy Notice and Consent

**Rule**: Personal information collection MUST be transparent:
- **Privacy notice**: Clear notice about data collection practices (privacy policy)
- **Consent**: Obtain consent where required (opt-in for sensitive data)
- **Purpose limitation**: Collect only for stated purposes
- **Choice**: Provide choices about data use where applicable (opt-out mechanisms)

**TSC Reference**: P1.1, P2.1 - Notice and Choice/Consent

**No Baseline Equivalent**: This is a unique SOC 2 Privacy requirement.

**Verification**:
- Privacy policy/notice is documented and accessible
- Consent mechanisms exist where required
- Data collection is limited to stated purposes
- User preferences can be captured and honored

---

## Rule SOC2-PRIV-02: Personal Information Use and Retention

**Rule**: Personal information MUST be used and retained appropriately:
- **Purpose limitation**: Use only for disclosed purposes
- **Retention limits**: Define and enforce retention periods
- **Data minimization**: Collect only necessary personal information
- **Secondary use**: Obtain consent for secondary uses (e.g., marketing)

**TSC Reference**: P3.1, P4.1 - Collection and Use/Retention/Disposal

**No Baseline Equivalent**: This is a unique SOC 2 Privacy requirement.

**Verification**:
- Data retention policy is documented
- Personal data has defined retention periods
- Data minimization principles are applied
- Data deletion/anonymization procedures exist

---

## Rule SOC2-PRIV-03: Data Subject Rights

**Rule**: Data subject rights MUST be supported:
- **Access**: Allow individuals to access their personal data
- **Correction**: Allow individuals to correct inaccurate data
- **Deletion**: Support deletion requests where applicable (right to erasure)
- **Portability**: Support data portability where required (export in usable format)

**TSC Reference**: P5.1, P5.2 - Access, Correction

**No Baseline Equivalent**: This is a unique SOC 2 Privacy requirement.

**Verification**:
- Process exists for handling data access requests
- Mechanism exists to correct personal data
- Deletion capability exists for personal data
- Data can be exported in usable format (JSON, CSV, etc.)

---

## Rule SOC2-PRIV-04: Privacy Incident Management

**Rule**: Privacy incidents MUST be managed:
- **Detection**: Mechanisms to detect privacy incidents (unauthorized access to personal data)
- **Response**: Procedures for responding to privacy incidents
- **Notification**: Ability to notify affected individuals (breach notification capability)
- **Remediation**: Procedures to remediate privacy incidents

**TSC Reference**: P6.1, P6.2, P6.3 - Disclosure and Notification

**Baseline Reference**: SECURITY-14 covers security incidents; Privacy extends to privacy-specific incidents.

**Verification**:
- Privacy incident response procedures are documented
- Mechanism exists to identify affected individuals
- Notification templates/procedures exist
- Privacy incidents are logged and tracked

---

## Enforcement Integration

These SOC 2-specific rules work in conjunction with baseline security rules. At each stage:

1. **Verify baseline compliance first**: Ensure all applicable SECURITY-01 through SECURITY-16 rules are met
2. **Then verify SOC 2 deltas**: Evaluate applicable SOC2 rule verification criteria based on selected Trust Services Criteria
3. **Include comprehensive compliance section**: In the stage completion summary, list:
   - Baseline security rules: compliant/non-compliant/N/A
   - SOC 2 Security deltas: compliant/non-compliant/N/A
   - SOC 2 Availability (if applicable): compliant/non-compliant/N/A
   - SOC 2 Processing Integrity (if applicable): compliant/non-compliant/N/A
   - SOC 2 Confidentiality (if applicable): compliant/non-compliant/N/A
   - SOC 2 Privacy (if applicable): compliant/non-compliant/N/A
4. **Blocking finding behavior**: If any baseline OR SOC2 rule is non-compliant, follow blocking finding behavior
5. **Documentation**: Include both SECURITY and SOC2 rule references in design documentation and test instructions

---

## Appendix: Rule Comparison with Baseline

| SOC2 Rule | Baseline Rule | Relationship |
|---|---|---|
| **Security Deltas** | | |
| SOC2-SEC-01 | None | Delta: Risk management process |
| SOC2-SEC-02 | None | Delta: Policy documentation |
| SOC2-SEC-03 | None | Delta: Training program |
| SOC2-SEC-04 | None | Delta: Management oversight |
| **Availability** | | |
| SOC2-AVAIL-01 | None | Delta: SLA monitoring |
| SOC2-AVAIL-02 | None | Delta: Capacity management |
| SOC2-AVAIL-03 | SECURITY-09 (partial) | Extends: Adds testing and RTO/RPO |
| SOC2-AVAIL-04 | None | Delta: DR plan and testing |
| **Processing Integrity** | | |
| SOC2-PI-01 | SECURITY-05 | Extends: Adds output validation |
| SOC2-PI-02 | None | Delta: Data quality focus |
| SOC2-PI-03 | SECURITY-03 | Extends: Transaction logging |
| **Confidentiality** | | |
| SOC2-CONF-01 | None | Delta: Classification scheme |
| SOC2-CONF-02 | SECURITY-01 | Extends: Adds masking and disposal |
| **Privacy** | | |
| SOC2-PRIV-01 | None | Delta: Privacy notice and consent |
| SOC2-PRIV-02 | None | Delta: Purpose limitation and retention |
| SOC2-PRIV-03 | None | Delta: Data subject rights |
| SOC2-PRIV-04 | SECURITY-14 | Extends: Privacy-specific incident response |

**Result**: 18 SOC 2-specific rules (vs original 23 for Security-only, 27 for all criteria) — 21-34% reduction depending on criteria selected

---

## Appendix: Trust Services Criteria Mapping

For human reviewers, the following maps SOC2 delta rules to Trust Services Criteria categories:

| SOC2 Rule | Trust Services Criteria | Required? |
|---|---|---|
| SOC2-SEC-01 | CC3.1, CC3.2, CC3.3 | Yes (Security Common Criteria) |
| SOC2-SEC-02 | CC1.1, CC1.2 | Yes (Security Common Criteria) |
| SOC2-SEC-03 | CC1.4 | Yes (Security Common Criteria) |
| SOC2-SEC-04 | CC1.1, CC1.2 | Yes (Security Common Criteria) |
| SOC2-AVAIL-01 | A1.1 | Only if Availability selected |
| SOC2-AVAIL-02 | A1.1 | Only if Availability selected |
| SOC2-AVAIL-03 | A1.2 | Only if Availability selected |
| SOC2-AVAIL-04 | A1.3 | Only if Availability selected |
| SOC2-PI-01 | PI1.1 | Only if Processing Integrity selected |
| SOC2-PI-02 | PI1.2, PI1.3 | Only if Processing Integrity selected |
| SOC2-PI-03 | PI1.4, PI1.5 | Only if Processing Integrity selected |
| SOC2-CONF-01 | C1.1 | Only if Confidentiality selected |
| SOC2-CONF-02 | C1.2 | Only if Confidentiality selected |
| SOC2-PRIV-01 | P1.1, P2.1 | Only if Privacy selected |
| SOC2-PRIV-02 | P3.1, P4.1 | Only if Privacy selected |
| SOC2-PRIV-03 | P5.1, P5.2 | Only if Privacy selected |
| SOC2-PRIV-04 | P6.1, P6.2, P6.3 | Only if Privacy selected |

---

## Appendix: SOC 2 Report Types

**SOC 2 Type I**: Point-in-time assessment of control design
**SOC 2 Type II**: Assessment of control design AND operating effectiveness over a period (typically 6-12 months)

These delta rules support both Type I and Type II audits by ensuring controls are properly designed (with baseline) and can demonstrate ongoing operation (with delta governance/monitoring rules).
