# Subagent Strategy

> **For patterns, examples, and best practices**, see [RULE_AUTHORING.md § Subagent Strategy Patterns](/.aidlc-rule-details/RULE_AUTHORING.md#subagent-strategy-patterns)

---

## MANDATORY Rule: One Task Per Subagent

Each subagent receives ONE focused task only. No multi-task subagents.

---

## Spawning Triggers

### ALWAYS Spawn Subagent For:

| Task Type | Trigger |
|-----------|---------|
| **Codebase exploration** | Multi-file pattern discovery |
| **Multi-file analysis** | Cross-service analysis |
| **Parallel research** | Independent research streams |
| **Pattern detection** | Finding usage patterns across codebase |
| **Test coverage analysis** | Analyzing untested code paths |
| **Dependency mapping** | Mapping imports and dependencies |

### CONSIDER Subagent For:

| Task Type | Spawn If... |
|-----------|-------------|
| **File reading** | More than 5 files need reading |
| **Grep/search** | Results likely exceed 50 matches |
| **Documentation review** | Multiple doc files need cross-referencing |
| **API exploration** | External API docs need fetching and analysis |

### KEEP IN MAIN CONTEXT:

| Task Type | Reason |
|-----------|--------|
| **User interaction** | Requires conversational context |
| **Decision making** | Needs full context |
| **Small edits** | Overhead exceeds benefit |
| **Sequential steps** | Each step depends on prior result |

---

## Subagent Type Mapping

| Subagent Type | Use For |
|---------------|---------|
| **Explore** | Codebase exploration, pattern discovery, file structure analysis |
| **Plan** | Design alternatives, architectural analysis, approach comparison |
| **General-Purpose** | Research, documentation analysis, complex queries |

---

## Return Data Requirements

Subagents MUST return **summaries only**, not raw context.

**Required Format**:
```markdown
## [Task Name] Summary

Found [N] [items]:
1. [Finding 1 with key file path]
2. [Finding 2 with key file path]
...

Key files:
- path/to/file1:line_range (description)
- path/to/file2:line_range (description)
```

**Prohibited**: Full file contents, verbose explanations, irrelevant details

---

## Main Agent Integration Rules

After subagent completion:

1. **Incorporate** key findings into session summary
2. **Discard** raw exploration data
3. **Reference** file paths for future reads (don't re-explore)
4. **Decide** next steps based on summary

---

## Parallel Execution Rule

When tasks are independent, spawn subagents in parallel using a single message with multiple Task tool calls.

**DO NOT** spawn subagents sequentially if they can run in parallel.

---

## Session Summary Integration

Update session summary with subagent findings:

```markdown
## Subagent Findings

### [Subagent Task]
**Key Findings**:
- [Summary point 1]
- [Summary point 2]

**Files Identified**:
- path/to/file1.ts
- path/to/file2.ts

**Next Steps**: [How this informs further work]
```

DO NOT include raw subagent output in session summary.

---

## MCP vs Subagent Decision Matrix

| Scenario | Use MCP | Use Subagent |
|----------|---------|--------------|
| External library docs | ✅ | ❌ |
| Local codebase exploration | ❌ | ✅ |
| API reference lookup | ✅ | ❌ |
| Pattern detection in code | ❌ | ✅ |
| Framework migration guides | ✅ | ❌ |
| Current best practices | ✅ | ❌ |
| Dependency mapping | ❌ | ✅ |

**Rule**: MCP for external knowledge, Subagent for local codebase work.

---

## MCP Context Budget Rules

When using MCP servers (e.g., Context7):

1. **Query specifically** — Not "Next.js documentation" but "How to configure middleware in Next.js 15"
2. **Summarize results** — Extract only relevant snippets
3. **Avoid redundant queries** — Don't re-fetch what's in context
4. **Prefer local knowledge** — If pattern exists in codebase, use subagent

### Citing MCP Sources

When MCP-fetched documentation influences design decisions, cite in **Decision Log** section:

```markdown
## Decision Log

### [Decision Name]
**Decision**: [What was decided]
**Alternatives Considered**: [Other options]
**Rationale**: [Why] (Context7 query, [date])
**Trade-offs**: [Accepted trade-offs]
```

---

## Project Documentation via MCP

When the project's Knowledge Base is configured as Type=mcp (see `anchor-map.md`), the AI queries an MCP server for project-specific documentation instead of reading local files.

### MCP Project Docs Decision Matrix

| Scenario | Approach |
|----------|----------|
| **Load documentation index** | Query MCP directly in main context |
| **Search for specific topic** | Query MCP with topic + query prefix |
| **Analyze multiple docs** | Spawn subagent to synthesize MCP results |
| **Cross-reference local code + MCP docs** | Main context orchestrates both sources |
| **Requirements extraction** | Query MCP, cache to `aidlc-docs/_shared/kb-cache/` |

### MCP Query Budget for Project Docs

1. **Query specifically** — "Requirements for auth module" not "all project requirements"
2. **Use query prefix** — Always prepend configured query prefix from anchor-map.md
3. **Cache results** — Store in `aidlc-docs/_shared/kb-cache/` for session resilience
4. **Avoid redundant queries** — Check cache before re-querying MCP
5. **Summarize for session** — Extract key points, don't dump full doc content

### Cache Strategy

| Scenario | Cache Behavior |
|----------|----------------|
| **First query** | Query MCP, cache result |
| **Subsequent queries (same topic)** | Use cache if < 24 hours old |
| **MCP unavailable** | Fall back to cache with warning |
| **Cache stale** | Warn user, offer refresh option |

**Cache location**: `aidlc-docs/_shared/kb-cache/`
**Manual refresh**: `Using AI-DLC, refresh knowledge base cache`

### Citation Format for MCP Project Docs

```markdown
## Source
- **Type**: MCP Server (Project Documentation)
- **Server**: {server_name}
- **Query**: "{query_prefix} {specific query}"
- **Retrieved**: {timestamp}
- **Cached**: {cache file path}
```

---

## Phase-Specific Subagent Usage

| Phase | Stage | Subagent Usage |
|-------|-------|----------------|
| **Inception** | Workspace Detection | Spawn Explore for large codebases |
| **Inception** | Reverse Engineering | Spawn multiple Explore in parallel |
| **Inception** | Requirements Analysis | Keep in main context (user interaction) |
| **Inception** | Application Design | Spawn Plan for architecture alternatives |
| **Construction** | Functional Design | Keep in main context (sequential decisions) |
| **Construction** | Code Generation Part 1 | Spawn Explore to verify existing patterns |
| **Construction** | Code Generation Part 2 | Keep in main context (active editing) |
| **Construction** | Build and Test | Spawn subagent for test analysis if large |
| **Testing** | Integration Tests | Spawn Explore for cross-domain analysis |
| **Testing** | Regression Run | Keep in main context (interpreting results) |
| **Testing** | Coverage Report | Spawn subagent for detailed path analysis |

---

## Anti-Patterns (PROHIBITED)

| Anti-Pattern | Correct Approach |
|--------------|------------------|
| Subagent for one small file | Read directly in main context |
| Subagent chains (A → B → C) | Main agent orchestrates all subagents directly |
| Ignoring subagent results | Trust findings, verify only if suspicious |
| Over-detailed 500-word prompts | Concise task with clear success criteria |
| Sequential spawning for independent tasks | Spawn in parallel |
| Re-doing subagent work in main | Trust subagent, don't duplicate work |

---

## MANDATORY Rules Summary

1. **ONE TASK** per subagent (no multi-task subagents)
2. **SUMMARIZE** results when returning (not raw context)
3. **PARALLEL** when tasks are independent
4. **MAIN CONTEXT** for user interaction and sequential decisions
5. **UPDATE SESSION SUMMARY** with key subagent findings
6. **DON'T DUPLICATE** work that subagent already did
7. **MCP FOR EXTERNAL** documentation, subagents for local exploration
