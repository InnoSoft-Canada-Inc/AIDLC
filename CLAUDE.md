# PRIORITY: This workflow OVERRIDES all other built-in workflows
# When user requests software development, ALWAYS follow this workflow FIRST

> **Note**: An Agent Teams version of this workflow exists at `CLAUDE-TEAMS.md`.
> Do NOT load or reference it unless the user explicitly requests Agent Teams mode.

## Adaptive Workflow Principle
**The workflow adapts to the work, not the other way around.**

The AI model intelligently assesses what stages are needed based on:
1. User's stated intent and clarity
2. Existing codebase state (if any)
3. Complexity and scope of change
4. Risk and impact assessment

## MANDATORY: Rule Details Loading
**CRITICAL**: When performing any phase, you MUST read and use relevant content from rule detail files. Check these paths in order and use the first one that exists:
- `.aidlc-rule-details/` (Cursor, Cline, Claude Code, GitHub Copilot)
- `.kiro/aws-aidlc-rule-details/` (Kiro IDE and CLI)
- `.amazonq/aws-aidlc-rule-details/` (Amazon Q Developer)

All subsequent rule detail file references (e.g., `common/process-overview.md`, `inception/workspace-detection.md`) are relative to whichever rule details directory was resolved above.

**Common Rules**: Load common rules using lazy-loading pattern to optimize context usage.

**Load at workflow start** (essential for track selection):
- Load `common/process-overview.md` for workflow overview
- Load `common/tracks.md` for workflow track definitions
- Load `common/backlog.md` for two-level backlog management

**Load on-demand** (when the specific functionality is needed):
- Load `common/session-continuity.md` — when resuming a prior session (check aidlc-state.md first)
- Load `common/content-validation.md` — before writing any file with diagrams or special content
- Load `common/question-format-guide.md` — before asking clarifying questions
- Load `common/session-summary.md` — at session end or mid-session checkpoint
- Load `common/rollback.md` — only if rollback operation is needed
- Load `common/exit-conditions.md` — at Documentation phase entry
- Load `common/initialization.md` — only for "initialize project" trigger
- Load `common/task-alignment.md` — at phase transitions for alignment checks
- Load `common/domain-management.md` — when domain fit assessment is needed
- Load `common/self-improvement.md` — at session start (review lessons only) and session end (capture lessons)
- Load `common/subagent-strategy.md` — only when spawning subagents
- Load `common/git-user-tracking.md` — automatically loaded at session start for username capture
- Load `common/interruption-handling.md` — when a second "Using AI-DLC..." trigger fires mid-unit

## MANDATORY: Extensions Loading
**CRITICAL**: Extensions are cross-cutting constraints. Load them efficiently using deferred loading.

**Loading process** (optimized for context efficiency):

1. **Always load** (core workflow extensions — no opt-in required):
   - `extensions/documentation/doc-creation.md` — feature documentation standards
   - `extensions/documentation/doc-review.md` — impact scan standards
   - `extensions/project/anchor-map-auto-update.md` — anchor map maintenance
   - `extensions/testing/unit-test-standards.md` — test naming standards

2. **Load opt-in prompts first** (lightweight files for Requirements Analysis):
   - `extensions/security/baseline/security-baseline.opt-in.md`
   - `extensions/security/compliance/hipaa/hipaa-compliance.opt-in.md`
   - `extensions/security/compliance/pci-dss/pci-dss-compliance.opt-in.md`
   - `extensions/security/compliance/soc2/soc2-compliance.opt-in.md`
   - `extensions/ui/baseline/ui-baseline.opt-in.md`
   - `extensions/testing/e2e-test-standards.opt-in.md`

3. **Deferred rule loading** (load full rules ONLY after user opts in):
   - Check `aidlc-docs/aidlc-state.md` under `## Extension Configuration`
   - If `Enabled: Yes` → load the full rule file (e.g., `security-baseline.md`)
   - If `Enabled: No` → do NOT load the full rule file, log skip in audit.md
   - If no config exists → present opt-in prompt during Requirements Analysis

4. **Project-level override**: Check `TECHNICAL_GUIDELINES.md` first. If extension is configured there, skip the opt-in prompt and use that configuration.

**Security Compliance Extensions (HIPAA, PCI-DSS, SOC 2)**: These extensions contain ONLY delta requirements beyond the baseline. When a compliance extension is enabled, you MUST enforce BOTH the baseline security rules (security-baseline.md) AND the compliance-specific deltas.

**Enforcement**:
- Extension rules are hard constraints, not optional guidance
- At each stage, the model intelligently evaluates which extension rules are applicable based on the stage's purpose, the artifacts being produced, and the context of the work — enforce only those rules that are relevant
- Rules that are not applicable to the current stage should be marked as N/A in the compliance summary (this is not a blocking finding)
- Non-compliance with any applicable enabled extension rule is a **blocking finding** — do NOT present stage completion until resolved
- When presenting stage completion, include a summary of extension rule compliance (compliant/non-compliant/N/A per rule, with brief rationale for N/A determinations)

**Conditional Enforcement**: Extensions may be conditionally enabled/disabled. See `inception/requirements-analysis.md` Step 6.1 for the opt-in collection mechanism. Before enforcing any extension at ANY stage, check its `Enabled` status in `aidlc-docs/aidlc-state.md` under `## Extension Configuration`. Skip disabled extensions and log the skip in audit.md. Default to enforced if no configuration exists. Extensions without an opt-in file are always enforced.

