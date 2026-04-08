# Requirements Analysis (Adaptive)

**Assume the role** of a product owner

**Adaptive Phase**: Always executes. Detail level adapts to problem complexity.

**See [depth-levels.md](../common/depth-levels.md) for adaptive depth explanation**

## Prerequisites
- Workspace Detection must be complete
- Reverse Engineering must be complete (if brownfield)
- Anchor map loaded (if project initialized) to enable planning doc extraction

## Execution Steps

**Flow Overview**:
- Step 1: Load domain anchor doc (architectural constraints)
- Step 1.4: Load technical guidelines (framework/tech stack constraints)
- Step 1.5: Load design guidelines (visual/behavioral constraints)
- **Step 1.6**: Extract requirements from planning docs (NEW - brownfield optimization)
- Step 2: Load reverse engineering context (if brownfield)
- Step 3+: Analyze user request, determine depth, assess requirements, generate questions

**Key Optimization**: If comprehensive requirements are found in planning docs (Step 1.6), Requirements Analysis can be skipped entirely or abbreviated to targeted questions only.

---

### Step 1: Load Project Anchor Doc (Addition to Workflow)

**Purpose**: Load architectural constraints from project planning documents BEFORE generating any clarification questions.

#### 1.1 Check Anchor Map

Load `aidlc-docs/anchor-map.md` to find the primary anchor doc for the active domain:

```markdown
## Domain Anchors
| Domain | Primary Anchor Doc | Description |
|--------|-------------------|-------------|
| {domain} | {path/to/doc.md} | {brief description} |
```

#### 1.2 Load Domain Anchor Doc

If an anchor doc is mapped for the active domain:
- Load the specified document
- Parse all architectural decisions, patterns, and constraints
- **Treat these as immutable constraints** — do NOT re-derive or re-question decisions already made

#### 1.3 Constraint Recognition

When the anchor doc specifies:
- A database choice → do not ask about database selection
- An API pattern → do not propose alternatives
- A folder structure → follow it without question
- A technology stack → use it as given

**Record loaded constraints:**
```markdown
## Anchor Doc Constraints Loaded
- **Source**: {anchor doc path}
- **Key Constraints**:
  - {constraint 1}
  - {constraint 2}
  - ...
```

**If no anchor doc exists**: Skip this step and proceed normally.

---

#### 1.4 Load Technical Guidelines

**Purpose**: Load project-wide technical constraints from TECHNICAL_GUIDELINES.md (if configured).

Load `aidlc-docs/anchor-map.md` to find the technical guidelines path:

```markdown
## Project-Wide Guidelines

- **Technical Guidelines**: {path/to/TECHNICAL_GUIDELINES.md}
- **Last Updated**: {timestamp}
```

If technical guidelines exist:
- Load the specified document
- Parse all technical constraints (frameworks, versions, coding standards)
- **Treat these as immutable constraints** — do NOT suggest alternatives

**Record loaded technical constraints:**
```markdown
## Technical Guidelines Loaded
- **Source**: {technical guidelines path}
- **Key Constraints**:
  - Framework: {framework and version}
  - Language: {language and version}
  - Component Library: {library}
  - Coding Standards: {standards}
  - ...
```

**If no technical guidelines exist**: Skip this step and proceed normally.

---

#### 1.5 Load Design Guidelines

**Purpose**: Load project-wide visual and behavioral constraints from DESIGN_GUIDELINES.md (if configured).

Load `aidlc-docs/anchor-map.md` to find the design guidelines path:

```markdown
## Project-Wide Guidelines

- **Technical Guidelines**: {path/to/TECHNICAL_GUIDELINES.md}
- **Design Guidelines**: {path/to/DESIGN_GUIDELINES.md}
- **Last Updated**: {timestamp}
```

If design guidelines exist:
- Load the specified document
- Parse all design constraints (colors, typography, spacing, animations, responsive strategy)
- **Treat these as immutable visual/behavioral constraints** — do NOT suggest alternatives

