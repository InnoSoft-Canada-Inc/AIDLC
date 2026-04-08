# Build and Test — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/construction/build-and-test.md` first, then apply this override.

---

## Override: Approval Routing

**REPLACES** the standard "Wait for Explicit Approval" behavior.

Before presenting the completion message to the user, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to next stage automatically
4. If Tier 3 → present the standard 2-option completion message

**Artifacts to send for validation:**
- Build and test instruction files (build-instructions.md, unit-test-instructions.md, etc.)
- Test results (if tests were executed)
- Reference: code generation artifacts, functional design

---

## Override: Path Selection for Teammates

**IMPORTANT**: Teammates always use the **unit-specific path**:
```
aidlc-docs/{domain}/{unit}/construction/build-and-test/
```

The `_shared/build-and-test/` path is used ONLY by the **lead** for cross-unit integration testing after all teammates complete.
