# Audit Log Archival

## Purpose

Prevent unbounded growth of `aidlc-docs/audit.md` while preserving full history for compliance and project recreation.

## Rules

### Active Audit File (`aidlc-docs/audit.md`)

- Contains: Current session + last 4 sessions (5 sessions max)
- Each session is marked with a session boundary marker
- Never loaded fully into context — load only last 10 entries if needed for debugging

### Archive Location (`aidlc-docs/audit-archive/`)

- **Monthly archive files**: `audit-YYYY-MM.md` (e.g., `audit-2026-03.md` for March 2026)
- **Automatic rotation**: If monthly archive exceeds 2000 lines, create new archive with sequential suffix (e.g., `audit-2026-03-part2.md`)
- Append-only — never modify archived content
- Never loaded into context unless explicitly requested for troubleshooting

## Session Boundary Marker

At the START of each new session, add this marker to audit.md:

```markdown
---
## Session: {SESSION-NUMBER}
**Started**: {ISO timestamp}
**Unit**: {UNIT-ID or "None"}
**Domain**: {domain or "None"}
---
```

## Mandatory Archival (At Session End)

**CRITICAL**: This is a MANDATORY step at session end, enforced by `common/session-summary.md`.

**Trigger**: When audit.md contains more than 5 session markers

**Process**:
1. Count session markers (`## Session:`) in audit.md
2. If count > 5:
   a. Identify the oldest session(s) to archive (keep only 5 most recent)
   b. Determine the year-month of the oldest session (use `date -u -jf "%Y-%m-%dT%H:%M:%SZ" "TIMESTAMP" +"%Y-%m"`)
   c. **Create `aidlc-docs/audit-archive/` directory if it doesn't exist**
   d. Determine target archive filename (see Archive File Rotation Logic below)
   e. Append oldest session(s) to target archive file
   f. Remove archived session(s) from audit.md
   g. Update the header in audit.md with archive reference

**Example rotation**:
- audit.md has sessions 1-6
- Archive session 1 to `audit-archive/audit-2026-03.md` (if session 1 was in March 2026)
- audit.md now has sessions 2-6 (5 sessions)

## Archive File Rotation Logic

**When appending to monthly archive**:
1. Determine target month from session timestamp (e.g., `2026-03`)
2. Find the most recent archive file for that month:
   - Look for `audit-2026-03.md` (base file)
   - If exists, check for parts: `audit-2026-03-part2.md`, `audit-2026-03-part3.md`, etc.
   - Identify the highest-numbered part (or base if no parts exist)
3. Check line count of the most recent file: `wc -l audit-2026-03-part2.md`
4. **Decision logic**:
   - If line count > 2000: Create new part file (increment part number)
   - If line count ≤ 2000: Append to existing file
   - If no file exists for this month: Create base file `audit-2026-03.md`

**Example flow**:
- Session from March 2026 needs archiving
- Check: Does `audit-2026-03.md` exist?
  - **No** → Create `audit-2026-03.md`, append session
  - **Yes** → Count lines in `audit-2026-03.md`
    - **≤ 2000 lines** → Append session to `audit-2026-03.md`
    - **> 2000 lines** → Check for `audit-2026-03-part2.md`
      - If doesn't exist → Create it, append session
      - If exists and ≤ 2000 lines → Append session to part2
      - If exists and > 2000 lines → Create `audit-2026-03-part3.md`, append session

**Key principle**: Always append to the most recent archive file for the month until it exceeds 2000 lines, then create the next part.

**Archive filename format**:
- Base: `audit-YYYY-MM.md` (e.g., `audit-2026-03.md`)
- Overflow: `audit-YYYY-MM-part{N}.md` (e.g., `audit-2026-03-part2.md`, `audit-2026-03-part3.md`)

**Year-month calculation** (for POSIX-compliant systems):
```bash
# Extract timestamp from session marker
TIMESTAMP="2026-03-11T18:00:00Z"

# Calculate year-month on macOS
date -u -jf "%Y-%m-%dT%H:%M:%SZ" "$TIMESTAMP" +"%Y-%m"
# Output: 2026-03

# Calculate year-month on Linux
date -u -d "$TIMESTAMP" +"%Y-%m"
# Output: 2026-03
```

## Archive File Format

```markdown
# Audit Archive: {YYYY-MM} [Part {N}]

> Archived sessions from {month name} {year}
> See `aidlc-docs/audit.md` for recent sessions
> [Part {N} of multi-part archive] ← (only if part number > 1)

---

## Session: 1
**Started**: 2026-01-15T10:30:00Z
...

---

## Session: 2
**Started**: 2026-01-18T14:00:00Z
...
```

**Multi-part archive header example**:
```markdown
# Audit Archive: 2026-03 Part 2

> Archived sessions from March 2026
> See `aidlc-docs/audit.md` for recent sessions
> Part 2 of multi-part archive (Part 1: audit-2026-03.md)

---
```

## Audit.md Header Format

```markdown
# AI-DLC Audit Log

## Project: {PROJECT NAME}

**Sessions in this file**: {N} (Sessions {X}-{Y})
**Archived sessions**: See `audit-archive/` for sessions 1-{X-1}

---
```

## When to Load Archives

Only load archived audit files when:
- User explicitly requests historical troubleshooting
- Recreating a project and reviewing past decisions
- Investigating a specific past session by number

Do NOT load archives during normal workflow execution.