**Record loaded design constraints:**
```markdown
## Design Guidelines Loaded
- **Source**: {design guidelines path}
- **Key Constraints**:
  - Design System: {system or None}
  - Component Library: {library}
  - Colors: {primary, secondary, etc.}
  - Typography: {font family, scale}
  - Spacing: {base unit, scale}
  - Animations: {durations, easing}
  - Breakpoints: {mobile, tablet, desktop}
  - ...
```

**If no design guidelines exist**: Skip this step and proceed normally.

**Note**: Design guidelines are project-specific visual/behavioral standards, distinct from UI Baseline (universal accessibility + security rules).

---

### Step 1.6: Extract Requirements from Planning Docs (NEW - Brownfield Optimization)

**Purpose**: If planning docs exist in knowledge base, extract requirements from them BEFORE asking clarification questions, avoiding redundant re-planning.

**ONLY execute this step if**:
- `aidlc-docs/anchor-map.md` exists (project initialized)
- Knowledge Base Location is configured in anchor-map.md
- Planning docs exist at that location

**Skip if**:
- No anchor-map.md (project not initialized)
- Knowledge base location is "none"
- Greenfield project with no planning docs

#### 1.5.1 Load Knowledge Base Documents

From `aidlc-docs/anchor-map.md`, read:
- Knowledge Base Location path
- Domain-specific anchor docs for active domain
- Additional planning docs listed in Planning Documents section

Load the following files if they exist:

1. **Domain anchor doc** (from Domain Anchor Map table)
2. **Project overview docs** (common names):
   - `{kb}/overview.md`, `{kb}/README.md`, `{kb}/project-overview.md`
   - `{kb}/*-overview.md`, `{kb}/*-architecture.md`
3. **Requirements docs** (if exist):
   - `{kb}/requirements.md`, `{kb}/specifications.md`
   - `{kb}/*-requirements.md`, `{kb}/*-spec.md`
4. **Implementation guides** (if exist):
   - `{kb}/implementation-guide.md`, `{kb}/roadmap.md`
   - `{kb}/*-implementation.md`, `{kb}/*-milestones.md`

#### 1.5.2 Extract Requirements from Planning Docs

Scan loaded planning docs for requirement indicators:

**Functional Requirements** (look for):
- Section headers: "Requirements", "Features", "Functionality", "User Stories", "Use Cases"
- Bullet lists describing what the system should do
- Acceptance criteria patterns: "Given/When/Then", "The system shall", "Users can"
- Feature descriptions with inputs/outputs/behaviors

**Non-Functional Requirements** (look for):
- "Performance", "Scalability", "Security", "Reliability", "Maintainability"
- Specific metrics: response times, throughput, uptime, load capacity
- Technology constraints: frameworks, databases, cloud providers
- Compliance requirements: HIPAA, SOC2, PCI-DSS, GDPR

**Migration Goals** (for v1 → v2 projects, look for):
- "Migrate from", "Replace", "Upgrade from", "Move from"
- Side-by-side comparisons (v1 vs v2 architecture)
- Migration phases, milestones, rollout strategy
- Code reduction targets (e.g., "reduce from 100K LOC to 31K LOC")

**Decisions and Constraints** (look for):
- "Architecture Decision", "Technical Decision", "We chose"
- Rationale sections explaining "why" choices were made
- Trade-offs accepted (performance vs simplicity, etc.)
- Hard constraints that cannot be changed

#### 1.5.3 Categorize Extracted Requirements

Organize extracted requirements by completeness:

| Category | Criteria | Examples |
|----------|----------|----------|
| **Comprehensive** | Detailed, specific, measurable | "API response time < 200ms for 95th percentile", "Support 10K concurrent users" |
| **Well-Defined** | Clear intent, some specifics | "Implement JWT-based authentication", "Use PostgreSQL for persistence" |
| **High-Level** | General direction, needs detail | "Improve performance", "Add caching", "Support multi-tenancy" |
| **Implicit** | Inferred from architecture | Domain structure implies bounded contexts, Tech stack implies deployment patterns |

