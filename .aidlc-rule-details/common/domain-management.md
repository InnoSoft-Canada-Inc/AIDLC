# Domain Management

**Purpose**: Define rules for assessing domain fit and creating new domains dynamically during a unit of work request.

---

## Overview

Domains in AI-DLC organize units of work by functional area. While domains are typically created during project initialization from planning documents, new domains may need to be created mid-project when a user requests work that doesn't fit any existing domain.

**Domain creation happens in two scenarios**:
1. **During Initialization** — derived from planning documents (see `common/initialization.md`)
2. **During Workspace Detection** — when a unit request doesn't fit existing domains (this document)

---

## Domain Fit Assessment

**When to Assess**: During Workspace Detection, after loading existing domains from the anchor map.

### Step 1: Load Existing Domains

Read `aidlc-docs/anchor-map.md` to get the list of existing domains:

```markdown
## Domain Anchor Map

| Domain   | Primary Anchor Doc     | Secondary Anchor Doc |
| -------- | ---------------------- | -------------------- |
| auth     | docs/planning/auth.md  | —                    |
| api      | docs/planning/api.md   | —                    |
```

### Step 2: Analyze User Request Against Domains

For each existing domain, evaluate fit based on these indicators:

**Fit Indicators** (request DOES belong to this domain):
- Request relates to functionality described by domain's anchor doc
- Request extends or modifies code likely owned by that domain
- Request uses similar technology/patterns as existing domain units
- Request is a natural extension of existing domain scope

**No-Fit Indicators** (request does NOT belong to existing domains):
- Request introduces entirely new technology stack
- Request is for a distinct functional area not covered by any domain
- No existing domain has related functionality
- Request would significantly expand a domain beyond its original scope

### Step 3: Make Fit Decision

| Scenario | Action |
|----------|--------|
| **Clear fit to one domain** | Proceed with that domain |
| **Could fit multiple domains** | Ask for clarification (see Uncertain Handling) |
| **No existing domain fits** | Trigger new domain creation flow |
| **Uncertain** | Ask for clarification (see Uncertain Handling) |

---

## New Domain Creation Flow

**When no existing domain fits the user's request**, propose creating a new domain.

### Step 1: Propose Domain

Present to the user:

```markdown
**New Domain Detected**

Your request doesn't fit any existing domain. I propose creating a new domain:

**Proposed Domain**: `{proposed-name}`
**Description**: {one-sentence description of what this domain covers}
**First Unit**: {DOMAIN-PREFIX}-001 - {brief unit description}

A) Approve this domain
B) Use a different domain name (specify)
C) Fit into existing domain: {list existing domains}

[Answer]:
```

### Step 2: Domain Naming

When proposing a domain name:
- Use **lowercase only**
- Keep it **short** (1-2 words, max 15 characters)
- Make it **descriptive** of the functionality
- Use **common conventions**: `agents`, `payments`, `notifications`, `analytics`, `search`, `reporting`

### Step 3: Handle User Response

| Response | Action |
|----------|--------|
| **A) Approve** | Create domain (see Domain Creation Actions) |
| **B) Rename** | Use user's specified name, then create domain |
| **C) Use existing** | Proceed with specified existing domain |

---

## Domain Creation Actions

**When a new domain is approved**, execute these steps in order:

### 1. Create Domain Directory

```bash
mkdir -p aidlc-docs/{domain}/
```

### 2. Create Domain Backlog

Create `aidlc-docs/{domain}/aidlc-backlog.md`:

```markdown
# Domain Backlog: {domain}

## Units

(No units yet)
```

### 3. Update Anchor Map

Add new domain entry to `aidlc-docs/anchor-map.md`:

```markdown
| {domain} | — | — |
```

**Note**: New domains created mid-project start with no anchor doc. The `—` placeholder indicates no anchor doc is assigned yet.

### 4. Update Master Backlog

Add new domain section to `aidlc-docs/aidlc-backlog.md` if not already present.

### 5. Log in Audit

