# UI Baseline — Opt-In

**Extension**: UI/UX Baseline

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: UI/UX Extensions
Should UI/UX baseline rules be enforced for this project?

A) Yes — enforce accessibility, performance, and UI security rules (recommended for web/mobile applications)
B) No — skip UI/UX rules (suitable for backend-only, CLI, or library projects)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `UI Baseline \| Yes \| ...` | Enforce all UIUX rules, skip opt-in prompt |
| `UI Baseline \| No \| ...` | Skip all UIUX rules, skip opt-in prompt |
| UI Baseline not listed | Present this opt-in prompt |

**Recommendation**: UI Baseline should be enabled for all applications with user interfaces. Only disable for backend-only services, CLI tools, or library packages.

## Deferred Rule Loading

**Full rules location**: `ui-baseline.md` (same directory)

After user opts IN:
- Load `ui-baseline.md` for full UIUX-01 through UIUX-13 rules
- Rules are enforced during Code Generation and Testing phases
- Blocking rules: UIUX-01 to UIUX-05, UIUX-09, UIUX-11, UIUX-13
- Advisory rules: UIUX-06 to UIUX-08, UIUX-10, UIUX-12

After user opts OUT:
- Do NOT load `ui-baseline.md`
- Skip all UIUX rule enforcement
- Log skip in `aidlc-docs/audit.md`
