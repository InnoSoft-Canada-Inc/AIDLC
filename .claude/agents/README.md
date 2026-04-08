# AI-DLC Agents

This directory contains Claude Code agents that provide specialized capabilities for your AI-DLC workflow. Unlike skills (which are quick, single-task commands), agents are designed for **persistent, stateful operation** across multiple interactions.

## Available Agents

### `/verify-agent` - Plan Verification Agent

**Purpose**: Validates generated plans against established project documentation at AIDLC approval gates.

**Why it exists**: During AIDLC workflows, the main session's context window fills with implementation details. The verify-agent runs in a **separate session**, keeping planning docs loaded and available for consistent verification without competing for context space.

**Key features**:
- Auto-discovers project structure from `anchor-map.md` and `aidlc-state.md`
- Validates against technical guidelines, design guidelines, and requirements
- Tracks approvals within a session to detect inter-unit drift
- Enforces enabled extensions (security baseline, compliance, UI)
- Works with any AIDLC-enabled project

**See**: [verify-agent.md](verify-agent.md) for full documentation.

---

## Agents vs Skills

| Aspect | Skills | Agents |
|--------|--------|--------|
| **Session** | Run in main session | Run in separate session |
| **State** | Stateless (one-shot) | Stateful (maintains context) |
| **Context** | Shares main context window | Has dedicated context window |
| **Use case** | Quick tasks, lookups | Persistent analysis, verification |
| **Invocation** | `/skill-name` | `@agent-name` |

## Two-Session Workflow

The recommended workflow for complex AIDLC projects:

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

[Fix and continue...]
```

### Benefits
- **Context isolation**: Planning docs don't crowd implementation context
- **Consistent verification**: Same knowledge base for all approval gates
- **Drift detection**: Agent remembers prior approvals in its session

### Tips
- Initialize verify-agent at session start, before doing any AIDLC work
- Use absolute paths when switching between sessions
- Run `@verify-agent status` to see approval history
- Run `@verify-agent reload` if planning docs change

## Creating Custom Agents

Agents follow this structure:

```markdown
# Agent Name

Description of what the agent does.

## Configuration

\`\`\`yaml
name: agent-name
description: What it does and when to use it
allowed-tools:
  - Read
  - Glob
  - Grep
  # Limited tool access for safety
model: sonnet  # or haiku for faster responses
\`\`\`

## Behavior

### On Initialization
What happens when the agent starts...

### On [Action Type]
How the agent responds to different requests...

## Commands Reference
| Command | Description |
|---------|-------------|
| `@agent-name initialize` | Start the agent |
| `@agent-name <action>` | Perform an action |
```

## Related Documentation

- [Skills README](../skills/README.md) - Quick commands for common tasks
- [GETTING_STARTED.md](../../GETTING_STARTED.md) - Framework setup
- [Claude Code Agents](https://docs.anthropic.com/en/docs/claude-code/agents) - Anthropic documentation
