# Security Baseline — Opt-In

**Extension**: Security Baseline

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)
B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `Security Baseline \| Yes \| ...` | Enforce all SECURITY rules, skip opt-in prompt |
| `Security Baseline \| No \| ...` | Skip all SECURITY rules, skip opt-in prompt |
| Security Baseline not listed | Present this opt-in prompt |

**Recommendation**: Security Baseline should be enabled for all production applications. Only disable for PoCs, prototypes, and experimental projects.

## Deferred Rule Loading

**Full rules location**: `security-baseline.md` (same directory)

After user opts IN:
- Load `security-baseline.md` for full SECURITY-01 through SECURITY-16 rules
- Rules are then enforced at each applicable stage

After user opts OUT:
- Do NOT load `security-baseline.md`
- Skip all SECURITY rule enforcement
- Log skip in `aidlc-docs/audit.md`
