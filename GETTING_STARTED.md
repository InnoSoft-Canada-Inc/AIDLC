# Getting Started with Orbit AI-DLC

Get up and running in under 5 minutes.

---

## 1. Setup for Claude Code

Orbit AI-DLC uses Claude Code's project memory file (`CLAUDE.md`) to implement its intelligent workflow.

The commands below assume you extracted the zip to your `Downloads` folder. If you used a different location, replace `Downloads` with your actual folder path.

### Copy Files to Your Project

**Unix/Linux/macOS:**

```bash
cp ~/Downloads/orbit-aidlc-0.1.8-beta/CLAUDE.md ./CLAUDE.md
mkdir -p .aidlc-rule-details
cp -R ~/Downloads/orbit-aidlc-0.1.8-beta/.aidlc-rule-details/* .aidlc-rule-details/
mkdir -p .claude
cp -R ~/Downloads/orbit-aidlc-0.1.8-beta/.claude/* .claude/
```

**Windows PowerShell:**

```powershell
Copy-Item "$env:USERPROFILE\Downloads\orbit-aidlc-0.1.8-beta\CLAUDE.md" ".\CLAUDE.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"
Copy-Item "$env:USERPROFILE\Downloads\orbit-aidlc-0.1.8-beta\.aidlc-rule-details\*" ".aidlc-rule-details\" -Recurse
New-Item -ItemType Directory -Force -Path ".claude"
Copy-Item "$env:USERPROFILE\Downloads\orbit-aidlc-0.1.8-beta\.claude\*" ".claude\" -Recurse
```

**Windows CMD:**

```cmd
copy "%USERPROFILE%\Downloads\orbit-aidlc-0.1.8-beta\CLAUDE.md" ".\CLAUDE.md"
mkdir .aidlc-rule-details
xcopy "%USERPROFILE%\Downloads\orbit-aidlc-0.1.8-beta\.aidlc-rule-details" ".aidlc-rule-details\" /E /I
mkdir .claude
xcopy "%USERPROFILE%\Downloads\orbit-aidlc-0.1.8-beta\.claude" ".claude\" /E /I
```

**Verify Setup:**

1. Start Claude Code in your project directory (VS Code extension or CLI: `claude`)
2. Ask Claude: "What instructions are currently active in this project?"
3. You should see confirmation that CLAUDE.md is loaded

**Directory Structure:**

```
<my-project>/
├── CLAUDE.md                      # Core workflow (solo mode)
├── CLAUDE-TEAMS.md                # Agent Teams workflow (optional)
├── .aidlc-rule-details/           # Shared rule details
│   ├── common/
│   ├── inception/
│   ├── construction/
│   ├── operations/
│   ├── testing/
│   ├── documentation/
│   └── extensions/
├── .aidlc-rule-details-teams/     # Agent Teams overrides (optional)
│   ├── common/
│   ├── construction/
│   ├── testing/
│   └── documentation/
└── .claude/
    ├── skills/
    └── agents/
```

---

## 2. Initialize

Open your project in VSCode with Claude Code and run:

```
Using AI-DLC, initialize project
```

### If You Have Existing Planning Docs (Brownfield)

**AI-DLC will automatically detect** planning documentation if your project has:

- 10+ markdown files in common locations (docs/, documentation/, specs/, planning/), OR
- 10,000+ total lines of documentation

**When detected, AI will**:

1. Suggest initialization workflow (avoids redundant re-planning)
2. Auto-extract technical stack from your docs (frameworks, databases, languages, etc.)
3. Auto-detect domains from directory structure and file naming patterns
4. Extract requirements during Inception (skip redundant questions)

**Result**: 30-90 minutes saved vs manual specification.

**Important**: This brownfield support is for **planning documentation** (architecture docs, design specs, technical overviews), not full codebase reverse engineering. If you have an existing codebase without planning docs, either create planning docs first or use the greenfield flow.

**Preventing doc drift**: At the end of Full/Lightweight track units, you'll be offered to promote feature documentation to your knowledge base (skip/copy/merge/link). Configure defaults in `aidlc-docs/anchor-map.md` under `Knowledge Base Promotion Preference`.

