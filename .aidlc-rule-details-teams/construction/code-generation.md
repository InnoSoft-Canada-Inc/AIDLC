# Code Generation — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/construction/code-generation.md` first, then apply this override.

---

## Override: Approval Routing — Plan Approval (Between Step 6 and Step 7)

**REPLACES** the standard "Wait for Explicit Approval" behavior at Step 7 (plan approval).

Before presenting the code generation plan for user approval, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to Part 2 (Generation) automatically
4. If Tier 3 → present the standard plan approval message

**Artifacts to send for validation:**
- Code generation plan with checkboxes
- Reference: functional design artifacts, requirements.md

---

## Override: Approval Routing — Code Approval (Between Step 14 and Step 15)

**REPLACES** the standard "Wait for Explicit Approval" behavior at Step 15 (code approval).

Before presenting the completion message to the user, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to next stage automatically
4. If Tier 3 → present the standard 2-option completion message

**Artifacts to send for validation:**
- Generated code files (list paths)
- Generated test files (list paths)
- Reference: code generation plan, functional design, requirements.md
