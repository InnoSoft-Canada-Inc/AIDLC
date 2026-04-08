# Functional Design — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/construction/functional-design.md` first, then apply this override.

---

## Override: Approval Routing (Between Step 8 and Step 9)

**REPLACES** the standard "Wait for Explicit Approval" behavior at Step 9.

Before presenting the completion message to the user, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier:**
   - **Tier 1 (Verify-Agent):** Send functional design artifacts for automated validation. If APPROVED → proceed to next stage automatically without presenting completion message. If NEEDS CHANGES → fix and retry. If LOW CONFIDENCE → escalate to Tier 2.
   - **Tier 2 (Lead Agent):** Message the lead with artifacts and context. Wait for lead verdict.
   - **Tier 3 (Human):** Present the standard 2-option completion message (Request Changes / Continue to Next Stage) as defined in the base rule file.
3. **Log the routing decision** in audit.md per approval-routing.md format.

**Artifacts to send for validation:**
- `aidlc-docs/{domain}/{unit}/construction/functional-design/` (all files in directory)
- Reference: `aidlc-docs/{domain}/{unit}/inception/requirements.md`