## OPTIONAL: Custom Extensions Loading

If `.aidlc-rule-details/extensions/custom/README.md` exists and lists enabled extensions:

**Loading process**:
1. Read `extensions/custom/README.md` for list of enabled custom extensions
2. For each enabled extension (marked with `[x]`):
   - Load the extension file from `extensions/custom/{extension-name}.md`
   - Enforce rules at integration points specified in extension
   - Log custom extension usage in audit.md

**Integration points** where custom extensions can execute:
- During Requirements Analysis (ask opt-in questions)
- After any core stage (add custom substages)
- Before stage completion (add custom validation)
- At phase transitions (add custom approval gates)

**Custom extension structure**:
```markdown
# {Extension Name}

## Integration Point
[When/where this extension runs]

## Opt-In Prompt (if conditional)
[Question to ask during Requirements Analysis]

## Rules
[Custom rules to enforce]

## Enforcement
[How to verify compliance]
```

**Note**: Custom extensions are YOUR responsibility. They are not part of the core AIDLC framework and won't be maintained during framework updates.

## MANDATORY: Content Validation
**CRITICAL**: Before creating ANY file, you MUST validate content according to `common/content-validation.md` rules:
- Validate Mermaid diagram syntax
- Validate ASCII art diagrams (see `common/ascii-diagram-standards.md`)
- Escape special characters properly
- Provide text alternatives for complex visual content
- Test content parsing compatibility

## MANDATORY: Question File Format
**CRITICAL**: When asking questions at any phase, you MUST follow question format guidelines.

**See `common/question-format-guide.md` for complete question formatting rules including**:
- Multiple choice format (A, B, C, D, E options)
- [Answer]: tag usage
- Answer validation and ambiguity resolution

## MANDATORY: Custom Welcome Message
**CRITICAL**: When starting ANY software development request, you MUST display the welcome message.

**How to Display Welcome Message**:
1. Load the welcome message from `common/welcome-message.md` (in the resolved rule details directory)
2. Display the complete message to the user
3. This should only be done ONCE at the start of a new workflow
4. Do NOT load this file in subsequent interactions to save context space

# Adaptive Software Development Workflow

---

# WORKFLOW ACTIVATION

## Planning-Only Mode

**Trigger**: `Using AI-DLC, plan [feature/task]`

Runs full Inception phase but STOPS before Construction. Output is saved to your docs folder as a planning document.

**Use this when**: You want to think through a feature before committing to build it.

**Output**: `{knowledge_base}/planning/{feature}-plan.md`

**Later**: When ready to implement, the planning document becomes the anchor for the unit.

See `common/planning-mode.md` for complete documentation.

---

## Project-Wide Guidelines

### Technical Guidelines

Project-wide technical standards are loaded from `TECHNICAL_GUIDELINES.md` (if configured in anchor-map.md) at the start of EVERY session.

**Contents**: Framework versions, component preferences, coding standards, hard constraints.

**Behavior**: Treated as immutable constraints — AI will not suggest alternatives unless explicitly asked.

**Create**: `Using AI-DLC, create technical guidelines with NextJS v16.1.4, React 19, shadcn/ui`

**Update methods**:
- Explicit: `Using AI-DLC, update technical guidelines`
- Inline: "Update my guidelines to use [new version/library]" during any session

See `common/technical-guidelines.md` for complete documentation.

### Design Guidelines

Project-wide visual and behavioral design specifications are loaded from `DESIGN_GUIDELINES.md` (if configured in anchor-map.md) at the start of EVERY session.

**Contents**: Design system references, visual design tokens (colors, typography, spacing), interaction patterns (animations, component states), screen states (loading, error, empty), responsive strategy (breakpoints, touch targets), hard constraints.

**Behavior**: Treated as immutable visual/behavioral constraints — AI will not suggest alternatives unless explicitly asked.

**Initialization**: During project initialization (Question 3):
- **Option A**: Provide path to existing design guidelines
- **Option B**: Use Figma file with MCP server configured
- **Option C**: Create template at `{knowledge_base}/DESIGN_GUIDELINES.md`
- **Option D**: Skip for now (not a designer / backend-only project)

**Auto-extraction**: If planning docs exist, AI will automatically extract:
- Design system references (Figma URLs, Storybook links)
- Color palettes, typography scales, spacing systems
- Component library references (shadcn/ui, Material-UI, etc.)
- Interaction patterns (animation durations, transition styles)
- Responsive breakpoints (mobile/tablet/desktop widths)

**Create**: `Using AI-DLC, create design guidelines with [design system details]`

**Update**: `Using AI-DLC, update design guidelines` or inline during any session

See `common/design-guidelines.md` for template structure, enforcement rules, and complete documentation.

---

## External Documentation Tools (MCP Servers)

If MCP servers (e.g., Context7) are configured, use them for:
- Framework/library documentation lookups
- Current best practices and API references
- Version-specific guidance and migration paths

**Guidelines**:
- Query specifically (not entire documentation)
- Summarize results before incorporating into artifacts
- Cite sources in the Decision Log section of feature docs
- Prefer local codebase patterns over external docs when both exist

See `common/subagent-strategy.md` for MCP vs subagent decision guidance.

---

## Track Selection (FIRST STEP)

**When "Using AI-DLC..." trigger fires, track selection is the FIRST step before any phase begins.**

1. **MANDATORY**: Load `common/tracks.md` for detailed track definitions
2. Read the activation prompt and select one of three tracks based on scope signals:

### Track Selection Criteria