#### 1.5.4 Present Extracted Requirements for Validation

**If comprehensive requirements were extracted**, present to user:

```markdown
**Requirements Extracted from Planning Docs**

I found {count} planning documents in your knowledge base (`{kb_path}`) with comprehensive requirements:

## Functional Requirements (from {source_doc})
- Migrate from LangGraph (v1) to Strands SDK (v2)
- Implement dynamic sub-agents as primary pattern
- Support three-tier RAG architecture
- Reduce codebase from 100K → 31-34K LOC (69% reduction)

## Non-Functional Requirements (from {source_doc})
- **Performance**: API response time < 200ms for 95th percentile
- **Scalability**: Support 10K concurrent users
- **Database**: PostgreSQL 18 with pgvector for embeddings
- **Security**: JWT authentication, row-level security (RLS)

## Architecture Decisions (from {source_doc})
- Use FastAPI for async-first backend
- SQLAlchemy 2.0 with async session management
- Alembic for database migrations
- Seven-phase migration strategy (16-20 weeks)

## Coverage Assessment
- **Functional Requirements**: ✅ Comprehensive (detailed feature specs in 27 planning docs)
- **Non-Functional Requirements**: ✅ Well-Defined (performance targets, security strategy, scalability goals)
- **Technical Stack**: ✅ Fully Specified (Python 3.12+, FastAPI, PostgreSQL 18, Strands SDK)
- **Migration Strategy**: ✅ Documented (7 phases, 16-20 weeks, 9 milestones)

**These requirements are comprehensive. Do you need me to:**

A) Use these requirements as-is (Recommended - skip Requirements Analysis stage, proceed to Workflow Planning)
B) Expand on specific areas (I'll ask targeted clarifying questions for gaps only)
C) Re-analyze from scratch (Not recommended - duplicates existing planning work)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling**:

| Answer | Behavior |
|--------|----------|
| **A) Use as-is** | Skip Steps 3-9 (requirement gathering), mark Requirements Analysis as "COMPLETED (Extracted from planning docs)", proceed to Workflow Planning |
| **B) Expand specific areas** | Skip to Step 6 (Completeness Analysis), ask ONLY targeted questions for identified gaps |
| **C) Re-analyze** | Warn about duplication, proceed with normal Requirements Analysis flow |
| **X) Other** | Clarify user intent |

**If only partial requirements extracted**, present summary and ask which areas need clarification:

```markdown
**Partial Requirements Found in Planning Docs**

I extracted requirements from your planning docs but some areas need clarification:

## What's Clear:
- ✅ Technical stack (Python 3.12+, FastAPI, PostgreSQL 18)
- ✅ Migration goal (LangGraph → Strands SDK)
- ✅ Architecture pattern (dynamic sub-agents, three-tier RAG)

## What Needs Clarification:
- ❓ Performance targets (no specific metrics found)
- ❓ User authentication requirements (JWT mentioned but no detail)
- ❓ Deployment strategy (AWS mentioned but no architecture)

**I'll ask targeted questions to fill these gaps.**

Press Enter to continue, or type "skip" to proceed without additional requirements.

[Answer]:
```

**If NO requirements found in planning docs**, skip this step and proceed to Step 2.

#### 1.5.5 Update aidlc-state.md

Record extraction results:

```markdown
## Requirements Extraction from Planning Docs