### If Your Docs Live in an MCP Server

If your documentation is in Confluence, Notion, or another system with an MCP server:

1. Select **Option B (MCP server)** during initialization
2. Provide the MCP server name (e.g., `confluence-mcp`, `notion-mcp`)
3. Optionally provide a query prefix (e.g., "MyProject architecture")

The AI will query the MCP server on-demand instead of reading local files. Results are cached for offline resilience.

**Note**: Requires the MCP server to be configured in your IDE/editor settings.

### If You Don't Have Planning Docs (Greenfield)

You'll be asked:

1. **Where are your planning docs?** — Choose local path, MCP server, or `none`
2. **Technical guidelines?** — Optionally create a template or provide path

Both answers are saved permanently.

---

## 3. Start Building

```
Using AI-DLC, [describe what you want to build]
```

The workflow automatically selects one of three tracks:

| Track       | Triggers                        | What Happens                                          |
| ----------- | ------------------------------- | ----------------------------------------------------- |
| Full        | "new feature", "new API"        | All 5 phases, full ceremony                           |
| Lightweight | "refactor", "update", "improve" | Condensed workflow                                    |
| Hotfix      | "bug", "fix", "broken"          | Autonomous diagnosis → Root cause fix → Verify → Done |

**Brownfield optimization**: If planning docs were configured during initialization, the AI will extract requirements from them instead of asking from scratch, saving 5-50 minutes per feature.

Documentation is mandatory on all tracks.

---

## Optional: Agent Teams (Experimental)

For multi-unit features, you can use Claude Code Agent Teams to run units in parallel. A lead session handles planning (Inception), then spawns teammate sessions that each own a full unit from Construction through Documentation.

### Prerequisites

- Claude Code v2.1.32+
- Enable the experimental flag:
  ```json
  // In settings.json or environment
  { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
  ```

### Additional Setup

Copy the Agent Teams files alongside your standard setup:

**Unix/Linux/macOS:**

```bash
cp ~/Downloads/orbit-aidlc-0.1.8-beta/CLAUDE-TEAMS.md ./CLAUDE-TEAMS.md
mkdir -p .aidlc-rule-details-teams
cp -R ~/Downloads/orbit-aidlc-0.1.8-beta/.aidlc-rule-details-teams/* .aidlc-rule-details-teams/
```

**Windows PowerShell:**

```powershell
Copy-Item "$env:USERPROFILE\Downloads\orbit-aidlc-0.1.8-beta\CLAUDE-TEAMS.md" ".\CLAUDE-TEAMS.md"
New-Item -ItemType Directory -Force -Path ".aidlc-rule-details-teams"
Copy-Item "$env:USERPROFILE\Downloads\orbit-aidlc-0.1.8-beta\.aidlc-rule-details-teams\*" ".aidlc-rule-details-teams\" -Recurse
```

**Windows CMD:**

```cmd
copy "%USERPROFILE%\Downloads\orbit-aidlc-0.1.8-beta\CLAUDE-TEAMS.md" ".\CLAUDE-TEAMS.md"
mkdir .aidlc-rule-details-teams
xcopy "%USERPROFILE%\Downloads\orbit-aidlc-0.1.8-beta\.aidlc-rule-details-teams" ".aidlc-rule-details-teams\" /E /I
```

### Usage

Use `CLAUDE-TEAMS.md` as your project instructions instead of `CLAUDE.md`. The workflow is identical through Inception. After Units Generation, the lead will offer to spawn teammates for parallel execution.

**How it works:**

1. Lead runs Inception (planning with you) — same as solo mode
2. After Units Generation, lead asks: "Use Agent Teams for parallel execution?"
3. If yes → teammates spawn with worktree isolation, each owning one unit
4. Approvals cascade: Verify-Agent (Tier 1) → Lead (Tier 2) → You (Tier 3)
5. Most approvals (~80%) are handled automatically — you only review critical decisions
6. After all units complete, the lead merges branches and runs cross-unit testing