| Signal Words | Track |
|--------------|-------|
| new feature, new domain, new API, new integration | **Full Track** |
| improvement, refactor, update, small change, config | **Lightweight Track** |
| bug, fix, broken, error, typo, urgent, hotfix | **Hotfix Track** |
| Ambiguous | Ask one clarifying question before selecting |

### The Three Tracks

**Full Track** — All five phases
```
Inception → Construction → Operations → Testing & Validation → Documentation
```
- Triggers: new feature, new domain, new API, new integration
- Full Inception ceremony, all phases, full documentation

**Lightweight Track** — Condensed workflow
```
Condensed Inception → Construction → Quick Regression → Documentation Exit
```
- Triggers: improvement, refactor, update, small change, config
- Skips: full Inception ceremony, Operations, full Testing & Validation

**Hotfix Track** — Minimal workflow
```
Diagnose → Fix → Verify → Documentation Exit
```
- Triggers: bug, fix, broken, error, typo, urgent, hotfix
- Skips: Inception, Operations, Testing & Validation
- Rule: If no test existed that would have caught this bug, write that missing test as part of the fix

3. **Announce selection** with one-sentence rationale:
   ```
   Selected: [Track Name] — [one-sentence rationale based on prompt analysis]
   ```

4. **Wait for confirmation or override** before proceeding to Inception (or Diagnose for Hotfix)

### Documentation Depth by Track

| Track | Documentation Requirement |
|-------|---------------------------|
| Full | Full feature doc, impact scan, consistency check |
| Lightweight | Brief change note, targeted update to directly affected docs |
| Hotfix | One-paragraph entry in relevant doc, session summary updated |

**Documentation is mandatory on ALL tracks** — it is the exit condition, not an optional phase.

---

## Interruption Handling

**If a second "Using AI-DLC..." trigger fires while a unit of work is already active:**

The workflow must NOT silently close the current unit or automatically start a new one. Closing a unit means running the documentation exit — that requires an explicit human decision.

**Pause and present these options:**

---

A unit of work is currently in progress: **{UNIT-ID}** ({domain}, {current phase} phase).

Before starting a new unit I need to know how you want to handle the current one:

**A) Close {UNIT-ID} now** — run the documentation exit for the current track, then start the new unit in this session

**B) Pause {UNIT-ID}** — save the session summary as-is and start the new unit as an interruption. {UNIT-ID} resumes in a future session.

**C) This is part of {UNIT-ID}** — continue within the current unit, do not start a new one

**D) Open a new session for the new unit** — I will stay with {UNIT-ID} and you handle the new unit separately

Which would you like to do?

See `common/interruption-handling.md` for detailed behavior per option.

---

# INCEPTION PHASE

**Purpose**: Planning, requirements gathering, and architectural decisions

**Focus**: Determine WHAT to build and WHY

**Stages in INCEPTION PHASE**:
- Workspace Detection (ALWAYS)
- Reverse Engineering (CONDITIONAL - Brownfield only)
- Requirements Analysis (ALWAYS - Adaptive depth)
- User Stories (CONDITIONAL)
- Workflow Planning (ALWAYS)
- Application Design (CONDITIONAL)
- Units Generation (CONDITIONAL)

---

## Workspace Detection (ALWAYS EXECUTE)

1. **MANDATORY**: Log initial user request in audit.md with complete raw input
2. Load all steps from `inception/workspace-detection.md`
3. Execute workspace detection:
   - Check for existing aidlc-state.md (resume if found)
   - Scan workspace for existing code
   - Determine if brownfield or greenfield
   - Check for existing reverse engineering artifacts
4. Determine next phase: Reverse Engineering (if brownfield and no artifacts) OR Requirements Analysis
5. **MANDATORY**: Log findings in audit.md
6. Present completion message to user (see workspace-detection.md for message formats)
7. Automatically proceed to next phase

## Reverse Engineering (CONDITIONAL - Brownfield Only)

**Execute IF**:
- Existing codebase detected
- No previous reverse engineering artifacts found

**Skip IF**:
- Greenfield project
- Previous reverse engineering artifacts exist

**Execution**:
1. **MANDATORY**: Log start of reverse engineering in audit.md
2. Load all steps from `inception/reverse-engineering.md`
3. Execute reverse engineering:
   - Analyze all packages and components
   - Generate a business overview of the whole system covering the business transactions
   - Generate architecture documentation
   - Generate code structure documentation
   - Generate API documentation
   - Generate component inventory
   - Generate Interaction Diagrams depicting how business transactions are implemented across components
   - Generate technology stack documentation
   - Generate dependencies documentation

4. **Wait for Explicit Approval**: Present detailed completion message (see reverse-engineering.md for message format) - DO NOT PROCEED until user confirms
5. **MANDATORY**: Log user's response in audit.md with complete raw input

## Requirements Analysis (ALWAYS EXECUTE - Adaptive Depth)

**Always executes** but depth varies based on request clarity and complexity:
- **Minimal**: Simple, clear request - just document intent analysis
- **Standard**: Normal complexity - gather functional and non-functional requirements
- **Comprehensive**: Complex, high-risk - detailed requirements with traceability

**Execution**:
1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `inception/requirements-analysis.md`
3. Execute requirements analysis:
   - Load reverse engineering artifacts (if brownfield)
   - Analyze user request (intent analysis)
   - Determine requirements depth needed
   - Assess current requirements
   - Ask clarifying questions (if needed)
   - Generate requirements document