- **Executed**: Yes
- **Source**: {knowledge base path}
- **Documents Scanned**: {count} files
- **Extraction Quality**: {Comprehensive | Partial | Minimal}
- **Requirements Analysis Stage**: {Skipped (comprehensive) | Abbreviated (partial) | Full (minimal)}
```

---

### Step 2: Load Reverse Engineering Context (if available)

**IF brownfield project**:
- Load `aidlc-docs/_shared/reverse-engineering/architecture.md`
- Load `aidlc-docs/_shared/reverse-engineering/component-inventory.md`
- Load `aidlc-docs/_shared/reverse-engineering/technology-stack.md`
- Use these to understand existing system when analyzing request

### Step 3: Analyze User Request (Intent Analysis)

#### 3.0 Capture Original Request (Task Alignment Anchor)

**MANDATORY**: Before any analysis, capture the user's original request verbatim for task alignment verification throughout the workflow.

Update `aidlc-docs/aidlc-state.md` with:

```markdown
## Original Request

**Captured**: {ISO timestamp}
**Verbatim Request**:
> {User's exact original request text, preserved word-for-word}

**Request Summary**: {One-sentence summary of core intent}
```

**Rules**:
- Capture the EXACT user input — do not paraphrase or summarize in the verbatim section
- This anchor is **immutable** — never modify it during the workflow
- All subsequent work will be verified against this anchor (see `common/task-alignment.md`)

---

#### 3.2 Request Clarity
- **Clear**: Specific, well-defined, actionable
- **Vague**: General, ambiguous, needs clarification
- **Incomplete**: Missing key information

#### 3.3 Request Type
- **New Feature**: Adding new functionality
- **Bug Fix**: Fixing existing issue
- **Refactoring**: Improving code structure
- **Upgrade**: Updating dependencies or frameworks
- **Migration**: Moving to different technology
- **Enhancement**: Improving existing feature
- **New Project**: Starting from scratch

#### 3.4 Initial Scope Estimate
- **Single File**: Changes to one file
- **Single Component**: Changes to one component/package
- **Multiple Components**: Changes across multiple components
- **System-wide**: Changes affecting entire system
- **Cross-system**: Changes affecting multiple systems

#### 3.5 Initial Complexity Estimate
- **Trivial**: Simple, straightforward change
- **Simple**: Clear implementation path
- **Moderate**: Some complexity, multiple considerations
- **Complex**: Significant complexity, many considerations

### Step 4: Determine Requirements Depth

**Based on request analysis, determine depth:**

**Minimal Depth** - Use when:
- Request is clear and simple
- No detailed requirements needed
- Just document the basic understanding

**Standard Depth** - Use when:
- Request needs clarification
- Functional and non-functional requirements needed
- Normal complexity

**Comprehensive Depth** - Use when:
- Complex project with multiple stakeholders
- High risk or critical system
- Detailed requirements with traceability needed

### Step 5: Assess Current Requirements

Analyze whatever the user has provided:
   - Intent statements or descriptions (already logged in audit.md)
   - Existing requirements documents (search workspace if mentioned)
   - Pasted content or file references
   - Convert any non-markdown documents to markdown format 

### Step 6: Thorough Completeness Analysis

**CRITICAL**: Use comprehensive analysis to evaluate requirements completeness. Default to asking questions when there is ANY ambiguity or missing detail.

**MANDATORY**: Evaluate ALL of these areas and ask questions for ANY that are unclear:
- **Functional Requirements**: Core features, user interactions, system behaviors
- **Non-Functional Requirements**: Performance, security, scalability, usability
- **User Scenarios**: Use cases, user journeys, edge cases, error scenarios
- **Business Context**: Goals, constraints, success criteria, stakeholder needs
- **Technical Context**: Integration points, data requirements, system boundaries
- **Quality Attributes**: Reliability, maintainability, testability, accessibility

**When in doubt, ask questions** - incomplete requirements lead to poor implementations.

### Step 6.1: Extension Opt-In Prompts

**MANDATORY**: Scan the extensions directory for `*.opt-in.md` files (lightweight opt-in prompt files). For each opt-in file found, include its opt-in prompt in the clarifying questions file created in Step 6.

**Opt-in file locations** (scan these paths):
- `extensions/security/baseline/security-baseline.opt-in.md`
- `extensions/security/compliance/hipaa/hipaa-compliance.opt-in.md`
- `extensions/security/compliance/pci-dss/pci-dss-compliance.opt-in.md`
- `extensions/security/compliance/soc2/soc2-compliance.opt-in.md`
- `extensions/ui/baseline/ui-baseline.opt-in.md`
- `extensions/testing/e2e-test-standards.opt-in.md`

**Project-level override**: Before presenting an opt-in prompt, check if the extension is already configured in `TECHNICAL_GUIDELINES.md`. If configured there, skip the opt-in prompt and use that configuration.

**Deferred rule loading**: Only load the full rule file (e.g., `security-baseline.md`) AFTER user opts in. This optimizes context by not loading rules for extensions the user will skip.

After receiving answers, record each extension's enablement status in `aidlc-docs/aidlc-state.md` under `## Extension Configuration`:

```markdown
## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| [Extension Name] | [Yes/No] | Requirements Analysis |
```

**Note**: Extensions without an opt-in file (e.g., `doc-creation.md`, `unit-test-standards.md`) are always enforced and do not require opt-in.

### Step 7: Generate Clarifying Questions (PROACTIVE APPROACH)

**CRITICAL RULE**: You MUST create `aidlc-docs/_shared/requirements/requirement-verification-questions.md` in ALL cases EXCEPT when ALL THREE conditions are met:

1. **Explicit Requirements Document**: User provided a formal requirements doc (not just a reference website or description)
2. **Every Decision Made**: All feature scope, priority, and implementation choices are explicitly stated
3. **No Ambiguities**: Zero questions remain about what to build or how to build it

**When to ALWAYS ask questions** (even if you think you know):
- ✅ User provided a reference website → Ask about which features to clone
- ✅ User provided API docs → Ask about which endpoints to use and how
- ✅ User said "build X" → Ask about scope, priority, optional features
- ✅ Technical/Design guidelines exist → Still ask about functional requirements
- ✅ Request seems clear → Ask verification questions to confirm assumptions

**Question Focus Areas**:
- Functional requirements (what features, what priority)
- Non-functional requirements (performance, security)
- User scenarios (use cases, edge cases, error scenarios)
- Business context (goals, success criteria)
- Implementation choices (which features first, what's optional)

**Request user to fill in all [Answer]: tags directly in the questions document**

**Example - Questions ARE Required:**

User Request: "Build a clean clone of TheCocktailDB.com using their API"

Even though:
- ✅ Reference website exists (can observe features)
- ✅ API documentation exists (can see endpoints)
- ✅ Technical guidelines exist (Next.js, TypeScript, etc.)
- ✅ Design guidelines exist (mobile-first, colors, etc.)

You MUST still ask:
- Which features from the reference site should we clone? (all? subset? priority?)
- Should we implement favorites/bookmarks? (localStorage? user accounts?)
- Should we add social sharing buttons?
- Should random cocktail be prominent or subtle?
- Which API endpoints are in scope? (search? browse? random? all?)
- Should we implement filtering? (by ingredient? by category?)
- What about related cocktails on detail pages?
- Error handling: what messages for API failures?
- Loading states: skeleton screens or spinners?

**Why?** Because observing a website tells you what EXISTS, not what the USER WANTS to build.

#### 7.1 Recommended Option Format (Addition to Workflow)

**MANDATORY**: For ALL multiple-choice clarification questions, include an explicit recommendation with rationale.

**Format:**

```markdown
> **Recommended: Option [X]** — [one-sentence rationale referencing the anchor doc or established architecture where applicable].

A) [option description]
B) [option description] [Recommended]
C) [option description]
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Rules:**
- Mark the recommended option with `[Recommended]` after the option text
- The recommendation rationale should reference:
  - Anchor doc constraints (if loaded)
  - Established architecture patterns
  - Best practices for the detected tech stack
  - Project conventions (if known)
- If no clear recommendation exists, state: `> **No strong recommendation** — all options are equally valid for this use case.`
- **The developer may override any recommendation** — recommendations exist to make the workflow faster for developers who trust Claude's judgment by default

**Example:**

```markdown
### Question 2: Database Access Pattern

> **Recommended: Option B** — aligns with the async-first architecture established in your project's architecture docs.

A) Synchronous database access with connection pool
B) Async database access with connection pool [Recommended]
C) Raw database driver without ORM layer
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