**Solo mode is unaffected.** If you use `CLAUDE.md`, no team behavior activates. All team logic lives in `CLAUDE-TEAMS.md` and `.aidlc-rule-details-teams/`.

See [AIDLC_AGENT_TEAMS_GUIDE.md](AIDLC_AGENT_TEAMS_GUIDE.md) for the full guide, diagrams, and known limitations.

---

## Optional: Planning Mode

Plan a feature before committing to build:

```
Using AI-DLC, plan user authentication
```

Runs Inception only, saves the plan to your docs folder. Build later when ready.

---

## Optional: Technical Guidelines

Define project-wide standards that the AI loads every session:

```
Using AI-DLC, create technical guidelines with NextJS v16.1.4, React 19, shadcn/ui, TypeScript strict mode
```

The AI generates a structured guidelines file and treats it as immutable constraints.

Update anytime with: `Using AI-DLC, update technical guidelines`

---

## Optional: Custom Extensions

Extend AIDLC with business-specific features without modifying core files.

### Quick Setup

1. **Copy an example**:

   ```bash
   # Example: Department-level documentation
   cp .aidlc-rule-details/examples/custom-extensions/dept-docs/dept-docs.md \
      .aidlc-rule-details/extensions/custom/
   ```

2. **Enable the extension**:
   Edit `.aidlc-rule-details/extensions/custom/README.md`:

   ```markdown
   ## Active Custom Extensions

   - [x] dept-docs.md - Department-level documentation
   ```

3. **Use it**:
   Next time you run `Using AI-DLC...`, the extension loads automatically.

### Common Use Cases

- **Department Documentation**: Auto-generate sales briefs, marketing messaging, support guides
- **Approval Gates**: Require manager sign-off before deploying
- **Tool Integration**: Create Jira tickets, post to Slack when units complete
- **Compliance**: Add industry-specific validation (SOX, HIPAA, etc.)

### Learn More

- **Quick start**: [CUSTOMIZATION.md](CUSTOMIZATION.md) (root level)
- **Detailed guide**: [.aidlc-rule-details/CUSTOMIZATION_DETAILED.md](.aidlc-rule-details/CUSTOMIZATION_DETAILED.md)
- **Working examples**: [.aidlc-rule-details/examples/custom-extensions/](.aidlc-rule-details/examples/custom-extensions/)

---

## Optional: Skills (Developer Productivity with Claude)

AI-DLC includes helpful skills that work with Claude (Claude Code, Claude.ai) to boost your productivity:

| Skill              | Purpose                          | When to Use                                                  |
| ------------------ | -------------------------------- | ------------------------------------------------------------ |
| `/aidlc-status`    | Show current workflow state      | Starting work, checking progress                             |
| `/doc-search`      | Search AI-DLC documentation      | Finding past decisions, APIs, data models                    |
| `/feature-summary` | Quick feature overview           | Understanding completed features                             |
| `/smart-commit`    | Generate commit messages         | Committing code following conventions                        |
| `/find-definition` | Find code definitions            | Navigating codebase, understanding code                      |
| `/frontend-design` | Create distinctive UI interfaces | Building web components, pages, apps with exceptional design |

**Skills work with Claude** - invoke them with `/skill-name` in Claude Code or when chatting with Claude.

**Examples:**

```
/aidlc-status                    # Show what I'm currently working on
/doc-search JWT authentication   # Find all docs about JWT
/feature-summary AUTH-001        # Summarize authentication feature
/smart-commit                    # Generate proper commit message
/find-definition UserService     # Find where UserService is defined
/frontend-design                 # Create distinctive, production-grade UI
```

See [.claude/skills/](.claude/skills/) for detailed documentation on each skill.

---

## Optional: Verify Agent (Context-Isolated Validation)

For complex AIDLC workflows, the main session's context window can fill up with implementation details. The **verify-agent** runs in a separate Claude Code session, keeping your planning docs loaded for consistent validation at approval gates.

**Two-session workflow:**

