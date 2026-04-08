# Integration Tests — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/testing/integration-test-scenarios.md` first, then apply this override.

---

## Override: Approval Routing

**REPLACES** the standard "Wait for Explicit Approval" behavior.

Before presenting the integration test plan for approval, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to next stage automatically
4. If Tier 3 → present the standard approval message

**Artifacts to send for validation:**
- Integration test plan and generated tests
- Cross-domain touch points identified
- Reference: functional design, API contracts, code generation artifacts

---

## Override: Scope for Teammates

Teammates run **unit-scoped** integration tests only — testing the boundaries of their unit against its direct dependencies. The lead runs **cross-unit** integration tests after all teammates complete.