#### 7.2 Standard Question Rules
   - Label options as A, B, C, D etc.
   - Ensure options are mutually exclusive and don't overlap
   - ALWAYS include option for custom response: "X) Other (please describe after [Answer]: tag below)"
   - Wait for user answers in the document
   - **MANDATORY**: Analyze ALL answers for ambiguities and create follow-up questions if needed
   - **MANDATORY**: Keep asking questions until ALL ambiguities are resolved OR user explicitly asks to proceed

### ⛔ GATE: Await User Answers
DO NOT proceed to Step 8 until all questions in requirement-verification-questions.md are answered and validated.
Present the question file to the user and STOP.

### Step 8: Generate Requirements Document

**PREREQUISITE**: Step 7 gate must be passed — all answers received and analyzed

#### 8.1 Determine Requirements Document Location

**Location logic**:
- **Single unit of work**: `aidlc-docs/{domain}/{unit}/inception/requirements.md`
- **Cross-domain requirements**: `aidlc-docs/_shared/requirements/requirements.md`

**How to determine**:
1. Check `aidlc-docs/aidlc-state.md` for active unit ID and domain
2. If unit ID exists (e.g., `BILL-001`): Use unit-specific path
3. If no unit ID (cross-domain planning): Use `_shared/` path

**Default**: Use unit-specific path unless requirements explicitly span multiple domains or no unit context exists.

