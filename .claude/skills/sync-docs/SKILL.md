---
name: sync-docs
description: Sync feature documentation to an external knowledge base or shared docs repo after completing a unit of work. Use when asking "sync docs", "update external docs", "push docs to shared repo", "update knowledge base", or after finishing a unit.
---

# Sync Documentation

Syncs AIDLC feature documentation from `aidlc-docs/` to an external knowledge base or shared documentation repository. Detects cross-project impacts and validates references after every edit.

## When to Use

- After completing a unit of work (Documentation phase done)
- When feature docs need to be reflected in a shared/external docs repo
- When checking if completed work impacts other projects' documentation
- Periodically to ensure external docs stay in sync with AIDLC artifacts

## Prerequisites

This skill requires configuration in `aidlc-docs/anchor-map.md`. If the configuration doesn't exist yet, the skill will guide the user through setup.

### Anchor Map Configuration

The skill reads from two sections in `anchor-map.md`:

**1. Knowledge Base Promotion Preference** (may already exist):
```markdown
## Knowledge Base Promotion Preference (Optional)

- **Default Action**: merge
- **Features Directory**: docs/features
```

**2. External Docs Configuration** (new, added by this skill if missing):
```markdown
## External Docs Configuration (Optional)

### Shared Docs Repo
- **Path**: {absolute path to shared docs repo, or empty if none}
- **Project Folder**: {subfolder within shared repo for this project, e.g., "platform/"}

### Doc Category Mapping
| Domain | Target Folder | Description |
|--------|--------------|-------------|
| auth | auth/ | Authentication and authorization docs |
| api | api/ | API reference and contracts |
| {domain} | {folder}/ | {description} |

### Cross-Project References
| Project | Docs Path | Check When |
|---------|-----------|------------|
| {project-name} | {path to that project's docs} | {trigger condition, e.g., "API contract changes"} |
| {project-name} | {path} | {trigger condition} |

### Handoff Directory
- **Path**: {path for cross-project handoff documents, e.g., "cross-team/handoffs/"}
```

## Instructions

When invoked:

### Step 1: Load Configuration

1. Read `aidlc-docs/anchor-map.md`
2. Look for `## External Docs Configuration`
3. If not found, run **Setup Flow** (see below)
4. If found, parse the configuration and proceed

### Step 2: Identify What Changed

1. Read `aidlc-docs/aidlc-state.md` for the current/last completed unit
2. Read the unit's **feature doc** from `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`
3. Read the unit's **session summary** for files touched and decisions made
4. Categorize changes by domain using the **Doc Category Mapping** from anchor-map.md

If no unit is active or recently completed, ask:
```
No active unit found. Which unit's docs should I sync?

A) {list units from backlog with status Complete that haven't been synced}
B) Sync all unsynchronized units
C) Specify a unit ID manually

[Answer]:
```

### Step 3: Sync to Knowledge Base (Local)

If `Knowledge Base Promotion Preference` is configured and the Default Action is not "skip":

1. Follow the promotion action (copy/merge/link) as configured
2. This step uses the existing AIDLC promotion mechanism — no custom logic needed
3. Skip if promotion was already done during the Documentation phase

### Step 4: Sync to External Docs Repo

If `External Docs Configuration > Shared Docs Repo > Path` is configured:

For each affected domain (from Step 2):

1. Look up the target folder from **Doc Category Mapping**
2. Read the existing doc(s) in `{shared-repo-path}/{project-folder}/{target-folder}/`
3. Determine what needs updating based on the completed unit:
   - New content to add (new features, new APIs, new data models)
   - Existing content to update (changed behavior, updated contracts)
   - Content to mark as deprecated (removed features)
4. Make **targeted updates** — do NOT rewrite documents wholesale
5. If a new doc file is needed, create it in the appropriate subfolder
6. Run **Reference Validation** (Step 6) after each file edit

If no Doc Category Mapping exists for a domain, ask:
```
The domain "{domain}" has no mapping in anchor-map.md.

A) Add mapping now (I'll ask where these docs should go)
B) Skip syncing this domain
C) Put docs in a general "{domain}/" folder in the shared repo

[Answer]:
```

If the user chooses A, update the Doc Category Mapping table in anchor-map.md.

### Step 5: Check Cross-Project Impact

If `Cross-Project References` table has entries:

For each cross-project reference where the trigger condition matches:

1. Read the referenced project's docs at the specified path
2. Check for inconsistencies introduced by this unit's changes:
   - **API contract changes** — Does the external project reference APIs we changed?
   - **Auth/permission changes** — Does the external project depend on auth behavior we modified?
   - **Shared type/model changes** — Does the external project use data models we changed?
   - **Terminology changes** — Did we rename concepts used by the external project?
3. For each issue found, classify it:
   - **Auto-fixable** — Terminology update, small reference fix, version bump → Fix it directly
   - **Needs coordination** — API contract change, breaking change, new integration requirement → Create handoff

