# AI-DLC Skills

This directory contains Claude skills that enhance your AI-DLC workflow experience. Skills are invoked using `/skill-name` commands and provide quick access to common tasks.

## Available Skills

### Workflow Management

#### `/aidlc-status` - Current State Overview
**Purpose**: Show your current position in the AI-DLC workflow

**When to use**:
- Starting a work session
- Returning after a break
- Checking what you're currently working on

**What it shows**:
- Active unit ID and description
- Current phase and stage
- Exact next step
- Blocked units (if any)
- Overall progress through phases

**Example**:
```
/aidlc-status
```

---

### Documentation

#### `/doc-search` - Documentation Search
**Purpose**: Search across all AI-DLC generated documentation

**When to use**:
- Looking for past decisions
- Finding API contracts or data models
- Locating requirements or user stories
- Understanding previous implementation choices

**What it searches**:
- Feature documentation
- Requirements and user stories
- Functional designs
- Session summaries
- Backlog entries

**Example**:
```
/doc-search JWT authentication
/doc-search user data model
/doc-search caching decision
```

---

#### `/feature-summary` - Quick Feature Overview
**Purpose**: Get a concise summary of any completed feature

**When to use**:
- Understanding what a feature does
- Reviewing past work
- Onboarding to existing features
- Quick reference before making related changes

**What it shows**:
- High-level overview (2-3 sentences)
- Key architecture decisions
- API contracts and interfaces
- Data model changes
- How to test/use it
- Known limitations

**Example**:
```
/feature-summary AUTH-001
/feature-summary user authentication
```

---

### Documentation Sync

#### `/sync-docs` - External Documentation Sync
**Purpose**: Sync feature docs to a shared docs repo or external knowledge base after completing a unit

**When to use**:
- After completing a unit of work
- When external docs need to reflect recent AIDLC feature work
- To check cross-project documentation impact
- Periodically to keep shared docs in sync

**What it does**:
- Syncs feature docs from `aidlc-docs/` to an external docs repo (configured in anchor-map.md)
- Detects cross-project impacts (API changes, auth changes, terminology)
- Creates handoff documents for breaking cross-project changes
- Validates all references after every edit
- Tracks sync state to prevent duplicate work

**First run**: Guides you through setup (shared repo path, domain-to-folder mapping, cross-project references). Configuration is stored in `anchor-map.md` under `## External Docs Configuration`.

**Example**:
```
/sync-docs
# Syncs the current/last completed unit's docs to external locations
```

---

### Git & Version Control

#### `/smart-commit` - Commit Message Generator
**Purpose**: Generate properly formatted AI-DLC commit messages

**When to use**:
- Committing code changes
- Committing documentation updates
- Enforcing commit conventions
- Unsure about commit message format

**What it does**:
- Analyzes staged git changes
- Determines appropriate commit type (feat/fix/docs/refactor/test/chore)
- Includes domain scope and UNIT-ID
- Follows AI-DLC two-commit pattern
- Warns about mixed changes

**Commit formats**:
- Code: `feat(domain): description (UNIT-ID)`
- Docs: `docs(aidlc): UNIT-ID complete — details`
- Fixes: `fix(domain): description (UNIT-ID)`

**Example**:
```
# Stage your changes first
git add src/auth/jwt.js

# Generate commit message
/smart-commit
```

---

### Project Lifecycle

#### `/reset` - AIDLC Project Reset
**Purpose**: Safely reset AIDLC project state for a fresh start

**When to use**:
- Testing/learning and want a clean slate
- Switching to a different project in a centralized AIDLC install
- Project complete, want to archive and start fresh
- Initialization went wrong, want to redo it

**What it offers**:
- **Reset units** — Clear unit work, keep project config (anchor-map, extensions, lessons)
- **Reset project** — Full clean slate, re-initialization required
- **Archive & reset** — Archive to `aidlc-docs-archive/{timestamp}/`, then full reset

**Safety features**:
- Warns if an active unit is in progress
- Offers to run `/sync-docs` before clearing if external docs are configured
- Option B requires typing "RESET" to confirm
- Option C verifies archive before deleting originals
- Never touches application code, CLAUDE.md, or .aidlc-rule-details/

**Example**:
```
/reset
```

---

### Framework Customization

#### `/customize` - AIDLC Framework Customizer
**Purpose**: Safely modify the AI-DLC framework with cascading updates

**When to use**:
- Adding a custom extension (compliance rules, hooks, validation)
- Modifying an existing rule file
- Adding a new stage to a phase
- Adding an entirely new phase
- Adjusting CLAUDE.md workflow behavior
- Checking framework consistency after manual edits

**What it does**:
- Presents an interactive menu of customization options
- Scaffolds new files using correct templates and patterns
- Makes all cascading updates (CLAUDE.md, process-overview, tracks, etc.)
- Runs consistency validation after every change
- Warns about teams overlay impacts

**Example**:
```
/customize
# Then select what you want to do:
# A) Add extension, B) Modify rule, C) Add stage, D) Add phase, E) Adjust CLAUDE.md, F) Validate
```

---

### Code Navigation