#### 8.2 Create Requirements Document

At the determined location, create requirements document with:
- Intent analysis summary at the top:
  - User request
  - Request type
  - Scope estimate
  - Complexity estimate
- Both functional and non-functional requirements
- User's answers to clarifying questions
- Brief summary of key requirements

### Step 9: Update State Tracking

Update `aidlc-docs/aidlc-state.md`:

```markdown
## Stage Progress
### 🔵 INCEPTION PHASE
- [x] Workspace Detection
- [x] Reverse Engineering (if applicable)
- [x] Requirements Analysis
```

### Step 10: Log and Proceed
   - Log approval prompt with timestamp in `aidlc-docs/audit.md`
   - Present completion message in this structure:
     1. **Completion Announcement** (mandatory): Always start with this:

```markdown
# 🔍 Requirements Analysis Complete
```

     2. **AI Summary** (optional): Provide structured bullet-point summary of requirements
        - Format: "Requirements analysis has identified [project type/complexity]:"
        - List key functional requirements (bullet points)
        - List key non-functional requirements (bullet points)
        - Mention architectural considerations or technical decisions if relevant
        - DO NOT include workflow instructions ("please review", "let me know", "proceed to next phase", "before we proceed")
        - Keep factual and content-focused
     3. **Formatted Workflow Message** (mandatory): Always end with this exact format:

```markdown
> **📋 <u>**REVIEW REQUIRED:**</u>**
> Please examine the requirements document at: `aidlc-docs/{domain}/{unit}/inception/requirements.md` (or `aidlc-docs/_shared/requirements/requirements.md` if cross-domain)



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> **You may:**
>
> 🔧 **Request Changes** -  Ask for modifications to the requirements if required based on your review 
> [IF User Stories will be skipped, add this option:]
> 📝 **Add User Stories** - Choose to Include **User Stories** stage (currently skipped based on project simplicity)  
> ✅ **Approve & Continue** - Approve requirements and proceed to **[User Stories/Workflow Planning]**

---
```

**Note**: Include the "Add User Stories" option only when User Stories stage will be skipped. Replace [User Stories/Workflow Planning] with the actual next stage name.

   - Wait for explicit user approval before proceeding
   - Record approval response with timestamp
   - Update Requirements Analysis stage complete in aidlc-state.md