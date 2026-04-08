# Impact Scan

## Purpose

**Identify all existing documentation that needs updating**

Impact Scan focuses on:
- Finding all docs that reference components affected by this unit
- Producing a specific list of files that need updates
- Presenting findings to developer for review before any changes
- Enabling targeted, accurate documentation updates

**Note**: This stage identifies what needs updating; Cross-Doc Update performs the actual updates.

## Prerequisites

- Feature Documentation must be complete
- Feature doc captures what was actually built
- All code changes finalized

---

## Scan Scope

**MANDATORY**: Load knowledge base location from `aidlc-docs/anchor-map.md` before scanning.

### Step 0: Load Knowledge Base Location

Read `aidlc-docs/anchor-map.md` to determine the knowledge base path:

```markdown
## Knowledge Base

- **Location**: {path}
- **Type**: local | mcp | none
```

**Knowledge base path determination**:
- If `Type: local` and `Location: {path}` → Use `{path}/` as scan location
- If `Type: mcp` → Skip knowledge base scanning (docs are remote)
- If `Type: none` or no anchor-map exists → Skip knowledge base scanning
- If `Location: docs` → Use `docs/` (common default)

### Scan Locations

The impact scan examines these locations:

| Location | What to Scan | When to Scan |
|----------|--------------|--------------|
| `{kb}/` | All project documentation files from knowledge base | If knowledge base is local (skip if MCP or none) |
| `README.md` | Project readme at root | Always |
| `openapi.yaml` | API specification (if exists) | Always |
| `aidlc-docs/` | All domain feature docs from prior units | Always |
| `CLAUDE.md` | Workflow instructions (if unit affects workflow) | If applicable |

**Note**: `{kb}` is replaced with the actual knowledge base path from anchor-map.md (e.g., `dev/planning`, `docs`, `specifications`).

---

## Definition of "Affected"

A document is considered **affected** if it references any of:

| Change Type | What Makes a Doc Affected |
|-------------|---------------------------|
| **Class/Function Changed** | Doc references the class or function by name |
| **API Endpoint Added** | Doc describes API surface that now has new endpoint |
| **API Endpoint Modified** | Doc shows old request/response format |
| **API Endpoint Removed** | Doc references endpoint that no longer exists |
| **DB Table/Column Changed** | Doc references the table or describes data model |
| **Env Var Added/Changed** | Doc lists environment variables or configuration |
| **Dependency Added** | Doc lists dependencies or installation steps |
| **Behavior Changed** | Doc describes behavior that now works differently |

---

## Steps to Execute

### Step 1: Load Feature Documentation

Read the completed feature doc from:
```
aidlc-docs/{domain}/{unit}/documentation/feature-doc.md
```

Extract all items that could affect existing docs:
- API endpoints (new, modified, removed)
- Database schema changes
- Configuration changes
- Dependencies added
- Function/class names changed
- Behavioral changes

### Step 2: Build Search Terms

From the feature doc, compile a list of search terms:

```markdown
## Search Terms for Impact Scan

### API Terms
- `/api/auth/login`
- `/api/auth/refresh`
- `Authorization` header

### Code Terms
- `authenticateUser`
- `validateToken`
- `RefreshToken` (class)

### Config Terms
- `JWT_SECRET`
- `JWT_ACCESS_TTL`
- `REDIS_URL`

### Schema Terms
- `refresh_tokens` (table)
- `token_hash` (column)
```

### Step 3: Scan Each Location

For each location in scope, search for references to the search terms.

**MANDATORY**: Use the knowledge base path loaded in Step 0 when scanning documentation.

#### Scanning Process

