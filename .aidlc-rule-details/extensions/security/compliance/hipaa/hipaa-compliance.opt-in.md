# HIPAA Compliance — Opt-In

**Extension**: HIPAA Compliance (Delta)

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: HIPAA Compliance Extensions
Does this application handle Protected Health Information (PHI) or electronic PHI (ePHI)?

A) Yes — enforce Security Baseline + HIPAA delta rules as blocking constraints (required for healthcare applications)
B) No — skip HIPAA delta rules (application does not handle PHI/ePHI, but Security Baseline still applies)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `HIPAA \| Yes \| ...` | Enforce Security Baseline + all HIPAA delta rules, skip opt-in prompt |
| `HIPAA \| No \| ...` | Skip all HIPAA delta rules, skip opt-in prompt |
| HIPAA not listed | Present this opt-in prompt |

**Note**: HIPAA compliance requires Security Baseline to also be enabled. If HIPAA is enabled, Security Baseline is automatically enforced.

## Deferred Rule Loading

**Full rules location**: `hipaa-compliance.md` (same directory)

After user opts IN:
- Load `hipaa-compliance.md` for full HIPAA-01 through HIPAA-08 delta rules
- Also load `security-baseline.md` if not already loaded (HIPAA requires baseline)
- Rules are then enforced at each applicable stage

After user opts OUT:
- Do NOT load `hipaa-compliance.md`
- Skip all HIPAA delta rule enforcement
- Log skip in `aidlc-docs/audit.md`
