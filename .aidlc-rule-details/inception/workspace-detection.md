# Workspace Detection

**Purpose**: Determine workspace state and check for existing AI-DLC projects

## Step 0: Check for Project Initialization

**MANDATORY**: Before any other workspace detection steps, check if the project has been initialized.

Check if `aidlc-docs/anchor-map.md` exists:
- **If exists AND has a Knowledge Base Location configured**: Project is initialized, proceed to Step 1
- **If exists BUT Knowledge Base Location is placeholder/empty**: Project initialization incomplete
- **If not exists**: Project has not been initialized → proceed to **Step 0.5: Detect Existing Planning Docs**

---

## Step 0.5: Detect Existing Planning Docs (NEW)

**Purpose**: Detect existing planning documentation and guide user to initialization workflow instead of proceeding with redundant planning.

**ONLY execute this step if `aidlc-docs/anchor-map.md` does NOT exist** (project not initialized).

### 0.5.1 Scan for Planning Doc Directories

Check for large planning documentation directories in common locations:
- `docs/`, `documentation/`, `specs/`, `design/`, `architecture/`, `planning/`

**Heuristic**: Directory qualifies as "extensive planning docs" if:
- Contains **10+ markdown files** OR
- Contains **10,000+ total lines** across all markdown files

### 0.5.2 Planning Doc Detection Logic

| Condition | Action |
|-----------|--------|
| **Extensive planning docs found** | Proceed to Step 0.5.3 (suggest initialization) |
| **No extensive planning docs** | Proceed to Step 0.5.4 (standard initialization prompt) |

### 0.5.3 Planning Docs Detected - Suggest Initialization

**If extensive planning docs detected**, analyze user's request for initialization intent:

**Check for initialization-intent phrases**:
- "plan out", "create specs", "set up", "organize", "get started", "come up with a plan", "technical specs"

**If initialization intent detected** (user request contains these phrases + planning docs exist):

```markdown
## 📚 Existing Planning Documentation Detected

I found extensive planning documentation in your project:
- **Location**: {detected directory, e.g., docs/}
- **Files Found**: {count} markdown documents
- **Total Content**: ~{line_count} lines

Based on your request ("{brief excerpt of user request}") and these existing docs, it appears you want to **organize your existing planning work** into AI-DLC structure rather than create new planning docs.

**Recommended Action**: Initialize AI-DLC configuration to use your existing planning docs

This will:
1. Map your existing planning docs to AI-DLC's knowledge base
2. Extract technical stack from your docs (auto-generate TECHNICAL_GUIDELINES.md)
3. Detect domains from your doc structure (create domain backlogs)
4. Enable AI-DLC to implement based on your existing plans

**What would you like to do?**

A) Initialize AI-DLC with existing planning docs (Recommended - avoids redundant work)
B) Review existing docs first, then decide
C) Ignore existing docs and start fresh (Not recommended - creates duplication)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling**:
- **A**: Trigger initialization workflow with planning doc integration enabled (see `common/initialization.md`)
- **B**: Display list of detected files, then ask again
- **C**: Proceed to Step 0.5.4 (standard initialization prompt) - warn about duplication
- **X**: Clarify user intent

**If NO initialization intent detected** (user request doesn't contain planning phrases):

Proceed to Step 0.5.4 (standard initialization prompt) - user may want to implement specific feature, not organize docs

### 0.5.4 Standard Initialization Prompt

**If project is NOT initialized** (and either no planning docs found, or planning docs found but user didn't express initialization intent):

```markdown
**Project Not Initialized**

This project has not been configured for AI-DLC yet. Before starting any unit of work,
you must run project initialization:

```
Using AI-DLC, initialize project
```

This one-time setup will:
1. Ask where your planning documents are located
2. Derive a domain structure from those documents
3. Create the anchor map and backlog files

Would you like to run initialization now? (Y/N)
```

**If user answers Y**: Trigger the initialization track (see `common/initialization.md`)
**If user answers N**: End the session gracefully

---

## Step 0.6: Load Self-Improvement Lessons

**Purpose**: Load lessons from prior sessions to avoid repeating mistakes.

**When to execute**: ALWAYS at session start, after project initialization check.

### 0.6.1 Check for Lessons File

Check if `aidlc-docs/lessons.md` exists:
- **If exists**: Load ENTIRE file into context (proceed to Step 0.6.2)
- **If not exists**: Create empty template (proceed to Step 0.6.3)

### 0.6.2 Load All Lessons

**MANDATORY**: Load the ENTIRE `aidlc-docs/lessons.md` file into context.

**Why load all lessons**:
- Lessons are minimal (just the actionable rules)
- Token cost is low (no verbose backstory)
- Having all rules in context prevents mistakes throughout the session
- No filtering needed - simplified format makes full load feasible

**Review process**:
- Load entire lessons.md file
- No need to present to user
- Log in audit.md: "Lessons: Loaded {count} rules from lessons.md"

### 0.6.3 Create Empty Lessons File (If Not Exists)

If `aidlc-docs/lessons.md` does not exist, create it with template:

```markdown
# Project Lessons Learned

