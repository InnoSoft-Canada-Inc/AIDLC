# Cross-Doc Update

## Purpose

**Update all documentation files identified in the impact scan**

Cross-Doc Update focuses on:
- Making targeted updates to affected sections
- Logging every change in the audit trail
- Preserving document structure and style
- Verifying consistency after each update

**Note**: This stage performs the updates; Impact Scan identified which files need updating.

## Prerequisites

- Impact Scan must be complete
- Developer has approved the list of files to update
- Feature Documentation provides the source of truth for new content

---

## Core Principles

### Targeted Updates Only

**Do NOT rewrite documents wholesale.**

- Update only the specific sections that are affected
- Preserve existing structure, formatting, and style
- Maintain the document's voice and tone
- Keep unaffected sections exactly as they were

**Bad Approach**:
```
Read entire doc → Rewrite from scratch → Replace file
```

**Good Approach**:
```
Read entire doc → Identify affected sections → Update only those sections → Preserve rest
```

### Audit Every Change

Every update must be logged in `audit.md`:
- What file was changed
- What section was updated
- What the change was
- Why the change was needed

---

## Steps to Execute

### Step 1: Load Approved File List

Read the impact scan results to get the list of files to update:

```markdown
## Files to Update

1. {kb}/api-reference.md — Add new auth endpoints
2. {kb}/configuration.md — Add new environment variables
3. README.md — Update prerequisites, add auth setup
4. openapi.yaml — Add auth endpoint schemas
```

**Note**: The impact scan will have already resolved `{kb}` to the actual knowledge base path from anchor-map.md (e.g., `dev/planning/api-reference.md`). Use the exact paths provided in the impact scan results.

### Step 2: Load Feature Documentation

Read the feature doc as the source of truth for new content:
```
aidlc-docs/{domain}/{unit}/documentation/feature-doc.md
```

### Step 3: Update Each File

For each file in the list:

#### 3a. Read the Current File

Load the complete current content.

#### 3b. Identify Affected Sections

Based on the impact scan notes, locate the specific sections that need updating.

#### 3c. Draft the Update

Write the new content for the affected sections:
- Match existing style and formatting
- Use consistent terminology
- Include all necessary information from feature doc

#### 3d. Apply the Update

Replace only the affected sections with the new content.

#### 3e. Verify Consistency

After updating, verify:
- The updated section flows naturally with surrounding content
- Formatting is consistent with the rest of the document
- No orphaned references or broken links

#### 3f. Log the Change

Add an entry to audit.md:

```markdown
## Cross-Doc Update: {file_path}

**Timestamp**: {ISO timestamp}
**Unit**: {UNIT-ID}
**Section Updated**: {section name or line range}

**Change Made**:
{Description of what was changed}

**Reason**:
{Why this change was needed, referencing feature doc}

---
```

### Step 4: Update Summary

After all files are updated, create a summary:

```markdown
## Cross-Doc Update Summary

**Unit**: {UNIT-ID}
**Completed**: {timestamp}

### Updates Made

| # | File | Section | Change |
|---|------|---------|--------|
| 1 | {kb}/api-reference.md | Authentication section | Added POST /api/auth/login, POST /api/auth/refresh |
| 2 | {kb}/configuration.md | Environment Variables | Added JWT_SECRET, JWT_ACCESS_TTL, REDIS_URL |
| 3 | README.md | Prerequisites | Added Redis requirement |
| 4 | README.md | Setup | Added auth configuration steps |
| 5 | openapi.yaml | paths | Added /api/auth/login, /api/auth/refresh schemas |

**Note**: `{kb}` = knowledge base path (example shows actual resolved paths in practice)

### Files Updated: 4
### Total Changes: 5
```

---

## Update Patterns by File Type

### Markdown Documentation

```markdown
## Before
### API Endpoints
- GET /api/users
- POST /api/users

## After
### API Endpoints
- GET /api/users
- POST /api/users
- POST /api/auth/login ← Added
- POST /api/auth/refresh ← Added
```

### OpenAPI/Swagger

```yaml
# Add to paths section
paths:
  /api/auth/login:
    post:
      summary: Authenticate user
      requestBody:
        # ... schema from feature doc
      responses:
        # ... responses from feature doc
```

### README Files

Update specific sections:
- Prerequisites: Add new requirements
- Installation: Add new setup steps
- Configuration: Add new environment variables
- Usage: Add new examples

### Configuration Documentation

```markdown
## Before
| Variable | Required | Description |
|----------|----------|-------------|
| DB_URL | Yes | Database connection string |

## After
| Variable | Required | Description |
|----------|----------|-------------|
| DB_URL | Yes | Database connection string |
| JWT_SECRET | Yes | Secret key for signing JWTs | ← Added
| REDIS_URL | Yes | Redis connection for tokens | ← Added
```

---

## Audit Log Format

Every change must be logged. Use this format:

```markdown
## [Cross-Doc Update]
**Timestamp**: 2026-03-02T14:30:00Z
**Unit**: AUTH-001
**File**: {kb}/api-reference.md (e.g., dev/planning/api-reference.md)
**Section**: Authentication Endpoints

**Before**:
```
(No authentication endpoints documented)
```

**After**:
```
### Authentication Endpoints

#### POST /api/auth/login
Authenticates a user and returns a token pair.

#### POST /api/auth/refresh
Refreshes an expired access token.
```

**Reason**: New authentication endpoints added in AUTH-001 per feature-doc.md

**Note**: `{kb}` is replaced with actual knowledge base path from anchor-map.md in practice.

---
```

---

## Consistency Verification

After each update, verify:

| Check | What to Verify |
|-------|----------------|
| **Flow** | Updated section reads naturally in context |
| **Formatting** | Headers, lists, code blocks match document style |
| **Links** | Any internal links still work |
| **References** | No dangling references to removed content |
| **Completeness** | All necessary information included |

---

## Error Handling

### File Not Found

If a file from the impact scan doesn't exist:
```markdown
**Warning**: File not found: {path}

This file was listed in the impact scan but does not exist.
Options:
A) Skip this file
B) Create the file
C) Investigate (may have been renamed/moved)

[Answer]:
```

### Section Not Found

If the expected section doesn't exist in the file:
```markdown
**Warning**: Section not found in {path}

Expected to find section: {section_name}
The file exists but the section to update was not found.

Options:
A) Add the section to an appropriate location
B) Skip updating this file
C) Show file contents for manual guidance

[Answer]:
```

### Conflicting Information

If existing content conflicts with feature doc:
```markdown
**Warning**: Conflicting information in {path}

Existing doc says: {existing_statement}
Feature doc says: {new_statement}

Options:
A) Replace with feature doc information (it's more current)
B) Keep existing (feature doc may be wrong)
C) Flag for manual review

[Answer]:
```

---

## Integration with Workflow

### Input From
- Impact Scan (list of files to update)
- Feature Documentation (source of truth)
- Developer approval (confirmed file list)

### Output To
- Consistency Check (updated files for verification)
- Audit log (all changes logged)

---

## Best Practices

1. **Small, focused edits**: Change only what needs changing
2. **Match style**: New content should look like it belongs
3. **Log everything**: Every change in audit.md
4. **Verify after each file**: Don't wait until the end
5. **Ask when uncertain**: Better to confirm than guess wrong
