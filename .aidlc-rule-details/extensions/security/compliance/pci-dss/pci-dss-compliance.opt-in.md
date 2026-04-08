# PCI-DSS Compliance — Opt-In

**Extension**: PCI-DSS Compliance (Delta)

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: PCI-DSS Compliance Extensions
Does this application store, process, or transmit cardholder data (credit/debit card numbers, CVV, etc.)?

A) Yes — enforce Security Baseline + PCI-DSS delta rules as blocking constraints (required for payment applications)
B) No — skip PCI-DSS delta rules (application does not handle cardholder data, but Security Baseline still applies)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `PCI-DSS \| Yes \| ...` | Enforce Security Baseline + all PCI-DSS delta rules, skip opt-in prompt |
| `PCI-DSS \| No \| ...` | Skip all PCI-DSS delta rules, skip opt-in prompt |
| PCI-DSS not listed | Present this opt-in prompt |

**Note**: PCI-DSS compliance requires Security Baseline to also be enabled. If PCI-DSS is enabled, Security Baseline is automatically enforced.

**PCI-DSS Version**: These rules align with PCI-DSS v4.0 requirements.

## Deferred Rule Loading

**Full rules location**: `pci-dss-compliance.md` (same directory)

After user opts IN:
- Load `pci-dss-compliance.md` for full PCI-01 through PCI-10+ delta rules
- Also load `security-baseline.md` if not already loaded (PCI-DSS requires baseline)
- Rules are then enforced at each applicable stage

After user opts OUT:
- Do NOT load `pci-dss-compliance.md`
- Skip all PCI-DSS delta rule enforcement
- Log skip in `aidlc-docs/audit.md`
