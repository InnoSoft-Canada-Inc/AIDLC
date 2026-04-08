# Question Format Guide

> **For patterns, examples, and best practices**, see [RULE_AUTHORING.md § Question Format Patterns](/.aidlc-rule-details/RULE_AUTHORING.md#question-format-patterns)

---

## MANDATORY: Question File Requirements

### Rule 1: Never Ask Questions in Chat
**CRITICAL**: ALL questions MUST be placed in dedicated question files. Never ask questions directly in chat.

### Rule 2: File Naming Convention
Use descriptive names: `{phase-name}-questions.md`

Examples: `classification-questions.md`, `requirements-questions.md`, `story-planning-questions.md`

### Rule 3: Question Structure (MANDATORY FORMAT)

```markdown
## Question [Number]
[Clear, specific question text]

> **Recommended: Option [X]** — [one-sentence rationale referencing anchor docs, established architecture, or best practices where applicable]

A) [First meaningful option]
B) [Second meaningful option] [Recommended]
[...additional options as needed...]
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**CRITICAL REQUIREMENTS**:
- "Other" is MANDATORY as the LAST option for EVERY question
- Only include meaningful options (don't make up options to fill slots)
- Minimum: 2 meaningful options + Other
- Maximum: 5 meaningful options + Other
- Use [Answer]: tag for response capture
- **MANDATORY**: Include explicit recommendation with rationale (see Rule 4)

### Rule 4: Recommendation Format (MANDATORY)

**For ALL multiple-choice questions, you MUST provide an explicit recommendation.**

**Format**:
```markdown
> **Recommended: Option [X]** — [one-sentence rationale]

A) [option]
B) [option] [Recommended]
C) [option]
X) Other
```

**Rationale Guidelines**:
- Reference anchor docs or planning documents when available
- Reference established architecture patterns in brownfield projects
- Reference framework best practices or industry standards
- Be specific and actionable (not generic)
- Keep it one sentence (concise)

**Examples of Good Rationales**:
- "Architecture doc specifies PostgreSQL for all data persistence"
- "Existing services use JWT tokens for authentication"
- "shadcn/ui is specified in TECHNICAL_GUIDELINES.md"
- "RESTful API pattern matches existing endpoints"

**Examples of Poor Rationales**:
- "This is best practice" (too generic)
- "I think this is better" (not specific)
- "Usually works well" (vague)

**Developer Override**:
Always explicitly state that the developer may override any recommendation. The recommendation accelerates decision-making but doesn't restrict choice.

---

## Option Quality Requirements

Options MUST be:
- Mutually exclusive
- Specific and clear
- Realistic and actionable
- Meaningful (only include if genuinely useful)

❌ **Do NOT**:
- Make up options just to fill A, B, C, D slots
- Include Yes/No/Maybe as database choices
- Create options that don't match the question type

---

## User Response Format

Users answer by filling in letter choice after [Answer]: tag:

```markdown
## Question 1
What is the primary user authentication method?

> **Recommended: Option C** — Architecture doc specifies enterprise SSO for all services

A) Username and password
B) Social media login (Google, Facebook)
C) Single Sign-On (SSO) [Recommended]
D) Multi-factor authentication
X) Other (please describe after [Answer]: tag below)