```markdown
## Scanning: {kb}/ (e.g., dev/planning/)

- [x] dev/planning/api-reference.md — mentions `/api/auth/*` endpoints
- [ ] dev/planning/getting-started.md — no matches
- [x] dev/planning/configuration.md — mentions environment variables
- [ ] dev/planning/architecture.md — no matches

## Scanning: aidlc-docs/

- [ ] aidlc-docs/users/USER-001/documentation/ — no matches
- [x] aidlc-docs/api/API-001/documentation/ — mentions auth middleware
```

**Note**: Replace `{kb}` with the actual knowledge base path from anchor-map.md. Examples:
- If `Location: docs` → scan `docs/`
- If `Location: dev/planning` → scan `dev/planning/`
- If `Location: specifications` → scan `specifications/`
- If `Type: mcp` or `Type: none` → skip knowledge base scanning

### Step 4: Compile Affected Files List

Create a structured list of all affected files:

```markdown
## Impact Scan Results

**Unit**: {UNIT-ID}
**Scanned**: {timestamp}

### Affected Files

| # | File | What Needs Updating |
|---|------|---------------------|
| 1 | {kb}/api-reference.md | Add new auth endpoints, update auth section |
| 2 | {kb}/configuration.md | Add JWT_SECRET, JWT_ACCESS_TTL, JWT_REFRESH_TTL, REDIS_URL |
| 3 | README.md | Update prerequisites (Redis), add auth setup instructions |
| 4 | openapi.yaml | Add POST /api/auth/login, POST /api/auth/refresh schemas |
| 5 | aidlc-docs/api/API-001/documentation/feature-doc.md | Note auth middleware integration |

**Note**: `{kb}` represents the knowledge base path from anchor-map.md (e.g., `dev/planning/api-reference.md` if Location is `dev/planning`).

### Files Scanned (No Updates Needed)

- {kb}/getting-started.md
- {kb}/architecture.md
- aidlc-docs/users/USER-001/documentation/feature-doc.md

### Summary

- **Total Files Scanned**: 8
- **Files Needing Updates**: 5
- **Files Unchanged**: 3
```

### Step 5: Present to Developer

**Critical**: Present findings BEFORE any updates are made.

```markdown
**Impact Scan Complete**

I've identified **{count}** files that need updating based on this unit's changes.

### Files to Update

| File | Update Needed |
|------|---------------|
| {kb}/api-reference.md | Add new auth endpoints |
| {kb}/configuration.md | Add new environment variables |
| README.md | Update prerequisites, add auth setup |
| openapi.yaml | Add auth endpoint schemas |
| aidlc-docs/api/API-001/documentation/feature-doc.md | Note auth integration |

**Note**: `{kb}` = knowledge base path from anchor-map.md

### Review Questions

1. Are there any files I missed that should be updated?
2. Are there any files in this list that should NOT be updated?
3. Any specific guidance on how updates should be made?

Please review and confirm before I proceed with updates.

Options:
A) Proceed with updates to all listed files
B) Add files to the list (specify which)
C) Remove files from the list (specify which)
D) Provide specific guidance for certain files

[Answer]:
```

### Step 6: Adjust Based on Feedback

If developer provides feedback:
- Add any additional files they identify
- Remove any files they want to exclude
- Note any specific guidance for particular files

### Step 7: Store Impact Scan Results

Save the final impact scan to:
```
aidlc-docs/{domain}/{unit}/documentation/impact-scan.md
```

---

## Output Format

The impact scan output should be:

```markdown
# Impact Scan: {UNIT-ID}

**Generated**: {timestamp}
**Approved By**: Developer (via workflow)

## Affected Files

| # | File | Update Description | Priority |
|---|------|-------------------|----------|
| 1 | {path} | {what needs updating} | {High/Medium/Low} |

## Developer Adjustments

{Any additions, removals, or guidance from developer review}

## Next Step

Proceed to Cross-Doc Update with the approved file list.
```

---

## Priority Guidelines

| Priority | Criteria |
|----------|----------|
| **High** | API docs with wrong schemas, README with incorrect setup |
| **Medium** | Feature docs referencing changed behavior |
| **Low** | Minor terminology updates, optional enhancements |

---

## Common Patterns

**Note**: `{kb}` refers to the knowledge base path from anchor-map.md.

### API Changes
- Always check `openapi.yaml`
- Always check `{kb}/api-reference.md` or equivalent
- Check any SDK documentation

### Configuration Changes
- Always check `README.md` (setup section)
- Always check `{kb}/configuration.md` or equivalent
- Check deployment documentation

### Schema Changes
- Check data model documentation in `{kb}/`
- Check API docs that describe response formats
- Check any database migration guides

### Dependency Changes
- Check `README.md` (prerequisites)
- Check installation/setup documentation in `{kb}/`
- Check deployment documentation

---

## Integration with Workflow

### Input From
- Feature Documentation (what was built)
- Construction artifacts (code changes)

### Output To
- Cross-Doc Update (list of files to update)
- Audit log (scan results)

---

## Best Practices

1. **Be thorough**: Missing an affected file means outdated docs
2. **Use specific search terms**: Vague searches miss important references
3. **Include context**: "What needs updating" should be specific, not vague
4. **Get developer review**: They may know of docs you don't
5. **Document exclusions**: If developer removes a file, note why