#### `/find-definition` - Code Definition Finder
**Purpose**: Quickly find where classes, functions, or variables are defined

**When to use**:
- Navigating unfamiliar code
- Understanding implementation details
- Finding where something is declared
- Exploring the codebase

**What it finds**:
- Class definitions
- Function/method definitions
- Variable/constant declarations
- Interface/type definitions
- Component definitions (React, Vue, etc.)

**Supports**:
- JavaScript/TypeScript
- Python
- Java/C#
- Go
- And more...

**Example**:
```
/find-definition UserService
/find-definition authenticateUser
/find-definition JWT_SECRET
```

---

### Frontend Development

#### `/frontend-design` - Distinctive Frontend Interfaces
**Purpose**: Create production-grade frontend interfaces with exceptional design quality

**When to use**:
- Building web components, pages, or applications
- Creating landing pages or dashboards
- Designing React/Vue components
- Styling or beautifying web UI
- When you want distinctive, memorable design (not generic)

**What it provides**:
- Bold, intentional aesthetic direction
- Production-grade working code (HTML/CSS/JS, React, Vue, etc.)
- Distinctive typography and color choices
- Thoughtful animations and micro-interactions
- Unexpected layouts and spatial composition
- Visual depth through backgrounds and textures

**Design philosophy**:
- Avoids generic "AI slop" aesthetics
- Commits to clear conceptual direction
- Makes unexpected, memorable choices
- Matches complexity to aesthetic vision
- Exceptional attention to detail

**Example**:
```
/frontend-design
# Then describe what you want to build:
"Create a landing page for a minimalist productivity app"
"Build a dashboard component for analytics data"
"Design a React component for a product card with hover effects"
```

---

## How Skills Work

### Invocation
Skills are invoked using slash commands:
```
/skill-name [optional arguments]
```

### Context Awareness
Skills are designed to be AI-DLC aware:
- They understand the framework's directory structure
- They read and parse AI-DLC artifacts correctly
- They follow framework conventions and principles

### Non-Invasive
Skills follow AI-DLC principles:
- Read-only operations (no accidental modifications)
- Simple, focused functionality
- Clear, actionable output
- Framework-aware but not framework-dependent

## Quick Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `/aidlc-status` | Show workflow state | `/aidlc-status` |
| `/doc-search {query}` | Search documentation | `/doc-search JWT` |
| `/feature-summary {unit}` | Summarize feature | `/feature-summary AUTH-001` |
| `/smart-commit` | Generate commit message | `/smart-commit` |
| `/find-definition {term}` | Find code definition | `/find-definition UserService` |
| `/frontend-design` | Create distinctive UI | `/frontend-design` |
| `/customize` | Customize AIDLC framework | `/customize` |
| `/sync-docs` | Sync docs to external repo | `/sync-docs` |
| `/reset` | Reset AIDLC project state | `/reset` |

## Tips

1. **Combine skills**: Use `/aidlc-status` to find your current unit, then `/feature-summary` to review it

2. **Search first**: Use `/doc-search` before asking general questions - the answer might already be documented

3. **Commit often**: Use `/smart-commit` to maintain clean, conventional commit history

4. **Navigate efficiently**: Use `/find-definition` instead of manual file searching

5. **Status checks**: Run `/aidlc-status` at the start of each session to orient yourself

## Skill Details

For detailed information about each skill including edge cases, advanced usage, and implementation notes, see the individual SKILL.md files in each skill's directory:

- [aidlc-status/SKILL.md](aidlc-status/SKILL.md)
- [doc-search/SKILL.md](doc-search/SKILL.md)
- [feature-summary/SKILL.md](feature-summary/SKILL.md)
- [smart-commit/SKILL.md](smart-commit/SKILL.md)
- [find-definition/SKILL.md](find-definition/SKILL.md)
- [frontend-design/SKILL.md](frontend-design/SKILL.md)
- [customize/SKILL.md](customize/SKILL.md)
- [sync-docs/SKILL.md](sync-docs/SKILL.md)
- [reset/SKILL.md](reset/SKILL.md)

## Agents (Stateful, Separate Session)

For persistent, stateful operations that benefit from a dedicated context window, see the **agents** directory:

- [verify-agent](../agents/verify-agent.md) - Plan verification at AIDLC approval gates

Agents run in a **separate Claude Code session** and maintain state across interactions. See [agents/README.md](../agents/README.md) for details.

## Related Documentation

- [Agents README](../agents/README.md) - Persistent agents for complex workflows
- [Claude Code Skills Documentation](https://code.claude.com/docs/en/skills)
- [GETTING_STARTED.md](../../GETTING_STARTED.md#optional-skills-developer-productivity) - Skills overview
- [README.md](../../README.md#skills-for-developer-productivity) - Framework integration

## Creating Custom Skills

Want to create your own AI-DLC skills? Each skill follows this structure:

```markdown
---
name: skill-name
description: What it does and when to use it (include trigger phrases)
---

# Skill Title

Instructions for Claude on how to execute this skill...
```

See the [Anthropic Skills Guide](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf) for detailed information on creating skills.