### Step 5a: Create Handoffs (if needed)

For issues that need coordination:

1. Determine the handoff path from `Handoff Directory` in anchor-map.md (default: `cross-team/handoffs/`)
2. Create a handoff document:

```markdown
# Handoff: {topic}

**From**: {this project} — {UNIT-ID}
**To**: {affected project}
**Date**: {ISO date}
**Priority**: {High | Medium | Low}

## What Changed
{Brief description of the change}

## Impact on {affected project}
{Specific files, APIs, or behaviors affected}

## Required Action
{What the other project team needs to do}

## Reference
- Feature doc: `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`
- Changed files: {list of changed files}
```

3. Log the handoff creation in the sync report

### Step 6: Reference Validation

**Run after EVERY file edit in Steps 4 and 5.**

1. **Internal references**: Scan the edited file for references to other files, API endpoints, type names, or section links — verify each one resolves
2. **Inbound references**: Search the docs repo for references to the edited file — if you renamed, moved, or changed a section heading, update all files that reference it
3. **Cross-project references**: If the file references external project docs, verify the references match current state
4. **Collect broken references** for the final report

### Step 7: Update Sync State

After successful sync, record what was synced to prevent duplicate work:

Edit the unit's session summary (`aidlc-docs/{domain}/{unit}/session-summary.md`) and add or update:

```markdown
## External Docs Sync
- **Synced**: {ISO date}
- **Files Updated**: {list}
- **Handoffs Created**: {list or "none"}
```

### Step 8: Report

Output a summary:

```markdown
## Docs Sync Complete — {UNIT-ID}

### Knowledge Base (Local)
- {action taken or "Already promoted during Documentation phase"}

### External Docs Updated
- `{path}`: {what changed}
- `{path}`: {what changed}
{or "No external docs repo configured"}

### Cross-Project Impact
- {project}: {impact} — {fixed | handoff created | no impact}
{or "No cross-project references configured"}

### New Files Created
- `{path}`: {purpose}
{or "None"}

### Handoffs
- `{path}`: {summary} → {target project}
{or "None needed"}

### References Validated
- {count} references checked, {issues} broken references found
{list any that were fixed or remain broken}
```

---

## Setup Flow

If `## External Docs Configuration` is missing from anchor-map.md:

### Setup Step 1: Ask about shared docs

```
## Docs Sync Setup

This skill can sync your AIDLC feature docs to external locations. Let me set it up.

**1. Do you have a shared/external documentation repository?**

A) Yes — I have a separate docs repo (e.g., a shared team docs folder, a docs monorepo)
B) No — I only need local knowledge base promotion (already handled by AIDLC)

[Answer]:
```

If B: Skip to Setup Step 4 (just confirm KB promotion settings and exit).

### Setup Step 2: Configure shared repo

```
**2. Shared docs repo details:**

- **Path**: {ask for absolute path to the repo root}
- **Project folder**: {ask what subfolder this project's docs go in, e.g., "platform/", "backend/", or root}

[Answer]:
```

Validate the path exists. If it doesn't, warn and ask to confirm or correct.

### Setup Step 3: Configure category mapping

Read the current domains from `aidlc-docs/aidlc-backlog.md` (or `aidlc-state.md`).

For each domain found:
```
**3. Where should "{domain}" docs go in the shared repo?**
   Target folder (relative to project folder): 
```

If no domains exist yet, create an empty mapping table — it will be populated as domains are created.

### Setup Step 4: Configure cross-project references

```
**4. Do other projects depend on this project's output?** (API consumers, shared libraries, etc.)

A) Yes — let me list them
B) No — this project is standalone
C) Not sure yet — I'll configure this later

[Answer]:
```

If A: Collect project name, docs path, and trigger condition for each.

### Setup Step 5: Write configuration

Write the `## External Docs Configuration` section to `aidlc-docs/anchor-map.md`.

Confirm:
```
External docs configuration saved to anchor-map.md.
You can update this anytime by editing anchor-map.md directly or running /sync-docs again.
```

---

## Important Rules

- **Never modify AIDLC artifacts** — `aidlc-docs/` content stays in the project repo. This skill syncs *from* aidlc-docs *to* external locations, never the reverse.
- **Targeted updates only** — Update affected sections in external docs, don't rewrite entire documents.
- **Respect existing structure** — If the external repo uses numbered prefixes (01-, 02-), naming conventions, or specific formats, preserve them.
- **Create handoffs for breaking changes** — If a change will break another project's integration, always create a handoff document rather than silently editing their docs.
- **Reference validation is mandatory** — Every file edit must be followed by a reference check. This prevents creating new inconsistencies while fixing old ones.
- **Idempotent** — Running sync twice for the same unit should not create duplicate content or duplicate handoffs. Check the sync state in session-summary.md before proceeding.