Add entry to `aidlc-docs/audit.md`:

```markdown
## Domain Creation
**Timestamp**: {ISO timestamp}
**Domain**: {domain}
**Reason**: User request for "{brief description}" did not fit existing domains
**User Approved**: Yes

---
```

### 6. Proceed to Unit Creation

Continue with the unit of work within the newly created domain.

---

## Uncertain Domain Handling

**When the LLM is uncertain** whether a request fits an existing domain OR needs a new one:

```markdown
**Domain Clarification Needed**

Your request could fit an existing domain or warrant a new one:

A) Create new domain: `{proposed-name}` — {rationale for new domain}
B) Add to existing domain: `{domain-1}` — {rationale for this domain}
C) Add to existing domain: `{domain-2}` — {rationale for this domain}

Which would you prefer?

[Answer]:
```

### When to Ask for Clarification

**Ask when**:
- Request could reasonably fit 2+ existing domains
- Request is ambiguous about scope
- Domain name is non-obvious from request

**Do NOT ask when**:
- Request clearly doesn't fit any existing domain
- Request clearly fits exactly one domain
- Domain name is obvious from request

**Principle**: Be confident in proposing domains. Don't be overly cautious — if the answer is obvious, don't ask.

---

## Anchor Doc Assignment

### New Domains Start Without Anchor Docs

Domains created mid-project (via this flow) start without anchor docs:
- Anchor map entry shows `—` for Primary and Secondary Anchor Doc
- This is intentional — anchor docs are optional

### Assigning Anchor Docs Later

If the user later adds planning documents for a dynamically-created domain:

1. User adds document to knowledge base location
2. User runs `Using AI-DLC, re-scan knowledge base`
3. Re-scan detects documents that may relate to the domain
4. User approves association during re-scan review

### Anchor Map Entry for New Domains

```markdown
| agents | — | — |
```

After re-scan with new planning doc:

```markdown
| agents | docs/planning/agents-architecture.md | — |
```

---

## Domain Naming Conventions

### Format Rules

- **Lowercase only**: `auth`, not `Auth` or `AUTH`
- **No spaces**: `user-management` or `usermanagement`, not `user management`
- **Short**: 1-2 words, max 15 characters
- **Descriptive**: Should clearly indicate what functionality the domain covers

### Good Domain Names

| Name | Good For |
|------|----------|
| `auth` | Authentication, authorization, login |
| `api` | REST/GraphQL API endpoints |
| `agents` | AI agents, autonomous systems |
| `payments` | Payment processing, billing |
| `notifications` | Email, SMS, push notifications |
| `analytics` | Reporting, metrics, dashboards |
| `search` | Search functionality, indexing |
| `admin` | Admin panels, back-office tools |
| `integrations` | Third-party integrations |
| `core` | Shared business logic |

### Bad Domain Names

| Name | Problem |
|------|---------|
| `stuff` | Too vague |
| `user-authentication-and-authorization-system` | Too long |
| `AUTH` | Not lowercase |
| `misc` | Too vague, catch-all |
| `new-feature` | Doesn't describe functionality |

---

## Integration with Other Systems

### Workspace Detection

- Domain fit assessment happens during Step 5 (Load Project Context)
- Add new step 5.4 for domain fit assessment (see workspace-detection.md)

### Initialization

- Initial domain creation during `Using AI-DLC, initialize project`
- Uses the same anchor map format
- See `common/initialization.md`

### Backlog

- New domains get empty domain backlogs
- First unit in domain gets added to both master and domain backlogs
- See `common/backlog.md`

### Session Summary

- Session summary includes domain name
- Domain context carried through entire unit lifecycle

---

## Summary

| Scenario | Action |
|----------|--------|
| Request fits existing domain | Proceed with that domain |
| Request doesn't fit any domain | Propose new domain, get user approval, create domain |
| Uncertain about fit | Ask user for clarification |
| User requests different name | Use their name |
| User overrides to existing domain | Use specified domain |
