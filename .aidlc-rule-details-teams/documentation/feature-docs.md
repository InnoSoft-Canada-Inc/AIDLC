# Feature Documentation — Team Override (Addendum)

> **This is an addendum, not a replacement.** Load the full stage rules from
> `.aidlc-rule-details/documentation/feature-docs.md` first, then apply this override.

---

## Override: Approval Routing

**REPLACES** the standard "Wait for Explicit Approval" behavior.

Before presenting the feature documentation for review, follow the approval routing
process defined in `common/approval-routing.md`:

1. **Check approval tier** for this unit in `aidlc-docs/aidlc-state.md`
2. **Route to the appropriate tier** (see approval-routing.md for full flow)
3. If Tier 1 or 2 approves → proceed to next Documentation stage automatically
4. If Tier 3 → present feature doc for human review

**Artifacts to send for validation:**
- `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`
- Reference: requirements.md, functional design, code generation artifacts

---

## Override: Teammate Completion Behavior

After the teammate completes ALL Documentation stages (Feature Doc through Recreation Readiness Check):

1. **Message the lead**: "Unit {UNIT-ID} complete. All phases done. Branch `feature/{UNIT-ID}` ready for merge."
2. **Mark task as complete** in the shared task list
3. **Update session-summary.md** with final status
4. **Update domain backlog**: Mark unit as ✅ Complete
5. **Do NOT** run cross-unit documentation (Impact Scan, Cross-Doc Update, Consistency Check across units) — the lead handles this after all teammates complete