```
Session 1 (Main)                    Session 2 (Verify)
----------------                    ------------------
Using AI-DLC, implement auth        @verify-agent initialize

[Requirements Analysis]
  -> Generate requirements.md
                                    @verify-agent requirements.md
                                    -> APPROVED

[Code Generation]
  -> Generate code-gen-plan.md
                                    @verify-agent code-gen-plan.md
                                    -> NEEDS CHANGES (drift detected)
```

**Key features:**

- Auto-discovers project structure from `anchor-map.md` and `aidlc-state.md`
- Validates against technical/design guidelines and requirements
- Tracks approvals within its session to detect inter-unit drift
- Enforces enabled security/compliance extensions
- Provides decisive verdicts with ready-to-paste fix prompts

**Quick start:**

```bash
# In Session 2 (separate Claude Code window/terminal):
@verify-agent initialize

# When you need to verify something from Session 1:
@verify-agent /absolute/path/to/aidlc-docs/AUTH/AUTH-001/requirements.md
```

**When to use:**

- Complex multi-unit features where context preservation matters
- Projects with extensive technical/design guidelines
- When you want independent validation of generated plans
- When you're seeing context compaction affecting your workflow quality

See [.claude/agents/](.claude/agents/) for full documentation.

---

## Optional: External Testing (Reduce Bias)

During Testing & Validation, comprehensive test scenarios are automatically generated and stored:

**Location**: `aidlc-docs/{domain}/{unit}/testing/integration-test-scenarios.md`

**Use scenarios for**:

- Testing with different LLM model (e.g., GPT-4, different Claude session)
- Human manual testing following scenarios
- External QA team test implementation
- Future regression testing after refactoring

**To implement tests from scenarios**:

```
Using AI-DLC, implement integration tests from scenarios for {UNIT-ID}
```

**Why this reduces bias**: Tests written by different agent/person who didn't see implementation code = more comprehensive coverage, fewer blind spots.

---

## Multi-Developer Teams

Working with 3+ developers on the same codebase?

See **[AIDLC_TEAM_GUIDE.md](AIDLC_TEAM_GUIDE.md)** for git worktrees strategy and coordination patterns to eliminate AIDLC state conflicts.

For AI-driven parallel development, see **[AIDLC_AGENT_TEAMS_GUIDE.md](AIDLC_AGENT_TEAMS_GUIDE.md)**.

---

## What's Next

- **[README.md](README.md)** — Full documentation, workflow details, project structure
- **[CLAUDE.md](CLAUDE.md)** — The workflow definition (loaded by the AI)
- **[AIDLC_TEAM_GUIDE.md](AIDLC_TEAM_GUIDE.md)** — Multi-developer coordination guide
- **[AIDLC_AGENT_TEAMS_GUIDE.md](AIDLC_AGENT_TEAMS_GUIDE.md)** — AI-driven parallel development guide

## Key Principles

The AI follows these principles during code generation:

- **Simplicity First** — Prefer the simplest _correct_ solution; minimal code impact does NOT mean workarounds or hacks
- **No Over-Engineering** — Don't add features not requested, but DO implement what's needed properly
- **Root Cause Fixes** — Address underlying issues, not symptoms (applies to all tracks, enforced in Hotfix)
- **Self-Improvement** — Learns from corrections via `aidlc-docs/lessons.md`

---

## Quick Reference

| Command                                                  | Purpose                             |
| -------------------------------------------------------- | ----------------------------------- |
| `Using AI-DLC, initialize project`                       | First-time setup                    |
| `Using AI-DLC, [task]`                                   | Start a unit of work                |
| `Using AI-DLC, plan [feature]`                           | Plan without building               |
| `Using AI-DLC, create technical guidelines with [specs]` | Create project standards            |
| `Using AI-DLC, update technical guidelines`              | Modify project standards            |
| `Using AI-DLC, re-scan knowledge base`                   | Update domain map after adding docs |
| `Using AI-DLC, refresh knowledge base cache`             | Refresh MCP cache (if using MCP)    |
