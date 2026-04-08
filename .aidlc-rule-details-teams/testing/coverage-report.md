# Coverage Report — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/testing/coverage-report.md` first, then apply this override.

---

## Override: Approval Routing

**REPLACES** the standard "Wait for Explicit Approval" behavior.

Before presenting the coverage report for sign-off, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to Documentation phase automatically
4. If Tier 3 → present coverage report with untested paths for human sign-off

**Artifacts to send for validation:**
- Coverage report with untested code paths and risk notes
- Requirement-test mapping
- Reference: requirements.md, functional design, code generation plan
