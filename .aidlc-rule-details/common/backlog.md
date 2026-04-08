# Two-Level Backlog System

> **For philosophy, patterns, and best practices**, see [RULE_AUTHORING.md § Backlog Management System](/.aidlc-rule-details/RULE_AUTHORING.md#backlog-management-system)

---

## Backlog Structure

### Master Backlog
**Location**: `aidlc-docs/aidlc-backlog.md`
**Contains**: All units across all domains, cross-domain dependencies

**Format**:
```markdown
# Master Backlog

## Units Overview

| ID | Unit of Work | Domain | Status | Assignee(s) | Depends On | Completed |
|----|--------------|--------|--------|-------------|------------|-----------|
| AUTH-001 | User Authentication | auth | ✅ Complete | alice.johnson | — | 2026-03-01 |
| AUTH-002 | Session Management | auth | 🔄 In Progress | bob.smith | AUTH-001 | — |
| API-001 | REST API Foundation | api | 🔓 Unblocked | — | AUTH-001 | — |
| API-002 | Rate Limiting | api | ⏳ Blocked | — | API-001 | — |

## Cross-Domain Dependencies

- API-001 depends on AUTH-001 for authentication middleware
- FRONTEND-001 depends on API-001 for endpoint contracts
```

**Assignee(s) Column** (see `common/git-user-tracking.md`):
- Automatically populated with git username when unit is claimed
- Multiple developers: comma-separated list (e.g., `bob.smith, alice.johnson`)
- Empty for units not yet claimed
- Preserved as historical record when unit completes

### Domain Backlog
**Location**: `aidlc-docs/{domain}/aidlc-backlog.md`
**Contains**: Deeper detail for units within specific domain

**Format**:
```markdown
# Domain Backlog: {domain}

## Units

### {UNIT-ID}: {Unit Name}

- **Status**: {emoji} {Status}
- **Assignee(s)**: {git-username or comma-separated list}
- **Branch**: {branch-name}
- **Completed**: {date or —}
- **Track**: {Full/Lightweight/Hotfix}

#### Phase Progress
- [x] Inception
- [ ] Construction
- [ ] Operations
- [ ] Testing & Validation
- [ ] Documentation

#### Summary
{One to two sentences describing what was built}

#### Notes for Downstream Units
- {Key decision 1}
- {Key decision 2}
- {Integration point}
```

**Assignee(s) Field** (see `common/git-user-tracking.md`):
- Automatically populated with git username when unit is claimed
- Multiple developers: comma-separated list (e.g., `bob.smith, alice.johnson`)
- Empty (`—`) for units not yet claimed
- Preserved as historical record when unit completes

---

## Status Values (MANDATORY)

| Status | Emoji | Meaning | When to Use |
|--------|-------|---------|-------------|
| **Complete** | ✅ | All five phases done | After Documentation phase approval |
| **In Progress** | 🔄 | Currently active unit | When starting work on a unit |
| **Blocked** | ⏳ | Dependencies not complete | When dependencies are incomplete |
| **Unblocked** | 🔓 | Dependencies complete, ready | When all dependencies are Complete |
| **Deferred** | ⏸ | Descoped, may return | When deprioritizing a unit |
| **Paused** | ⏸ | Interrupted mid-unit | When using Option B (interruption) |

### Status Transitions (REQUIRED FLOW)

```
⏳ Blocked → 🔓 Unblocked (when dependencies complete)
🔓 Unblocked → 🔄 In Progress (when starting work)
🔄 In Progress → ⏸ Paused (when interrupted via Option B)
⏸ Paused → 🔄 In Progress (when resuming)
🔄 In Progress → ✅ Complete (after Documentation phase)
Any → ⏸ Deferred (when descoping)
```

---

## Update Rules

### Rule 1: Documentation Phase Updates
**Backlog updates happen during Documentation phase, Backlog Update stage ONLY.**

**Exceptions**:
- Starting a unit → Update status to 🔄 In Progress immediately
- Pausing a unit (Option B interruption) → Update status to ⏸ Paused immediately

### Rule 2: Completion Notes (MANDATORY)
When marking unit ✅ Complete, write completion note in domain backlog.

**Required Content**:
1. **Summary**: One to two sentences describing what was built
2. **Key Decisions**: Decisions downstream units should know
3. **Integration Points**: How other units should interact

### Rule 3: Unblock Detection (MANDATORY CASCADE)
After marking unit ✅ Complete, update dependent units in SAME backlog update:

1. Mark completed unit as ✅ Complete
2. Scan all units marked ⏳ Blocked
3. For each blocked unit:
   - Check "Depends On" field
   - If ALL dependencies now ✅ Complete, update status to 🔓 Unblocked
4. Update both master and domain backlogs

---

## Adding New Units

1. Add to master backlog with dependencies
2. Add to domain backlog with full detail template
3. Set initial status:
   - ⏳ Blocked if any dependency is not Complete
   - 🔓 Unblocked if all dependencies are Complete (or none)

---

## Removing Units

1. Mark as ⏸ Deferred (do NOT delete)
2. Add note explaining why deferred
3. Preserve for potential future work

---

## Unit ID Convention (REQUIRED)

Format: `{DOMAIN}-{NUMBER}`

Examples: `AUTH-001`, `API-002`, `FRONTEND-003`

**Rules**:
- Use domain prefix
- Sequential numbering within domain
- Keep short but meaningful

---

## Unit Folder Naming Convention (REQUIRED)

Format: `{UNIT-ID}-{feature-title}/`

Examples:
- `AUTH-001-jwt-authentication/`
- `API-001-rest-api-foundation/`
- `FRONTEND-001-login-page/`

**Derivation**:
1. Take the unit description from the backlog (e.g., "User Authentication with JWT")
2. Slugify: lowercase, replace spaces with hyphens, remove special characters
3. Truncate to 50 characters if necessary
4. Combine: `{UNIT-ID}-{slugified-title}/`

**Path**: `aidlc-docs/{domain}/{UNIT-ID}-{feature-title}/`

**Edge Cases**:
| Scenario | Resolution |
|----------|------------|
| No description provided | Use `{UNIT-ID}/` only |
| Title changes mid-development | Keep original folder name |
| Very long title | Truncate to 50 chars after slugifying |
| Special characters | Remove or replace with hyphens |

**Benefits**:
- `ls aidlc-docs/auth/` immediately shows what each unit contains
- Git commit paths are self-documenting
- Consistent with promoted doc naming (`{UNIT-ID}-{feature-title}.md`)

---

## Dependency Management Rules

1. Keep dependency chains shallow when possible
2. Document cross-domain dependencies explicitly in master backlog
3. Avoid circular dependencies
4. List all dependencies in "Depends On" column

---

## Integration Points

| System | Usage |
|--------|-------|
| **Session Summary** | References current unit from backlog, status must match |
| **Workspace Detection** | Load master backlog at session start, load domain backlog for active domain, capture git username |
| **Documentation Phase** | Backlog Update is dedicated stage, all changes go through this stage |
| **Git User Tracking** | Automatic username capture and assignee management (see `common/git-user-tracking.md`) |

---

## Backlog Loading (MANDATORY)

**When to load**:
- At workflow start (load master backlog + domain backlog)
- Before domain fit assessment
- Before unit sequencing decisions

**Never proceed** without understanding current backlog state.

---

## Git User Tracking

See `common/git-user-tracking.md` for complete documentation on automatic developer tracking:
- Automatic git username capture at session start
- Assignee(s) field population when claiming units
- Multi-developer collaboration support
- Historical record preservation

---

## When to Use `_shared/` vs Unit-Specific Paths

**CRITICAL**: Most artifacts belong in **unit-specific paths** (`{domain}/{unit}/`), NOT in `_shared/`.

| Artifact Type | Use `_shared/` When... | Use `{domain}/{unit}/` When... |
|---------------|------------------------|-------------------------------|
| **Requirements** | Requirements span **multiple domains** | Requirements are for **one unit** ✅ (default) |
| **Execution Plan** | Plan coordinates **cross-domain work** | Plan is for **one unit** ✅ (default) |
| **User Stories** | Stories affect **multiple domains** | Stories are **unit-specific** ✅ (when skipping Application Design) |
| **Application Design** | System-wide architecture (with Units Generation stage) | N/A (skip Application Design for single units) |
| **Build & Test** | **Multi-unit projects**: After ALL units complete, tests cross-unit integration | **Single-unit projects**: Instructions for THIS unit only ✅ (default for single unit) |
| **Reverse Engineering** | Analyzing **entire codebase** ✅ | N/A (this is always system-wide) |
| **KB Cache** | MCP server knowledge base cache ✅ | N/A (this is always shared) |

**Default behavior**:
- If `aidlc-state.md` contains an active unit ID → Use unit-specific path
- If no unit ID exists (cross-domain planning) → Use `_shared/` path
- When in doubt → Use unit-specific path to avoid polluting `_shared/`