[Answer]: C
```

---

## Workflow Integration

### Step 1: Create Question File
Create `aidlc-docs/{phase-name}-questions.md` with all questions

### Step 2: Inform User
"I've created {phase-name}-questions.md with [X] questions. Please answer each question by filling in the letter choice after the [Answer]: tag. If none of the options match your needs, choose the last option (Other) and describe your preference. Let me know when you're done."

### Step 3: Wait for Confirmation
Wait for user to say "done", "completed", "finished", or similar

### Step 4: Read and Analyze
1. Read `aidlc-docs/{phase-name}-questions.md`
2. Extract all answers
3. Validate completeness
4. Proceed with analysis

---

## Error Handling (MANDATORY CHECKS)

### Missing Answers
If any [Answer]: tag is empty:
```
"I noticed Question [X] is not answered. Please provide an answer using one of the letter choices for all questions before proceeding."
```

### Invalid Answers
If answer is not a valid letter choice:
```
"Question [X] has an invalid answer '[answer]'. Please use only the letter choices provided in the question."
```

### Ambiguous Answers
If user provides explanation instead of letter:
```
"For Question [X], please provide the letter choice that best matches your answer. If none match, choose 'Other' and add your description after the [Answer]: tag."
```

---

## MANDATORY: Contradiction and Ambiguity Detection

After reading user responses, you MUST check for contradictions and ambiguities.

### Detecting Contradictions
Look for logically inconsistent answers:
- Scope mismatch: "Bug fix" but "Entire codebase affected"
- Risk mismatch: "Low risk" but "Breaking changes"
- Timeline mismatch: "Quick fix" but "Multiple subsystems"
- Impact mismatch: "Single component" but "Significant architecture changes"

### Detecting Ambiguities
Look for unclear or borderline responses:
- Answers that could fit multiple classifications
- Responses that lack specificity
- Conflicting indicators across multiple questions

### Creating Clarification Questions

If contradictions or ambiguities detected:

1. **Create clarification file**: `{phase-name}-clarification-questions.md`
2. **Explain the issue**: Clearly state detected contradiction/ambiguity
3. **Ask targeted questions**: Use multiple choice format to resolve
4. **Reference original questions**: Show which questions had conflicting answers

**Format**:
```markdown
# [Phase Name] Clarification Questions

I detected contradictions in your responses that need clarification:

## Contradiction 1: [Brief Description]
You indicated "[Answer A]" (Q[X]:[Letter]) but also "[Answer B]" (Q[Y]:[Letter]).
These responses are contradictory because [explanation].

### Clarification Question 1
[Specific question to resolve contradiction]

> **Recommended: Option [X]** — [rationale based on other answers or context]

A) [Option that resolves toward first answer]
B) [Option that resolves toward second answer]
C) [Option that provides middle ground] [Recommended]
D) [Option that reframes the question]
X) Other (please describe after [Answer]: tag below)

[Answer]:

## Ambiguity 1: [Brief Description]
Your response to Q[X] ("[Answer]") is ambiguous because [explanation].

### Clarification Question 2
[Specific question to clarify ambiguity]

> **Recommended: Option [X]** — [rationale based on context]

A) [Clear option 1]
B) [Clear option 2] [Recommended]
C) [Clear option 3]
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

### Clarification Workflow (MANDATORY)

1. **Detect**: Analyze all responses for contradictions/ambiguities
2. **Create**: Generate clarification question file if issues found
3. **Inform**: Tell user about issues and clarification file location
4. **Wait**: Do NOT proceed until user provides clarifications
5. **Re-validate**: After clarifications, check again for consistency
6. **Proceed**: Only move forward when all contradictions resolved

**Example User Message**:
```
"I detected 2 contradictions in your responses:

1. Bug fix scope vs. codebase impact (Q1 vs Q2)
2. Low risk vs. breaking changes (Q7 vs Q4)

I've created classification-clarification-questions.md with 2 questions to resolve these. Please answer these clarifying questions before I can proceed with classification."
```

---

## Summary Checklist

**MUST DO**:
- ✅ Always create question files (never ask in chat)
- ✅ Always use multiple choice format
- ✅ Always include "Other" as LAST option (MANDATORY)
- ✅ Always include explicit recommendation with rationale (MANDATORY)
- ✅ Only include meaningful options (no filler)
- ✅ Always use [Answer]: tags
- ✅ Always wait for user completion
- ✅ Always validate responses for contradictions
- ✅ Always create clarification files if needed
- ✅ Always resolve contradictions before proceeding

**MUST NOT DO**:
- ❌ Never ask questions in chat
- ❌ Never make up options just to have A, B, C, D
- ❌ Never proceed without answers
- ❌ Never proceed with unresolved contradictions
- ❌ Never make assumptions about ambiguous responses