**Purpose**: Actionable rules to prevent repeated mistakes.

**Format**: Each lesson contains ONLY the prevention rule - no backstory, no root cause analysis, no user feedback quotes. Just the rule.

---

## Lessons

(No lessons captured yet)
```

Log in audit.md: "Lessons: Created empty lessons.md template"

---

## Step 1: Parse External References (OPTIONAL)

**Purpose**: Extract any external ticket/issue references mentioned in the user's request for traceability.

**This step is OPTIONAL** — only executes if user mentions external references. The workflow proceeds normally if no references are mentioned.

**Scan user's initial request for patterns**:
- **Jira patterns**: `JIRA-\d+`, `[A-Z]+-\d+` (e.g., PROJ-1234)
- **ADO patterns**: `ADO-\d+`, `AB#\d+` (e.g., AB#12345)
- **GitHub patterns**: `#\d+`, `GH-\d+` (e.g., GH-456, #789)
- **Linear patterns**: `LIN-[A-Z]+-\d+` (e.g., LIN-ENG-123)
- **URLs**: Full URLs to Slack threads, Jira tickets, GitHub issues, etc.

**If external references found**, store temporarily for later use in aidlc-state.md:

```markdown
## External References (OPTIONAL - Only if mentioned by user)

- **Type**: [Jira/ADO/GitHub/Linear/Slack/Other]
- **Reference**: {extracted reference ID}
- **URL**: {full URL if available or can be inferred}
- **Mentioned In**: Initial user request
```

**If no external references found**, skip this section entirely.

**Examples**:

User says: `"Using AI-DLC: Implement JIRA-1234 - Add user export feature"`
→ Detected: `JIRA-1234` (Jira ticket)

User says: `"Using AI-DLC: Fix the bug from Slack thread https://workspace.slack.com/archives/C123/p456"`
→ Detected: Slack URL

User says: `"Using AI-DLC: Add user export feature"`
→ No external references detected, skip this section

---

## Step 2: Check for Existing AI-DLC Project

Check if `aidlc-docs/aidlc-state.md` exists:
- **If exists**: Resume from last phase (load context from previous phases)
- **If not exists**: Continue with new project assessment

## Step 3: Scan Workspace for Existing Code

**Determine if workspace has existing code:**
- Scan workspace for source code files (.java, .py, .js, .ts, .jsx, .tsx, .kt, .kts, .scala, .groovy, .go, .rs, .rb, .php, .c, .h, .cpp, .hpp, .cc, .cs, .fs, etc.)
- Check for build files (pom.xml, package.json, build.gradle, etc.)
- Look for project structure indicators
- Identify workspace root directory (NOT aidlc-docs/)

**Record findings:**
```markdown
## Workspace State
- **Existing Code**: [Yes/No]
- **Programming Languages**: [List if found]
- **Build System**: [Maven/Gradle/npm/etc. if found]
- **Project Structure**: [Monolith/Microservices/Library/Empty]
- **Workspace Root**: [Absolute path]
```

## Step 4: Determine Next Phase

**IF workspace is empty (no existing code)**:
- Set flag: `brownfield = false`
- Next phase: Requirements Analysis

**IF workspace has existing code**:
- Set flag: `brownfield = true`
- Check for existing reverse engineering artifacts in `aidlc-docs/_shared/reverse-engineering/`
- **IF reverse engineering artifacts exist**: Load them, skip to Requirements Analysis
- **IF no reverse engineering artifacts**: Next phase is Reverse Engineering

## Step 5: Create Initial State File

Create `aidlc-docs/aidlc-state.md`:

```markdown
# AI-DLC State Tracking

## Project Information
- **Project Type**: [Greenfield/Brownfield]
- **Start Date**: [ISO timestamp]
- **Current Stage**: INCEPTION - Workspace Detection

## Workspace State
- **Existing Code**: [Yes/No]
- **Reverse Engineering Needed**: [Yes/No]
- **Workspace Root**: [Absolute path]

## External References
(Optional - Only include if user mentioned external references in their request)

- **Type**: [Jira/ADO/GitHub/Linear/Slack/Other]
- **Reference**: {ticket/issue ID}
- **URL**: {full URL if available}
- **Mentioned In**: Initial user request

## Original Request
(Captured during Requirements Analysis - see common/task-alignment.md)

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Structure patterns**: See code-generation.md Critical Rules

## Stage Progress
[Will be populated as workflow progresses]
```

**Note**: The "External References" section is OPTIONAL. Only include it if external references were detected in Step 1. If none detected, omit this section entirely.

## Step 6: Load Project Context (Addition to Workflow)

**Purpose**: Load backlogs and prior session context to understand project state before planning begins.

### 5.1 Load Master Backlog

Check if `aidlc-docs/aidlc-backlog.md` exists:
- **If exists**: Read and parse to understand overall project state, domain structure, and cross-domain dependencies
- **If not exists**: Skip (project not yet initialized or first unit)

### 5.2 Load Anchor Map and Existing Domains

Load `aidlc-docs/anchor-map.md` to get the list of existing domains:
- Parse the Domain Anchor Map table
- Record all domain names for domain fit assessment

### 5.2.5 Load Project-Wide Guidelines (NEW)

**Purpose**: Load technical guidelines that apply to ALL sessions regardless of domain.

1. Check `aidlc-docs/anchor-map.md` for `## Project-Wide Guidelines` section
2. If `Technical Guidelines` path is configured:
   a. Validate file exists at specified path
   b. Load file contents
   c. Parse as immutable constraints
   d. Store in session context for ALL subsequent phases
3. If not configured: Skip (no error, guidelines are optional)

**Constraint Application**:
- **Version pinning** → Do not suggest alternative versions
- **Component standards** → Use specified libraries by default
- **Coding standards** → Follow conventions in all generated code
- **Hard constraints** → Never violate, even if user requests (explain and ask for explicit override)

**Record in aidlc-state.md**:
```markdown
## Technical Guidelines
- **Loaded**: [Yes/No]
- **Path**: {path if loaded}
- **Key Constraints**: [Brief summary of major constraints]
```

See `common/technical-guidelines.md` for complete guidelines system documentation.

### 5.2.6 Load Knowledge Base by Type

**Purpose**: Load planning documentation based on configured knowledge base type.

1. **Read Knowledge Base section** from `aidlc-docs/anchor-map.md`
2. **Determine Type** (default to `local` if Type field missing for backward compatibility)

**Type-specific loading**:

| Type | Loading Behavior |
|------|------------------|
| **local** | Read files from Location path (existing behavior, unchanged) |
| **mcp** | Query MCP server for documentation, cache results |

#### For Type=local (default):

Continue with existing behavior — read markdown files from the configured Location path.

#### For Type=mcp:

1. **Query MCP server** using configured server name from anchor-map.md
2. **Apply query prefix** if configured (prepend to all queries)
3. **Cache results** to `aidlc-docs/_shared/kb-cache/` for session resilience
4. **Log** connection status in aidlc-state.md

**MCP query pattern**:
```
Server: {configured MCP server name}
Query: "{query_prefix} list available documentation for {active domain}"
```

**If MCP connection fails**:
```markdown
⚠️ **MCP Connection Failed**

Could not connect to MCP server "{server_name}".

**Possible causes**:
- MCP server is not running
- Server name is incorrect
- Network/authentication issue

**Options**:
A) Retry connection
B) Use cached documentation (if available from previous session)
C) Continue without knowledge base documentation

[Answer]:
```

**Cache management**:
- Cache location: `aidlc-docs/_shared/kb-cache/`
- Cache files: `mcp-index.md`, `{domain}-docs.md`, `.cache-metadata.json`
- Cache validity: Warn if cache older than 24 hours
- Manual refresh: `Using AI-DLC, refresh knowledge base cache`

**Record in aidlc-state.md**:
```markdown
## Knowledge Base
- **Type**: {local|mcp}
- **Status**: {Connected|Cached|Offline}
- **Last Sync**: {timestamp}
- **Docs Available**: {count or list}
```

### 5.3 Assess Domain Fit

**MANDATORY**: Before determining the active domain, assess if the user's request fits an existing domain.

See `common/domain-management.md` for complete domain fit assessment rules.

**Assessment Process**:

1. **Analyze user request** against each existing domain from anchor map
2. **Evaluate fit indicators**:
   - Request relates to functionality described by domain's anchor doc
   - Request extends or modifies code likely owned by that domain
   - Request uses similar technology/patterns as existing domain units
3. **Evaluate no-fit indicators**:
   - Request introduces entirely new technology stack
   - Request is for a distinct functional area
   - No existing domain has related functionality

**Decision Matrix**:

| Scenario | Action |
|----------|--------|
| **Clear fit to one domain** | Set that as active domain, proceed to Step 5.4 |
| **Could fit multiple domains** | Ask for clarification (see domain-management.md) |
| **No existing domain fits** | Trigger new domain creation flow |
| **Uncertain** | Ask for clarification |

**If new domain creation is triggered**:

1. Propose a new domain name (lowercase, short, descriptive)
2. Present options to user: Approve / Rename / Use existing domain
3. On approval, execute domain creation actions (see domain-management.md):
   - Create `aidlc-docs/{domain}/` directory
   - Create `aidlc-docs/{domain}/aidlc-backlog.md`
   - Update `aidlc-docs/anchor-map.md` with new domain entry (no anchor doc)
   - Update `aidlc-docs/aidlc-backlog.md` master backlog
   - Log in `aidlc-docs/audit.md`
4. Proceed with the newly created domain as active domain

### 5.4 Load Domain Backlog

With the active domain determined (existing or newly created), check if `aidlc-docs/{domain}/aidlc-backlog.md` exists:
- **If exists**: Read to understand what units are complete, in progress, or blocked in this domain
- **If not exists**: Skip (first unit in this domain)

### 5.5 Load Prior Session Summary

Find the most recently completed unit in the active domain:
- Check `aidlc-docs/{domain}/` for unit directories
- Find the unit with Session Status = "Complete" and most recent Last Session date
- **If found**: Load `aidlc-docs/{domain}/{prior-unit}/session-summary.md` for context continuity
- **If not found**: Skip (first unit in this domain)

**Record loaded context:**
```markdown
## Project Context Loaded
- **Master Backlog**: [Loaded/Not Found]
- **Technical Guidelines**: [Loaded/Not Found] ({path if loaded})
- **Domain Fit**: [Existing: {domain} / New: {domain}]
- **Domain Backlog**: [Loaded/Not Found] ({domain})
- **Prior Session**: [Loaded/Not Found] ({prior-unit} if found)
```

---

## Step 7: Capture Git Rollback Anchor (Addition to Workflow)

**Purpose**: Record the git state at session start for potential rollback.

### 6.1 Capture Current Git HEAD

Execute: `git rev-parse HEAD`

Record the output as the Session Start Commit.

### 6.2 Create or Update Session Summary

Create `aidlc-docs/{domain}/{unit}/session-summary.md` with initial content:

```markdown
# Session Summary: {UNIT-ID}

## Identity
- **Domain**: {domain}
- **Unit**: {unit}
- **External Reference**: {extracted reference from Step 1 if any, or "None"}
- **Branch**: {current branch from git}
- **Current Phase**: INCEPTION
- **Current Stage**: Workspace Detection
- **Last Session**: {ISO timestamp}
- **Session Status**: Active
- **Track**: {To be determined after track selection}

## Git Anchors
- **Session Start Commit**: {captured git HEAD hash}
- **Session End Commit**: (pending)
- **Rollback Command**: `git reset --hard {session-start-hash}`

## Files Touched This Session
(none yet)

## Decisions Made
(none yet)

## Discovered (Not Yet Acted On)
(none yet)

## Exact Next Step
Complete workspace detection, then proceed to track selection and Inception.

## Open Questions / Blockers
- None
```

**Note**: If the session-summary.md already exists (resuming a paused unit), update the Session Status to "Active" and update the Last Session timestamp instead of creating new.

---

## Step 8: Present Completion Message

**For Brownfield Projects:**
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Brownfield project
• [AI-generated summary of workspace findings in bullet points]
• **Project Context**: [Master backlog loaded / Domain backlog loaded / Prior session loaded]
• **Git Anchor**: Session start commit captured
• **Next Step**: Proceeding to **Reverse Engineering** to analyze existing codebase...
```

**For Greenfield Projects:**
```markdown
# 🔍 Workspace Detection Complete

Workspace analysis findings:
• **Project Type**: Greenfield project
• **Project Context**: [Master backlog loaded / Domain backlog loaded / Prior session loaded]
• **Git Anchor**: Session start commit captured
• **Next Step**: Proceeding to **Requirements Analysis**...
```

## Step 9: Automatically Proceed

**MANDATORY**: After presenting the completion message, IMMEDIATELY proceed to the next phase WITHOUT waiting for user input.

- Present completion message (Step 8)
- **DO NOT WAIT** for user response
- **IMMEDIATELY** begin executing the next phase in the SAME response:
  - **Brownfield**: Reverse Engineering (if no existing artifacts) or Requirements Analysis (if artifacts exist)
  - **Greenfield**: Requirements Analysis

**Implementation**: After displaying the completion message, immediately load the next phase's rule file and begin executing Step 1 of that phase - all in the same response to the user.
