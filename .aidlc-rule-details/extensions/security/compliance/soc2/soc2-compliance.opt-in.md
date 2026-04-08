# SOC 2 Compliance — Opt-In

**Extension**: SOC 2 Compliance (Delta)

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: SOC 2 Compliance Extensions
Does this application need to comply with SOC 2 Trust Services Criteria?

A) Yes, all five criteria — enforce Security, Availability, Processing Integrity, Confidentiality, and Privacy rules
B) Yes, Security only — enforce Security (Common Criteria) delta rules only (baseline already covers most)
C) Yes, select criteria — I will specify which criteria apply (Security + selected others)
D) No — skip all SOC 2 delta rules (but Security Baseline still applies)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `SOC 2 \| Yes \| ...` | Enforce Security Baseline + all SOC 2 delta rules (all five criteria), skip opt-in prompt |
| `SOC 2 \| Security Only \| ...` | Enforce Security Baseline + Security delta rules only (skip Availability, PI, Confidentiality, Privacy) |
| `SOC 2 \| No \| ...` | Skip all SOC 2 delta rules, skip opt-in prompt |
| SOC 2 not listed | Present this opt-in prompt |

**Extended configuration** (optional): To specify which Trust Services Criteria apply, use the rationale column:

```markdown
| SOC 2 | Yes | Security + Availability + Confidentiality (no Privacy/PI) |
```

**Note**: SOC 2 compliance requires Security Baseline to also be enabled. If SOC 2 is enabled, Security Baseline is automatically enforced.

## SOC 2 Trust Services Criteria

- **Security (Common Criteria)** - REQUIRED for all SOC 2
- **Availability** - Optional
- **Processing Integrity** - Optional
- **Confidentiality** - Optional
- **Privacy** - Optional

## Deferred Rule Loading

**Full rules location**: `soc2-compliance.md` (same directory)

After user opts IN:
- Load `soc2-compliance.md` for full SOC2-SEC, SOC2-AVAIL, SOC2-PI, SOC2-CONF, SOC2-PRIV rules
- Also load `security-baseline.md` if not already loaded (SOC 2 requires baseline)
- Only enforce criteria that user selected (all five, Security only, or select criteria)
- Rules are then enforced at each applicable stage

After user opts OUT:
- Do NOT load `soc2-compliance.md`
- Skip all SOC 2 delta rule enforcement
- Log skip in `aidlc-docs/audit.md`