4. Execute at appropriate depth (minimal/standard/comprehensive)
5. **Wait for Explicit Approval**: Follow approval format from requirements-analysis.md detailed steps - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

## User Stories (CONDITIONAL)

**INTELLIGENT ASSESSMENT**: Use multi-factor analysis to determine if user stories add value. See `inception/user-stories.md` Step 1 for the full assessment criteria (high/medium/skip priority indicators and complexity factors).

**Quick guide**: Execute for user-facing features, multi-persona systems, complex business logic. Skip for pure refactoring, isolated bug fixes, infrastructure-only changes. Default to inclusion for borderline cases.

**Note**: If Requirements Analysis executed, Stories can reference and build upon those requirements.

**User Stories has two parts within one stage**:
1. **Part 1 - Planning**: Create story plan with questions, collect answers, analyze for ambiguities, get approval
2. **Part 2 - Generation**: Execute approved plan to generate stories and personas

**Execution**:
1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `inception/user-stories.md`
3. **MANDATORY**: Perform intelligent assessment (Step 1 in user-stories.md) to validate user stories are needed
4. Load reverse engineering artifacts (if brownfield)
5. If Requirements exist, reference them when creating stories
6. Execute at appropriate depth (minimal/standard/comprehensive)
7. **PART 1 - Planning**: Create story plan with questions, wait for user answers, analyze for ambiguities, get approval
8. **PART 2 - Generation**: Execute approved plan to generate stories and personas
9. **Wait for Explicit Approval**: Follow approval format from user-stories.md detailed steps - DO NOT PROCEED until user confirms
10. **MANDATORY**: Log user's response in audit.md with complete raw input

## Workflow Planning (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `inception/workflow-planning.md`
3. **MANDATORY**: Load content validation rules from `common/content-validation.md`
4. Load all prior context:
   - Reverse engineering artifacts (if brownfield)
   - Intent analysis
   - Requirements (if executed)
   - User stories (if executed)
5. Execute workflow planning:
   - Determine which phases to execute
   - Determine depth level for each phase
   - Create multi-package change sequence (if brownfield)
   - Generate workflow visualization (VALIDATE Mermaid syntax before writing)
6. **MANDATORY**: Validate all content before file creation per content-validation.md rules
7. **Wait for Explicit Approval**: Present recommendations using language from workflow-planning.md Step 9, emphasizing user control to override recommendations - DO NOT PROCEED until user confirms
8. **MANDATORY**: Log user's response in audit.md with complete raw input

## Application Design (CONDITIONAL)

**Execute IF**:
- New components or services needed
- Component methods and business rules need definition
- Service layer design required
- Component dependencies need clarification

**Skip IF**:
- Changes within existing component boundaries
- No new components or methods
- Pure implementation changes

**Execution**:
1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `inception/application-design.md`
3. Load reverse engineering artifacts (if brownfield)
4. Execute at appropriate depth (minimal/standard/comprehensive)
5. **Wait for Explicit Approval**: Present detailed completion message (see application-design.md for message format) - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

## Units Generation (CONDITIONAL)

**Execute IF**:
- System needs decomposition into multiple units of work
- Multiple services or modules required
- Complex system requiring structured breakdown

**Skip IF**:
- Single simple unit
- No decomposition needed
- Straightforward single-component implementation

**Execution**:
1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `inception/units-generation.md`
3. Load reverse engineering artifacts (if brownfield)
4. Execute at appropriate depth (minimal/standard/comprehensive)
5. **Wait for Explicit Approval**: Present detailed completion message (see units-generation.md for message format) - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

---

# 🟢 CONSTRUCTION PHASE

**Purpose**: Detailed design, NFR implementation, and code generation

**Focus**: Determine HOW to build it

**Stages in CONSTRUCTION PHASE**:
- Per-Unit Loop (executes for each unit):
  - Functional Design (CONDITIONAL, per-unit)
  - NFR Requirements (CONDITIONAL, per-unit)
  - NFR Design (CONDITIONAL, per-unit)
  - Infrastructure Design (CONDITIONAL, per-unit)
  - Code Generation (ALWAYS, per-unit)
- Build and Test (ALWAYS - after all units complete)

**Note**: Each unit is completed fully (design + code) before moving to the next unit.

### Mid-Session Session Summary Updates

**MANDATORY**: At every natural breakpoint within Construction, update the session-summary.md even if the session is not ending.

**Natural breakpoints include**:
- After a significant file batch is completed
- After completing a stage within Construction (e.g., after Functional Design, after Code Generation)
- Before a context reset

**Purpose**: Enables mid-feature context resets without losing state. If Claude Code were closed right now, the session summary must contain enough information for a fresh session to resume without re-planning.

**Update requirements**:
- Update "Files Touched This Session" with any new files
- Update "Decisions Made" with any new decisions
- Update "Exact Next Step" to reflect current position
- Archive previous version if making significant changes (see `common/session-summary.md`)

---

## Per-Unit Loop (Executes for Each Unit)

**For each unit of work, execute the following stages in sequence:**

### Functional Design (CONDITIONAL, per-unit)

**Execute IF**:
- New data models or schemas
- Complex business logic
- Business rules need detailed design

**Skip IF**:
- Simple logic changes
- No new business logic

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `construction/functional-design.md`
3. Execute functional design for this unit:
   - Data models and schemas
   - Business logic and rules
   - Function signatures
   - **UI State Inventory** (if UI Baseline extension enabled and user opts in)
