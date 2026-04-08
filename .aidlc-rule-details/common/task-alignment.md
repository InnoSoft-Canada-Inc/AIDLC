# Task Alignment Verification

## Purpose

**Ensure continuous alignment between work being performed and the user's original request.**

Task Alignment Verification prevents:
- Scope drift (gradually moving away from original intent)
- Misaligned deliverables (building something different than requested)
- Wasted effort (significant work before detecting misalignment)
- Silent deviation (changes without user awareness or approval)

---

## Original Request Capture

### When to Capture

Capture the original request during **Requirements Analysis** (Step 1 of that stage).

### What to Capture

Store in `aidlc-docs/aidlc-state.md` under `## Original Request`:

```markdown
## Original Request

**Captured**: {ISO timestamp}
**Verbatim Request**:
> {User's exact original request text, preserved verbatim}

**Request Summary**: {One-sentence summary of core intent}
```

### Immutability Rule

The Original Request section is **immutable** once captured. It serves as the fixed anchor against which all work is measured. Scope changes are documented separately (see Scope Changes below).

---

## Alignment Checkpoints

### When to Check

Perform alignment verification at:

1. **Phase Transitions** — When moving between Inception → Construction → Operations → Testing → Documentation
2. **Unit Completion** — Before marking any unit as complete
3. **Major Decision Points** — When making architectural or design choices

### Alignment Check Process

At each checkpoint:

1. **Re-read** the Original Request from aidlc-state.md
2. **Summarize** the current direction/deliverable in one sentence
3. **Compare** and assess alignment
4. **Document** the result

### Alignment Check Format

```markdown
## Alignment Check: {Phase/Stage Name}

**Timestamp**: {ISO timestamp}
**Original Request**: {verbatim or summary}
**Current Direction**: {one-sentence description of what's being built/delivered}
**Alignment Status**: ✅ Aligned | ⚠️ Partial | ❌ Misaligned

{If not fully aligned}
**Deviation Description**: {What differs from original request}
**User Decision Required**: Yes/No
```

---

## Alignment Statuses

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ **Aligned** | Work directly addresses original request | Proceed normally |
| ⚠️ **Partial** | Work addresses part of request, or includes extras | Note deviation, may proceed if acceptable |
| ❌ **Misaligned** | Work doesn't address original request | STOP — require user decision |

---

## Handling Drift

### When Drift Is Detected

If alignment check reveals ⚠️ Partial or ❌ Misaligned status:

```markdown
**Alignment Drift Detected**

**Original Request**: {verbatim}
**Current Direction**: {what's being built}
**Deviation**: {specific difference}

This work appears to have drifted from the original request.

**Options**:
A) Realign — Adjust current work to match original request
B) Approve Scope Change — Continue with new direction (will be documented)
C) Pause — Discuss alignment before proceeding

[Answer]:
```

### Documenting Scope Changes

If user approves a scope change, document in session summary:

```markdown
## Scope Changes

### Change 1
**Approved**: {ISO timestamp}
**Original Scope**: {what was originally requested}
**New Scope**: {what is now being built}
**Reason**: {why the change was approved}
**User Response**: "{verbatim user approval}"
```

---

## Exit Condition Integration

### Unit Completion Requirement

Before marking any unit complete, verify:

1. **Deliverable addresses original request** (or approved scope change)
2. **No unacknowledged drift** exists
3. **Alignment summary** is documented

### Alignment Summary at Completion

Include in unit completion message:

```markdown
**Alignment Summary**
- **Original Request**: {brief summary}
- **Delivered**: {what was actually built}
- **Alignment**: ✅ Fully aligned | ⚠️ Partial (approved) | ❌ Not aligned
```

---

## Track-Specific Depth

| Track | Alignment Check Depth |
|-------|----------------------|
| **Full** | Full alignment check at every phase transition + unit completion |
| **Lightweight** | Brief alignment check at Construction start + unit completion |
| **Hotfix** | Single alignment verification at completion only |

---

## Integration with Other Rules

### Session Summary
- Alignment checks are logged in session summary under "Decisions Made" or new "Alignment Checks" section
- Scope changes documented in session summary

### Audit Log
- All alignment checks logged with timestamp
- User decisions on drift logged with complete response

### Exit Conditions
- Alignment verification is now a required exit condition
- See `common/exit-conditions.md`

### Overconfidence Prevention
- Alignment checking complements overconfidence prevention
- Both ensure work matches user intent

---

## Best Practices

1. **Check early, check often**: Catching drift early is cheaper than catching it late
2. **Preserve verbatim text**: Original request should be exact user words, not paraphrased
3. **User decides on drift**: The user always has final say on whether drift is acceptable
4. **Document everything**: Scope changes must be documented, not assumed
5. **Be specific about deviation**: "Slightly different" is not actionable; "Added feature X not in original request" is

---

## Common Drift Patterns

| Pattern | Example | How to Handle |
|---------|---------|---------------|
| **Scope creep** | User asked for A, we're building A + B + C | Ask: "Should we include B and C?" |
| **Feature substitution** | User asked for A, we're building B instead | STOP: Requires explicit approval |
| **Partial delivery** | User asked for A + B, we're only building A | Note: Document what's deferred |
| **Interpretation drift** | "Make it faster" interpreted as "rewrite everything" | Clarify scope before proceeding |

---

## Why This Matters

Without alignment verification:
- Work can drift significantly before anyone notices
- User receives something different than they requested
- Time and effort wasted on wrong deliverables
- Trust erodes when deliverables don't match expectations

With alignment verification:
- Drift caught early when correction is cheap
- User stays informed of direction changes
- Deliverables match (or deliberately exceed) expectations
- Clear audit trail of what was requested vs. delivered
