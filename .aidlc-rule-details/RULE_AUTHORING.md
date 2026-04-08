# AI-DLC Rule Authoring Guide

> **Purpose**: This document contains explanatory content, philosophy, best practices, and patterns for understanding and authoring AI-DLC rule files. Rule files themselves focus on enforcement instructions only.

---

## Table of Contents

1. [Workflow Philosophy](#workflow-philosophy)
2. [Session & Unit Management](#session--unit-management)
3. [Question Format Patterns](#question-format-patterns)
4. [Subagent Strategy Patterns](#subagent-strategy-patterns)
5. [Technical Guidelines Management](#technical-guidelines-management)
6. [Backlog Management System](#backlog-management-system)
7. [Depth Levels & Adaptive Execution](#depth-levels--adaptive-execution)
8. [Task Alignment Philosophy](#task-alignment-philosophy)
9. [Best Practices & Anti-Patterns](#best-practices--anti-patterns)

---

## Workflow Philosophy

### How AI-DLC Works

The AI-DLC workflow is an **adaptive execution system** — not a rigid checklist. The AI model intelligently assesses what stages are needed based on:
1. User's stated intent and clarity
2. Existing codebase state (if any)
3. Complexity and scope of change
4. Risk and impact assessment

**Key Principle**: The workflow adapts to the work, not the other way around.

### The Adaptive Workflow

Stages are conditional. Not every stage executes on every workflow:
- Simple bug fix → Lightweight Track (skip full Inception, skip Operations)
- New feature with clear requirements → May skip User Stories
- Existing design artifact → May skip Application Design

**Your Team's Role**:
- Define project-specific conventions in `extensions/project/`
- Configure compliance requirements once in TECHNICAL_GUIDELINES.md
- Override workflow recommendations when you know better

---

## Session & Unit Management

### Core Principle: Unit vs Session Independence

**Unit** = Discrete deliverable with defined scope
**Session** = AI interaction bounded by conversation start/end

**Critical distinction**:
- Units span multiple sessions (one unit may take days)
- Sessions don't span multiple units (one session = one unit focus)

### When to Update Session Summary

Update `session-summary.md` at:
- **End of session** (mandatory) — Final state before context closes
- **Mid-session natural breakpoints** (recommended) — After significant file batches, stage completions, before context reset
- **Before context reset** (critical) — If you're about to reload context, update summary first

**Why**: Session summary enables seamless resumption. If Claude Code closes right now, the next session needs enough information to continue without re-planning.

### Archive Pattern

Session summaries use **overwrite-with-archive pattern**:
1. When making significant changes, archive current version to `session-history/session-{timestamp}.md`
2. Overwrite `session-summary.md` with updated version
3. Keep current state always in `session-summary.md`, historical versions in `session-history/`

### Session Continuity Instructions

**When resuming a session**:
1. Check `aidlc-docs/aidlc-state.md` for active unit
2. Load `aidlc-docs/{domain}/{unit}/session-summary.md`
3. Read "Exact Next Step" field to resume work
4. Load any in-progress plan files mentioned in session summary
5. Continue from exactly where you left off

---

## Question Format Patterns

### Mandatory Question Format

All questions in AI-DLC MUST use multiple-choice format with A, B, C, D, E options and `[Answer]:` tag.

**Why**: Structured format enables:
- Clear option presentation
- Unambiguous answer capture
- Consistent question tracking in audit logs
- Support for batch question collection

### Good Example Pattern

```markdown
## Question: Authentication Method
Which authentication method should we use?

A) JWT tokens with refresh tokens — stateless, scalable, requires token management
B) Session-based with Redis — server-side state, easier to revoke, requires Redis
C) OAuth 2.0 with third-party provider — delegates auth, requires provider integration
D) API keys — simple, suitable for service-to-service, no user context
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**What makes this good**:
- Clear, specific question
- 4 substantive options with trade-offs described
- X) Other option for flexibility
- [Answer]: tag for response capture

### Bad Example Pattern (Don't Do This)

```markdown
How should we implement authentication?

Please describe your preferred approach.
```

**What makes this bad**:
- Open-ended question (no structured options)
- No [Answer]: tag
- No guidance on trade-offs
- Difficult to track in audit logs

### Answer Validation Workflow

1. User provides answer (e.g., "A" or "B + description")
2. AI validates answer is one of the options
3. If ambiguous (e.g., "I prefer JWT"), AI maps to closest option and confirms
4. If user provides unexpected answer, AI asks clarifying question with refined options

---

## Subagent Strategy Patterns

### Core Principle: One Task, One Subagent

Never overload a subagent with multiple disparate tasks. Spawn multiple subagents in parallel if you have independent work streams.

**Example**:
```
✅ GOOD: Spawn 3 Explore agents in parallel
- Agent 1: Search for authentication patterns
- Agent 2: Search for database connection patterns
- Agent 3: Search for error handling patterns

❌ BAD: Spawn 1 agent to do all three
- Single agent searching for auth + db + errors
  (Context bloat, slower, harder to parallelize)
```

### When to Spawn Subagents

**Triggers for spawning Explore subagent**:
- Codebase search scope uncertain
- Multiple areas need exploration simultaneously
- Need to understand existing patterns before planning
- Open-ended search that may require multiple rounds

**Triggers for spawning Plan subagent**:
- Non-trivial implementation task
- Multiple valid approaches exist
- Need to design before coding
- Architectural decisions required

**When NOT to spawn subagents**:
- Simple, directed file read (use Read tool directly)
- Single grep/glob query (use Grep/Glob directly)
- Straightforward implementation (code directly)

### Parallel Subagent Pattern

When spawning multiple subagents, use single message with multiple Task tool calls. This maximizes efficiency.

### Anti-Patterns to Avoid

1. **Serial Subagent Spawning** — Don't spawn subagents one at a time if they can run in parallel
2. **Subagent for Simple Reads** — Don't spawn subagent to read 1-2 known files (use Read directly)
3. **Overloaded Subagent** — Don't give one subagent 5 disparate tasks (spawn 5 agents)
4. **Redundant Work** — Don't spawn subagent then duplicate the same searches yourself

### MCP vs Subagent Decision Matrix

| Task | Use MCP (External Knowledge) | Use Subagent (Local Exploration) |
|------|------------------------------|----------------------------------|
| Library documentation lookup | ✅ Yes (Context7 MCP) | ❌ No |
| Current best practices | ✅ Yes (external docs) | ❌ No |
| Version-specific API reference | ✅ Yes (MCP) | ❌ No |
| Local codebase exploration | ❌ No | ✅ Yes (Explore agent) |
| Pattern detection in code | ❌ No | ✅ Yes (Explore agent) |
| Dependency mapping | ❌ No | ✅ Yes (Explore agent) |

**Rule of Thumb**: MCP for external knowledge, Subagent for local codebase work.

---

## Technical Guidelines Management

### Purpose

Technical guidelines are **project-wide immutable constraints** — not suggestions. They define:
- Framework versions (Next.js 16.1.4, React 19, etc.)
- Component preferences (shadcn/ui over alternatives)
- Coding standards (no class components, server components by default)
- Hard constraints (never use library X, always use pattern Y)

**Behavior**: AI treats these as facts. It will not suggest alternatives unless explicitly asked.

### Loading Behavior

At the start of EVERY session, AI loads technical guidelines from the path configured in `anchor-map.md`:

```markdown
## Knowledge Base Location
Path: docs/
...

## Technical Guidelines (Optional)
Path: docs/TECHNICAL_GUIDELINES.md
```

**If technical guidelines exist**: Loaded automatically, enforced throughout session
**If no technical guidelines**: AI makes technology decisions based on requirements and best practices

### Creation Mechanisms

**Method 1: Explicit Creation Trigger**
```
Using AI-DLC, create technical guidelines with NextJS v16.1.4, React 19, shadcn/ui
```

AI will:
1. Ask clarifying questions about preferences
2. Generate comprehensive TECHNICAL_GUIDELINES.md
3. Save to knowledge base location
4. Update anchor-map.md to reference the file

**Method 2: Inline Update During Session**
```
Update my technical guidelines to use NextJS 16.1.5
```

AI will:
1. Load current technical guidelines
2. Update specified versions/preferences
3. Save updated file
4. Continue session with new constraints

### File Format

Technical guidelines use markdown with specific sections:

```markdown
# Technical Guidelines

## Framework & Versions
- **Framework**: Next.js 16.1.4
- **React**: 19.x
- **TypeScript**: 5.x

## Component Standards
- **UI Library**: shadcn/ui (prefer over alternatives)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Coding Standards
- Server components by default
- Client components only when needed (use 'use client' directive)
- No class components (functional components only)

## Constraints
- Never use create-react-app (use Next.js)
- No inline styles (use Tailwind classes)
- API routes must use App Router conventions

## Compliance Requirements
| Extension | Enabled | Rationale |
|-----------|---------|-----------|
| Security Baseline | Yes | Production application |
| HIPAA | No | Does not handle PHI |
| PCI-DSS | No | Does not handle cardholder data |
| SOC 2 | No | Not pursuing certification |
```

### Update Methods

**Explicit Update** (dedicated workflow):
```
Using AI-DLC, update technical guidelines
```
- Triggers review workflow
- AI asks which sections to update
- Generates updated file
- Commits changes

**Inline Update** (during any session):
```
Update my guidelines to use React 19.1
```
- AI loads current guidelines
- Updates specified section
- Continues with updated constraints
- No workflow interruption

### Integration with Extension Configuration

Technical guidelines **include extension configuration** under `## Compliance Requirements`:

```markdown
| Extension | Enabled | Rationale |
|-----------|---------|-----------|
| Security Baseline | Yes | Production application |
| HIPAA | Yes | Handles patient health information |
```

**Benefit**: Set compliance once, enforced every session without repetitive questions.

### Error Handling

**If technical guidelines file is missing** (referenced in anchor-map.md but not found):
1. AI warns user: "Technical guidelines referenced in anchor-map.md but not found at {path}"
2. AI asks: "Should I create technical guidelines, or continue without them?"
3. User chooses: create or skip
4. AI continues with chosen approach

---

## Backlog Management System

### Two-Level Structure

AI-DLC uses a **two-level backlog system**:

1. **Master Backlog** (`aidlc-docs/aidlc-backlog.md`)
   - All units across all domains
   - Project-wide view
   - Cross-domain dependencies visible

2. **Domain Backlogs** (`aidlc-docs/{domain}/aidlc-backlog.md`)
   - Units within specific domain
   - Domain-focused view
   - Intra-domain sequencing

### Why Two Levels?

**Problem**: Flat backlog becomes unwieldy in multi-domain projects
**Solution**: Domain-specific backlogs for focus, master backlog for coordination

**Example**:
- `aidlc-docs/aidlc-backlog.md` shows AUTH-001, API-001, DB-001 (all domains)
- `aidlc-docs/auth/aidlc-backlog.md` shows AUTH-001, AUTH-002, AUTH-003 (auth domain only)

### Best Practices

1. **Unit naming convention**: `{DOMAIN}-{NUMBER}` (e.g., AUTH-001, API-005)
2. **Status tracking**: Use emojis for quick scanning (⏳ In Progress, ✅ Complete, 🔄 Blocked, ⏸ Paused)
3. **Dependency tracking**: List blocking dependencies explicitly
4. **Completion notes**: Write brief notes when marking complete (decisions for downstream units)

### Integration with Session Summaries

- **Backlog** defines what needs to be done (planning)
- **Session Summary** tracks how it's being done (execution state)
- **Backlog** updated when unit status changes (started, paused, completed)
- **Session Summary** updated during work (files touched, decisions, next step)

### Maintenance Rules

**When to update backlogs**:
- Unit starts → Mark "In Progress" in both master and domain backlogs
- Unit pauses → Mark "Paused" with pause reason
- Unit completes → Mark "Complete", write completion note, check for unblocked units
- New unit discovered → Add to both backlogs with status "Not Started"

---

## Depth Levels & Adaptive Execution

### Core Principle: Depth Follows Complexity

Not all requirements need comprehensive analysis. Not all designs need detailed diagrams. The workflow adapts depth to:
- **Request clarity** — Vague request = deeper analysis; clear request = lighter
- **Risk level** — High-risk change = deeper verification; low-risk = lighter
- **Existing knowledge** — Greenfield = deeper planning; familiar pattern = lighter

### Factors Influencing Detail Level

1. **User Request Clarity**
   - Detailed request → Minimal requirements
   - Vague request → Comprehensive requirements

2. **Risk & Impact**
   - New integration → Full design
   - Internal refactor → Light design

3. **Existing Artifacts**
   - Design doc exists → Skip application design
   - No prior planning → Full inception

### Examples

**Minimal Depth** (simple, clear request):
- Requirements: Intent analysis document only (1-2 pages)
- Design: Brief component sketch
- Documentation: One-paragraph feature note

**Standard Depth** (normal complexity):
- Requirements: Functional + non-functional requirements (3-5 pages)
- Design: Component diagrams + method signatures
- Documentation: Full 12-section feature doc

**Comprehensive Depth** (complex, high-risk):
- Requirements: Detailed traceability matrix, constraint analysis (10+ pages)
- Design: Detailed sequence diagrams, state machines, data flow
- Documentation: Full feature doc + impact scan + cross-doc updates

---

## Task Alignment Philosophy

### Purpose: Preventing Scope Creep

Task alignment ensures the AI stays focused on the user's **original request** throughout a multi-turn workflow. Without alignment checks, the AI may drift toward:
- Solving a different problem than requested
- Adding features beyond scope
- Over-engineering the solution

### Common Drift Patterns

1. **Feature Creep** — User asks for login, AI designs full OAuth + SSO + RBAC system
2. **Technology Shift** — User asks to improve performance, AI redesigns entire architecture
3. **Scope Expansion** — User asks for bug fix, AI refactors entire module

### Why This Matters

**Without alignment verification**:
- User wastes time reviewing work they didn't ask for
- AI wastes compute on out-of-scope work
- Trust in the system erodes

**With alignment verification**:
- User maintains control over scope
- AI course-corrects when drift detected
- Scope changes are explicit and approved

### Alignment Check Format

At each phase transition, AI verifies alignment:

```markdown
**Alignment Check**: ✅ Aligned | ⚠️ Partial | ❌ Misaligned
**Original Request**: Add JWT authentication to login endpoint
**Current Direction**: Designing JWT authentication with refresh tokens and token rotation

**Assessment**: ✅ Aligned — Current work directly addresses original request
```

If ⚠️ Partial or ❌ Misaligned:
1. AI flags the drift to user
2. AI presents options: realign to original request, approve scope change, or pause
3. User decides next steps
4. If scope change approved, log it in session summary under "Scope Changes"

---

## Best Practices & Anti-Patterns

### Best Practices

1. **Load selectively** — Don't load rule files until you need them (lazy-loading)
2. **Update summaries often** — Don't wait until end of session (mid-session updates)
3. **Verify alignment early** — Check at phase transitions, not just at end
4. **Archive before major changes** — Preserve history when making significant updates
5. **Write completion notes** — Brief notes for downstream units when marking complete

### Anti-Patterns to Avoid

1. **Loading all rules at start** — Wastes context (lazy-load instead)
2. **Waiting until end to update summary** — Risky if session crashes (update at breakpoints)
3. **Skipping alignment checks** — Leads to scope creep (verify at transitions)
4. **Overwriting summaries without archive** — Loses history (archive first)
5. **Marking units complete without notes** — Downstream units lack context (always write notes)

---

## Rule File Best Practices

### What Belongs in Rule Files

- **Enforcement instructions** — MUST do X, SHOULD do Y
- **Verification criteria** — How to verify compliance
- **Blocking conditions** — When to block stage completion
- **Stage-specific steps** — Concrete actions to execute
- **Approval messages** — Exact completion message format

### What Belongs in RULE_AUTHORING.md (This File)

- **Philosophy** — Why the workflow works this way
- **Patterns** — Good/bad examples of rule application
- **Best practices** — Learnings from rule enforcement
- **Context** — Background on design decisions
- **Integration guidance** — How rules interact with each other

### Writing Clear Rules

**Good rule** (concrete, actionable):
```markdown
## Step 3: Generate Requirements Document
1. Load reverse engineering artifacts (if brownfield)
2. Create `requirements.md` with sections: Functional Requirements, Non-Functional Requirements, Constraints
3. Write 3-5 functional requirements addressing user request
4. Include at least 1 non-functional requirement (performance, security, or scalability)
```

**Bad rule** (vague, philosophical):
```markdown
## Step 3: Think About Requirements
Consider what the user needs. Think about both what the system should do and how it should do it. Be thoughtful about constraints.
```

---

*This guide consolidates explanatory content from all AI-DLC rule files. For enforcement instructions, see the individual rule files in `.aidlc-rule-details/`.*