4. **MANDATORY**: Present standardized 2-option completion message as defined in functional-design.md - DO NOT use emergent 3-option behavior
5. **Wait for Explicit Approval**: User must choose between "Request Changes" or "Continue to Next Stage" - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

**Note**: If UI State Inventory created approval questions, wait for user to answer all questions before presenting completion message.

### NFR Requirements (CONDITIONAL, per-unit)

**Execute IF**:
- Performance requirements exist
- Security considerations needed
- Scalability concerns present
- Tech stack selection required

**Skip IF**:
- No NFR requirements
- Tech stack already determined

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `construction/nfr-requirements.md`
3. Execute NFR assessment for this unit
4. **MANDATORY**: Present standardized 2-option completion message as defined in nfr-requirements.md - DO NOT use emergent behavior
5. **Wait for Explicit Approval**: User must choose between "Request Changes" or "Continue to Next Stage" - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

### NFR Design (CONDITIONAL, per-unit)

**Execute IF**:
- NFR Requirements was executed
- NFR patterns need to be incorporated

**Skip IF**:
- No NFR requirements
- NFR Requirements Assessment was skipped

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `construction/nfr-design.md`
3. Execute NFR design for this unit
4. **MANDATORY**: Present standardized 2-option completion message as defined in nfr-design.md - DO NOT use emergent behavior
5. **Wait for Explicit Approval**: User must choose between "Request Changes" or "Continue to Next Stage" - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

### Infrastructure Design (CONDITIONAL, per-unit)

**Execute IF**:
- Infrastructure services need mapping
- Deployment architecture required
- Cloud resources need specification

**Skip IF**:
- No infrastructure changes
- Infrastructure already defined

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `construction/infrastructure-design.md`
3. Execute infrastructure design for this unit
4. **MANDATORY**: Present standardized 2-option completion message as defined in infrastructure-design.md - DO NOT use emergent behavior
5. **Wait for Explicit Approval**: User must choose between "Request Changes" or "Continue to Next Stage" - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

### Code Generation (ALWAYS EXECUTE, per-unit)

**Always executes for each unit**

**Code Generation has two parts within one stage**:
1. **Part 1 - Planning**: Create detailed code generation plan with explicit steps
2. **Part 2 - Generation**: Execute approved plan to generate code, tests, and artifacts

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `construction/code-generation.md`
3. **PART 1 - Planning**: Create code generation plan with checkboxes, get user approval
4. **PART 2 - Generation**: Execute approved plan to generate code for this unit
5. **MANDATORY**: Present standardized 2-option completion message as defined in code-generation.md - DO NOT use emergent behavior
6. **Wait for Explicit Approval**: User must choose between "Request Changes" or "Continue to Next Stage" - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

---

## Build and Test (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this phase in audit.md
2. Load all steps from `construction/build-and-test.md`
3. **Determine path** (see build-and-test.md Path Selection Logic):
   - Check total units in `aidlc-docs/aidlc-backlog.md`
   - If multiple units → Use `aidlc-docs/_shared/build-and-test/`
   - If single unit → Use `aidlc-docs/{domain}/{unit}/construction/build-and-test/`
4. Generate comprehensive build and test instructions:
   - Build instructions for all units (or this unit)
   - Unit test execution instructions
   - Integration test instructions (test interactions between units, if multi-unit)
   - Performance test instructions (if applicable)
   - Additional test instructions as needed (contract tests, security tests, e2e tests)
5. Create instruction files in determined subdirectory: build-instructions.md, unit-test-instructions.md, integration-test-instructions.md, performance-test-instructions.md, build-and-test-summary.md
6. **Wait for Explicit Approval**: Ask: "**Build and test instructions complete. Ready to proceed to Operations stage?**" - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

---

# 🟡 OPERATIONS PHASE (PLACEHOLDER)

**Status**: Placeholder for future deployment, monitoring, and maintenance workflows. Currently no stages execute. All build and test activities are handled in the CONSTRUCTION phase.

---

# 🟠 TESTING & VALIDATION PHASE

**Purpose**: Validate new code against existing system, catch integration failures

**Focus**: Does it WORK with everything else?

**Stages in TESTING & VALIDATION PHASE**:
- Integration Test Generation (ALWAYS)
- Requirement-Test Mapping (ALWAYS)
- Regression Run (ALWAYS)
- E2E Workflow Validation (CONDITIONAL - if extension enabled)
- Contract Validation (CONDITIONAL)
- Coverage Report (ALWAYS)

**Note**: This phase runs after Operations and before Documentation. Human approval is required before advancing to Documentation.

---

## Integration Test Generation (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/integration-test-scenarios.md`
3. Review what was built during Construction
4. Identify all cross-domain touch points:
   - API contracts consumed by other domains
   - Shared database tables
   - Event/hook patterns
   - Tool signatures
   - OpenAPI endpoints
5. Generate integration tests that probe those boundaries
6. Verify tool schemas and handler interfaces have not broken existing consumers
7. **Wait for Explicit Approval**: Present integration test plan - DO NOT PROCEED until user confirms
8. **MANDATORY**: Log user's response in audit.md with complete raw input

## Requirement-Test Mapping (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/requirement-test-map.md`
3. Create traceability document mapping:
   - User story acceptance criteria → tests
   - Business rules from functional design → tests
   - Edge cases → tests
4. Verify coverage:
   - Every acceptance criterion has at least one test
   - Every business rule has at least one test
   - Common edge cases are tested
5. **Wait for Explicit Approval**: Present mapping with gap analysis - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

