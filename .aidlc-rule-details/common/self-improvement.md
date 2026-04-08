# Self-Improvement Loop

## Purpose

Capture lessons from corrections to prevent repeated mistakes and enable continuous improvement across sessions.

---

## Core Principle

**After ANY correction from the user during a session, the AI must:**
1. Identify what went wrong
2. Determine root cause
3. Write a prevention rule
4. Append to `aidlc-docs/lessons.md`

This is NOT optional. Corrections are valuable feedback that must be captured.

---

## Trigger Conditions

The self-improvement loop activates when the user:
- Explicitly corrects the AI's output ("That's wrong", "No, I meant...")
- Rejects a proposed approach ("Don't do it that way")
- Points out a mistake or oversight
- Provides clarification that reveals a prior misunderstanding
- Expresses frustration with repeated behavior
- **Explicitly requests lesson capture** ("Add to lessons...", "Remember this for next time...", "Make this a lesson...")

---

## lessons.md File Structure

Location: `aidlc-docs/lessons.md`

**CRITICAL**: Keep lessons MINIMAL - only the actionable rule. Context bloat wastes tokens.

```markdown
# Project Lessons Learned

**Purpose**: Actionable rules to prevent repeated mistakes.

**Format**: Each lesson contains ONLY the prevention rule - no backstory, no root cause analysis, no user feedback quotes. Just the rule.

---

## Lessons

### LESSON-001
**Domain**: [domain or "all"]
**Stage**: [stage or "all"]
**Rule**: [Specific, actionable prevention rule - be concise]

---

### LESSON-002
**Domain**: [domain or "all"]
**Stage**: [stage or "all"]
**Rule**: [Specific, actionable prevention rule - be concise]

---
```

**Key Principles**:
- **One rule per lesson** - just the "MUST do X" statement
- **No backstory** - don't include what went wrong, why it happened, user feedback, etc.
- **Concise** - 1-3 sentences maximum per rule
- **Actionable** - must be directly applicable (not philosophical)

---

## Lesson Capture Process

When a correction occurs:

### Step 1: Distill the Rule
Extract the actionable prevention rule:
- Be specific (not "be more careful")
- Include trigger conditions ("When X, always Y")
- Make it verifiable
- **Keep it to 1-3 sentences maximum**

### Step 2: Append to lessons.md
Add the new lesson with:
- Unique LESSON-XXX ID (incrementing)
- Domain scope (specific domain or "all")
- Stage scope (specific stage or "all")
- The prevention rule (ONLY the rule, nothing else)

---

## Session Start: Lesson Review

**MANDATORY**: At the start of EVERY session (during Workspace Detection Step 0.6), load the ENTIRE `aidlc-docs/lessons.md` file into context.

**Why load all lessons**:
- Lessons are now minimal (just the rules)
- Token cost is low (no verbose backstory)
- Having all rules in context prevents mistakes across all domains/stages
- AI can apply relevant rules throughout the session

**No filtering needed** - load the entire file. The simplified format makes this feasible.

---

## Recurrence Tracking

If the SAME mistake pattern occurs again:
1. Update the existing lesson rule to be more specific/stronger
2. Do NOT create duplicate lessons for the same pattern
3. If a rule keeps being violated, make it more explicit with MUST/NEVER language

**Red flag**: If the same mistake happens 3+ times, the rule needs to be promoted to an extension or CLAUDE.md update.

---

## Periodic Review

**Every 5 units completed**, conduct a lessons review:

1. **Pattern Analysis**: Look for clusters of similar lessons
   - Are there common root causes?
   - Can multiple lessons be consolidated?

2. **Effectiveness Check**: Review recurrence counts
   - Which prevention rules are working (count = 0)?
   - Which need strengthening (count > 0)?

3. **Promotion Consideration**: High-impact lessons should be:
   - Added to domain-specific documentation
   - Considered for inclusion in extension rules
   - Flagged for potential CLAUDE.md updates

---

## Example Lessons

### Example 1: Assumption Without Asking
```markdown
### LESSON-003
**Domain**: all
**Stage**: Requirements Analysis
**Rule**: When user mentions "API" without specifying type, ALWAYS ask: "Do you want REST, GraphQL, gRPC, or something else?"
```

### Example 2: Skipped Validation
```markdown
### LESSON-004
**Domain**: all
**Stage**: Code Generation
**Rule**: Before generating import statements, verify the target module/file exists in the codebase.
```

### Example 3: Wrong Pattern Applied
```markdown
### LESSON-005
**Domain**: all
**Stage**: Functional Design
**Rule**: Before proposing architectural patterns, grep codebase for existing patterns and match them.
```

---

## Integration with Audit Trail

Lessons are SEPARATE from audit.md:
- **audit.md**: Complete interaction log (all prompts/responses)
- **lessons.md**: Distilled learnings from corrections only

When logging a correction in audit.md, add a reference:
```markdown
**Context**: User correction captured. See LESSON-XXX in lessons.md.
```

---

## MANDATORY Rules Summary

1. **ALWAYS** capture corrections in lessons.md (no exceptions)
2. **ALWAYS** load ENTIRE lessons.md at session start (Step 0.6 of Workspace Detection)
3. **ALWAYS** keep lessons minimal - just domain, stage, and the actionable rule (no backstory)
4. **ALWAYS** update existing lesson if same mistake recurs (don't create duplicates)
5. **EVERY 5 UNITS** conduct periodic lessons review to consolidate and promote high-impact rules
