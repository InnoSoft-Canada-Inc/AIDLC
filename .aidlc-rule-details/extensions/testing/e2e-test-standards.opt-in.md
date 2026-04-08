# E2E Test Standards — Opt-In

**Extension**: E2E Test Standards

## Opt-In Prompt

The following question is automatically included in the Requirements Analysis clarifying questions when this extension is loaded:

```markdown
## Question: E2E Testing Extensions
Does this project include end-to-end workflow testing (E2E tests)?

A) Yes — enforce E2E test coverage rules (recommended for web/mobile apps with user workflows)
B) No — skip E2E rules (suitable for backend APIs, libraries, or infrastructure-only projects)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

## Project-Level Configuration

Check `TECHNICAL_GUIDELINES.md` first. If configured there, skip this opt-in prompt.

| Configuration | Behavior |
|--------------|----------|
| `E2E Tests \| Yes \| ...` | Enforce all E2E rules, skip opt-in prompt |
| `E2E Tests \| No \| ...` | Skip all E2E rules, skip opt-in prompt |
| E2E Tests not listed | Present this opt-in prompt |

## When to Enable

**Enable E2E Tests if**:
- Web or mobile application
- Multi-service workflows that need end-to-end validation
- User-facing features with critical user journeys
- Projects where user acceptance requires workflow validation

**Skip E2E Tests if**:
- Backend-only APIs without user workflows
- Libraries or SDKs
- Infrastructure-only changes
- Projects where integration tests provide sufficient coverage

## Deferred Rule Loading

**Full rules location**: `e2e-test-standards.md` (same directory)

After user opts IN:
- Load `e2e-test-standards.md` for full E2E-01 through E2E-05 rules
- Rules are enforced during Testing & Validation phase (after Regression Run, before Coverage Report)
- Blocking rules: E2E-01, E2E-02, E2E-03 (if multi-service)
- Advisory rules: E2E-04, E2E-05

After user opts OUT:
- Do NOT load `e2e-test-standards.md`
- Skip all E2E rule enforcement
- Log skip in `aidlc-docs/audit.md`