## Regression Run (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/regression.md`
3. Execute the full existing test suite
4. Surface any failures introduced by this unit's changes
5. For each failure, determine:
   - **Legitimate regression**: This unit broke something that was working
   - **Test needs updating**: This unit intentionally changed behavior
6. **Wait for Explicit Approval**: Present findings with clear categorization before any fixes - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

## E2E Workflow Validation (CONDITIONAL)

**Execute IF**:
- E2E Test Standards extension is enabled in `aidlc-state.md`

**Skip IF**:
- E2E Test Standards extension is disabled

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/e2e-workflow-validation.md`
3. Load user stories from Inception (or create minimal journey list from requirements if User Stories was skipped)
4. Generate E2E test scenarios mapped to user stories
5. Validate workflow coverage:
   - User story coverage (E2E-01: every user story has E2E scenario)
   - Critical workflow coverage (E2E-02: happy paths and critical errors)
   - Cross-service validation (E2E-03: data flows across service boundaries, if applicable)
6. Execute E2E tests if implemented (optional)
7. Verify compliance with E2E Test Standards extension rules (E2E-01, E2E-02, E2E-03 are BLOCKING)
8. **Wait for Explicit Approval**: Present E2E validation results - DO NOT PROCEED until user confirms
9. **MANDATORY**: Log user's response in audit.md with complete raw input

## Contract Validation (CONDITIONAL)

**Execute IF**:
- Unit touches the API layer
- Unit adds or modifies service tools
- OpenAPI spec exists in project

**Skip IF**:
- No API changes
- No service tool changes

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/contract-validation.md`
3. For API changes: verify implementation matches OpenAPI spec in `openapi.yaml`
4. For service tool changes: verify tool schemas match consumer expectations
5. Flag any drift between spec and implementation
6. **Wait for Explicit Approval**: Present validation results - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

## Coverage Report (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `testing/coverage-report.md`
3. Generate a structured report of untested code paths:
   - Not just a percentage — list specific untested paths
   - Include brief risk note for each untested path
4. **Wait for Explicit Approval**: Developer reviews and makes informed sign-off - DO NOT PROCEED until user confirms
5. **MANDATORY**: Log user's response in audit.md with complete raw input

## Testing & Validation Approval Gate

**Human Approval Gate**:
- Developer reviews the full testing report
- Must explicitly approve before Documentation phase begins
- If significant issues found: workflow returns to Construction for fixes, then re-runs Testing & Validation

---

# 🟣 DOCUMENTATION & CONSOLIDATION PHASE

**Purpose**: Capture what was actually built, validate against plan, update existing docs

**Focus**: Is it DOCUMENTED correctly?

**Stages in DOCUMENTATION & CONSOLIDATION PHASE**:
- Feature Documentation (ALWAYS)
- Impact Scan (ALWAYS)
- Cross-Doc Update (CONDITIONAL)
- Consistency Check (ALWAYS)
- Backlog Update (ALWAYS)
- Recreation Readiness Check (ALWAYS)

**Note**: This phase captures what was actually built (not what was planned). Documentation is the mandatory exit condition for ALL workflow tracks.

---

## Feature Documentation (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/feature-docs.md`
3. Generate comprehensive feature doc in `aidlc-docs/{domain}/{unit}/documentation/`
4. Required sections (enforced by doc-creation extension):
   - What was built (summary, not implementation detail)
   - Architecture decisions made and why
   - API contracts introduced or modified (with examples)
   - Data model specification (complete entities, relationships, indexes, sample data)
   - Configuration changes (env vars, settings)
   - Dependencies added
   - Known limitations or deferred decisions
   - How to test it manually
   - Relationship to other domains/features
   - Decision log (alternatives considered, trade-offs accepted)
   - Interface contracts (function signatures, events, invariants)
   - Recreation notes (bootstrap sequence, common pitfalls)
5. **Wait for Explicit Approval**: Present feature doc for review - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

## Impact Scan (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/impact-scan.md`
3. Identify all existing documentation files referencing affected components
4. Scope: `docs/`, `aidlc-docs/`, `README.md`, `openapi.yaml`, domain feature docs from prior units
5. Produce list of affected files with one-line note on what needs updating
6. **Wait for Explicit Approval**: Present impact scan results before any updates - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

## Cross-Doc Update (CONDITIONAL)

**Execute IF**:
- Impact scan identified files needing updates

**Skip IF**:
- No existing docs reference affected components

**Execution**:
1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/cross-doc-update.md`
3. Update every file identified in the impact scan
4. For each update: note what changed and why in audit log
5. Make targeted updates to affected sections — do not rewrite documents wholesale
6. **Wait for Explicit Approval**: Present updated docs for review - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

## Consistency Check (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/consistency-check.md`
3. Verify:
   - Terminology is consistent across updated doc set
   - Version references are current (no references to old patterns)
   - Code examples in docs reflect actual implementation
4. Flag anything that could mislead a developer reading docs for the first time
5. **Wait for Explicit Approval**: Present consistency findings - DO NOT PROCEED until user confirms
6. **MANDATORY**: Log user's response in audit.md with complete raw input

## Backlog Update (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/backlog-update.md`
3. Mark completed unit as done in domain backlog
4. Update status of any units now unblocked by this completion
5. Update master backlog to reflect the same
6. Write brief completion note (one or two sentences on what was built and decisions downstream units should know)
7. **Wait for Explicit Approval**: Present backlog updates - DO NOT PROCEED until user confirms
8. **MANDATORY**: Log user's response in audit.md with complete raw input

