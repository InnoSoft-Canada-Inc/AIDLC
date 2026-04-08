# Regression Run — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/testing/regression.md` first, then apply this override.

---

## Override: Approval Routing

**REPLACES** the standard "Wait for Explicit Approval" behavior.

Before presenting regression findings for approval, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to next stage automatically
4. If Tier 3 → present findings with clear categorization for human review

**Artifacts to send for validation:**
- Regression test results (pass/fail summary)
- Failure categorization (legitimate regression vs test needs updating)
- Reference: code generation artifacts, prior test baselines