## Recreation Readiness Check (ALWAYS EXECUTE)

1. **MANDATORY**: Log any user input during this stage in audit.md
2. Load all steps from `documentation/recreation-checklist.md`
3. Verify documentation is sufficient for project recreation:
   - Requirements & Design: requirements documented, acceptance criteria defined, decisions captured
   - Data Model: entities specified, relationships documented, sample data provided
   - Implementation Guidance: decision log exists, configuration documented, dependencies listed
   - Test Coverage: requirement-test mapping exists, all criteria have tests
   - Bootstrap Capability: setup instructions present, manual test instructions work
4. Calculate Recreation Confidence Score (average across all areas, 1-5 scale)
5. **Completion Gate**: Minimum average score of 4 required
6. **Wait for Explicit Approval**: Present checklist results with score - DO NOT PROCEED until user confirms
7. **MANDATORY**: Log user's response in audit.md with complete raw input

## Documentation & Consolidation Approval Gate

**Human Approval Gate**:
- Developer reviews feature doc and confirms doc updates are accurate
- Sign-off closes the unit of work
- Session summary is finalized and archived before workflow closes

---

## Key Principles

- **Adaptive Execution**: Only execute stages that add value
- **Transparent Planning**: Always show execution plan before starting
- **User Control**: User can request stage inclusion/exclusion
- **Progress Tracking**: Update aidlc-state.md with executed and skipped stages
- **Complete Audit Trail**: Log ALL user inputs and AI responses in audit.md with timestamps
  - **CRITICAL**: Capture user's COMPLETE RAW INPUT exactly as provided
  - **CRITICAL**: Never summarize or paraphrase user input in audit log
  - **CRITICAL**: Log every interaction, not just approvals
- **Quality Focus**: Complex changes get full treatment, simple changes stay efficient
- **Content Validation**: Always validate content before file creation per content-validation.md rules
- **Task Alignment**: Continuously verify work aligns with original user request (see below)
- **NO EMERGENT BEHAVIOR**: Construction phases MUST use standardized 2-option completion messages as defined in their respective rule files. DO NOT create 3-option menus or other emergent navigation patterns.

## MANDATORY: Task Alignment Verification

**Purpose**: Ensure work stays aligned with the user's original request throughout the workflow.

### Original Request Capture
- During Requirements Analysis, capture the user's original request verbatim in `aidlc-docs/aidlc-state.md` under `## Original Request`
- This anchor is immutable — never modify it during the workflow
- See `common/task-alignment.md` for full capture format

### Phase Transition Alignment Checks
**MANDATORY**: At each phase transition, perform a brief alignment verification:

1. **Inception → Construction**: Verify design decisions align with original request
2. **Construction → Operations**: Verify built code addresses original request
3. **Operations → Testing**: Verify test focus aligns with original request scope
4. **Testing → Documentation**: Verify deliverable matches original request

**Alignment Check Format** (include in phase transition message):
```markdown
**Alignment Check**: ✅ Aligned | ⚠️ Partial | ❌ Misaligned
**Original Request**: {brief summary}
**Current Direction**: {what's being built/delivered}
```

If ⚠️ Partial or ❌ Misaligned:
- Flag the drift to the user
- Document user's decision (realign, approve scope change, or pause)
- Log in session summary under "Scope Changes" if user approves deviation

### Unit Completion Alignment
- Before marking any unit complete, verify deliverable addresses original request
- Include alignment summary in completion message
- This is a mandatory exit condition (see `common/exit-conditions.md`)

## MANDATORY: Plan-Level Checkbox Enforcement

### MANDATORY RULES FOR PLAN EXECUTION
1. **NEVER complete any work without updating plan checkboxes**
2. **IMMEDIATELY after completing ANY step described in a plan file, mark that step [x]**
3. **This must happen in the SAME interaction where the work is completed**
4. **NO EXCEPTIONS**: Every plan step completion MUST be tracked with checkbox updates

### Two-Level Checkbox Tracking System
- **Plan-Level**: Track detailed execution progress within each stage
- **Stage-Level**: Track overall workflow progress in aidlc-state.md
- **Update immediately**: All progress updates in SAME interaction where work is completed

## Prompts Logging Requirements
- Log EVERY user input with ISO 8601 timestamp in audit.md — complete raw input, never summarized
- Log every approval prompt before asking, and every user response after receiving it
- **CRITICAL**: ALWAYS append/edit audit.md — NEVER overwrite the entire file
- **Format**: `## [Stage] → Timestamp → User Input → AI Response → Context` (separated by `---`)

## Directory Structure

```text
<WORKSPACE-ROOT>/                   # ⚠️ APPLICATION CODE HERE
├── [project-specific structure]    # Varies by project (see code-generation.md)
│
├── aidlc-docs/                     # 📄 DOCUMENTATION ONLY
│   ├── _shared/                    # 🔵 SHARED CROSS-DOMAIN ARTIFACTS ONLY
│   │   ├── plans/                  # Cross-domain workflow plans (NOT unit-specific)
│   │   ├── reverse-engineering/    # Brownfield system-wide analysis
│   │   ├── requirements/           # Cross-domain requirements (NOT unit-specific)
│   │   ├── user-stories/           # Cross-domain user stories (NOT unit-specific)
│   │   ├── application-design/     # System-wide architecture (when using Units Generation)
│   │   ├── build-and-test/         # Build/test instructions (runs after ALL units complete)
│   │   └── kb-cache/               # MCP server knowledge base cache
│   │
│   ├── {domain}/                   # 📂 DOMAIN-BASED UNIT STRUCTURE
│   │   ├── docs/                   # 📚 DOMAIN DOCUMENTATION INDEX
│   │   │   ├── _index.md           # Auto-generated table of contents
│   │   │   └── {UNIT-ID}-{title}.md  # Promoted feature docs (copies)
│   │   ├── aidlc-backlog.md        # Domain backlog
│   │   └── {UNIT-ID}-{title}/      # Unit folder (e.g., AUTH-001-jwt-authentication/)
│   │       ├── inception/          # Unit-specific inception artifacts
│   │       │   ├── requirements.md  # Unit requirements (default location)
│   │       │   └── plans/
│   │       │       └── execution-plan.md  # Unit execution plan (default location)
│   │       ├── construction/       # 🟢 CONSTRUCTION artifacts
│   │       │   ├── plans/
│   │       │   ├── functional-design/
│   │       │   ├── nfr-requirements/
│   │       │   ├── nfr-design/
│   │       │   ├── infrastructure-design/
│   │       │   └── code/           # Markdown summaries only
│   │       ├── testing/            # 🟠 TESTING & VALIDATION artifacts
│   │       │   ├── integration-tests/
│   │       │   ├── regression/
│   │       │   ├── contract-validation/
│   │       │   └── coverage-report/
│   │       ├── documentation/      # 🟣 DOCUMENTATION artifacts
│   │       │   └── feature-doc.md  # Canonical source
│   │       ├── session-summary.md
│   │       └── session-history/    # Archived session summaries
│   │
│   ├── aidlc-state.md              # Current workflow state
│   ├── aidlc-backlog.md            # Master backlog
│   ├── anchor-map.md               # Knowledge base config
│   ├── audit.md                    # Current + last 4 sessions
│   └── audit-archive/              # Monthly archives (audit-YYYY-MM.md)
```

**Naming Convention**: Both unit folders and promoted docs use `{UNIT-ID}-{feature-title}` format (e.g., `AUTH-001-jwt-authentication/` and `AUTH-001-jwt-authentication.md`). The `{domain}/docs/` folder contains promoted copies with an auto-generated `_index.md`. See `common/backlog.md` for folder naming rules and `documentation/feature-docs.md` for promotion rules.

**CRITICAL RULES**:
- Application code: Workspace root (NEVER in aidlc-docs/)
- Documentation: aidlc-docs/ only
- Project structure: See code-generation.md for patterns by project type

**`_shared/` vs unit-specific paths**: See `common/backlog.md` § "When to Use `_shared/` vs Unit-Specific Paths". Default: use unit-specific paths unless cross-domain.

---

# Project Configuration

## Phase Structure

```
Inception → Construction → Operations → Testing & Validation → Documentation
```

Five phases in the workflow:
- **Phase 1**: Inception — planning, requirements, architectural decisions
- **Phase 2**: Construction — detailed design, code generation, component testing
- **Phase 3**: Operations — deployment configuration (placeholder)
- **Phase 4**: Testing & Validation — integration testing, regression, contract validation
- **Phase 5**: Documentation & Consolidation — feature docs, impact scan, backlog update

## Project-Specific Rules

```
Extensions:        @.aidlc-rule-details/extensions/project/
Documentation:     @.aidlc-rule-details/extensions/documentation/
```

- `extensions/project/` — Team-specific conventions (folder structure, API design, naming, testing)
- `extensions/documentation/` — Documentation standards (doc-creation.md, doc-review.md)

## Project Anchors (loaded during Inception)

```
Anchor map:        @aidlc-docs/anchor-map.md (contains knowledge base location and domain mappings)
Master backlog:    @aidlc-docs/aidlc-backlog.md
Domain backlog:    @aidlc-docs/{domain}/aidlc-backlog.md
Prior session:     @aidlc-docs/{domain}/{unit}/session-summary.md
```

During Workspace Detection, load:
- Anchor map to find the knowledge base location and domain anchor documents
- Master backlog for project-wide state
- Domain backlog for unit sequence in the active domain
- Prior session summary for context continuity

**Audit Log Management** (context optimization + archival):
- Do NOT load the entire `aidlc-docs/audit.md` into context at session start
- Load only the LAST 10 entries if needed for debugging or session recovery
- `audit.md` contains current + last 4 sessions only (5 sessions max)
- Older sessions are archived to `aidlc-docs/audit-archive/audit-{YYYY-MM}.md`
- At session START: Add session boundary marker (see `common/audit-archive.md`)
- At session END: **MANDATORY** archival check (enforced by `common/session-summary.md`):
  - Count sessions: `grep -c "^## Session:" aidlc-docs/audit.md`
  - If > 5 sessions: Archive oldest to monthly file, keep only 5 most recent
  - See `common/audit-archive.md` for complete procedure
- Archives are never loaded unless explicitly requested for historical troubleshooting

**Note**: The knowledge base location (where your planning/architecture docs live) is configured in `anchor-map.md` during project initialization. Do NOT hardcode paths like `docs/` — always read the configured location from anchor-map.md.

## Commit Convention

```
feat({domain}): {description} ({UNIT-ID})
docs(aidlc): {UNIT-ID} complete — session summary, backlog, feature docs updated
```

Two commits per unit:
1. **Code commit**: The implementation work
2. **Docs commit**: Session summary, backlog updates, feature documentation
