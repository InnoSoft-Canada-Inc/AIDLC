# Feature Documentation

## Purpose

**Generate comprehensive documentation of what was actually built**

Feature Documentation focuses on:
- Documenting what was built (not what was planned)
- Capturing architecture decisions and their rationale
- Providing working code examples
- Recording known limitations and deferred decisions

**Note**: This is distinct from design docs created during earlier phases. Design docs capture what was planned; feature docs capture what was actually built.

## Prerequisites

- Testing & Validation phase must be complete
- Human approval received for coverage report
- All code changes finalized and committed
- Implementation complete for this unit

## Output Location

```
aidlc-docs/{domain}/{unit}/documentation/feature-doc.md
```

---

## Steps to Execute

### Step 1: Generate Feature Documentation

Create the canonical feature documentation in the unit's documentation folder.

**Location**: `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`

**Process**:
1. Load all context from previous phases:
   - Testing & Validation results
   - All Construction phase artifacts
   - Design documents from Inception
2. Generate comprehensive feature doc with all required sections (see "Required Sections" below)
3. Ensure all 12 mandatory sections are included (Section 13 "External References" is optional)
4. Validate content per `common/content-validation.md` rules:
   - Validate Mermaid diagram syntax
   - Validate ASCII art diagrams
   - Escape special characters properly
   - Provide text alternatives for complex visual content
5. Include at least one working code example
6. Document rejected alternatives with rationale
7. Write the feature doc to the canonical location

**Enforcement**: Required sections enforced by doc-creation extension (see `extensions/documentation/doc-creation.md`)

**Log in audit.md**: "Feature doc created at aidlc-docs/{domain}/{unit}/documentation/feature-doc.md"

---

### Step 2: Promote to Domain Documentation

**MANDATORY**: After creating the canonical feature doc, automatically promote a copy to the domain docs folder.

**Purpose**: Improve documentation discoverability while preserving unit cohesion.

**Process**:

1. **Extract Feature Title**:
   - Parse the "What Was Built" section to derive the feature title
   - Take the first sentence or heading
   - Slugify: lowercase, replace spaces with hyphens, remove special characters
   - Example: "JWT-based authentication for the API layer" → `jwt-based-authentication`
   - If feature title too long (>50 chars), truncate and ensure valid filename
   - If no "What Was Built" section found, use unit ID only: `{UNIT-ID}.md`

2. **Create Promoted Copy**:
   - Copy the feature doc to `aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md`
   - Add source reference header at the top of the promoted copy:

   ```markdown
   > **Source**: [View canonical doc](../{UNIT-ID}/documentation/feature-doc.md)
   > **Unit**: {UNIT-ID}
   > **Last synced**: {YYYY-MM-DD}

   ---

   {original feature doc content}
   ```

   - If `aidlc-docs/{domain}/docs/` doesn't exist, create it
   - If promoted file already exists, overwrite (this is a re-promotion after edits)

3. **Update Domain Index**:
   - Create or update `aidlc-docs/{domain}/docs/_index.md`
   - Scan `aidlc-docs/{domain}/docs/` for all `*.md` files (excluding `_index.md`)
   - For each file, extract metadata from source reference header (Unit ID, Last synced date)
   - Parse the "What Was Built" section for a one-line description
   - Regenerate the index table sorted by unit ID

   **Index Template**:
   ```markdown
   # {Domain} Documentation Index

   > Auto-generated index of feature documentation for the {domain} domain.
   > Each document links to a promoted copy; canonical sources are in unit folders.

   | Document | Unit | Description | Completed |
   |----------|------|-------------|-----------|
   | [{feature-title}]({UNIT-ID}-{feature-title}.md) | {UNIT-ID} | {one-line summary from What Was Built} | {date} |
   ```

   - If a promoted doc's source reference points to a non-existent canonical doc, add warning row:
   ```markdown
   | ⚠️ [{feature-title}]({UNIT-ID}-{feature-title}.md) | {UNIT-ID} | **ORPHANED** — canonical doc missing | — |
   ```

4. **Log in audit.md**:
   - "Feature doc promoted to aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md"
   - "Domain docs index regenerated: {domain}/docs/_index.md ({count} entries, {orphan_count} orphaned)"

**See "Domain Documentation Promotion" section below for detailed rationale and edge cases.**

---

### Step 3: Present for Approval

Present the feature documentation and promotion results for human review.

**Approval Message Format**:

```markdown
**Feature Documentation Stage Complete**

### Feature Documentation Generated
✅ Canonical feature doc created at `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`

### Promoted to Domain Documentation
✅ Promoted copy created at `aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md`
✅ Domain index updated at `aidlc-docs/{domain}/docs/_index.md` ({count} entries)

### Content Validation
✅ All required sections included (12 mandatory, {optional_count} optional)
✅ At least one working code example provided
✅ Mermaid/ASCII diagrams validated
✅ Rejected alternatives documented

---

**Please review the feature documentation and confirm:**
1. Does the feature doc accurately describe what was built?
2. Are all architecture decisions and rationale captured?
3. Are API contracts and data models complete?
4. Are known limitations documented?

**Options**:
A) Approve and continue to Impact Scan
B) Request changes to feature doc

[Answer]:
```

**Wait for explicit user approval** before proceeding to Impact Scan stage.

**Log user response in audit.md** with complete raw input.

---

## Required Sections

Every feature doc must include sections 1-12 below. Section 13 (External References) is OPTIONAL and only included if user mentioned external references in their initial request. Sections 1-12 are enforced by the doc-creation extension.

### 1. What Was Built

**Purpose**: Summary of the feature for someone who hasn't seen any prior documentation.

**Content**:
- High-level summary (not implementation details)
- Business value or problem solved
- User-facing changes (if any)
- Scope of the change

**Example**:
```markdown
## What Was Built

This unit implemented JWT-based authentication for the API layer. Users can now
authenticate via POST /api/auth/login and receive a token pair (access + refresh).
The access token is used for subsequent API calls; the refresh token enables
seamless re-authentication without re-entering credentials.
```

### 2. Architecture Decisions

**Purpose**: Document the key decisions made and why.

**Content**:
- Major technical decisions
- Rationale for each decision
- Alternatives considered (and why rejected)
- Trade-offs accepted

**Example**:
```markdown
## Architecture Decisions

### Token Storage Strategy
**Decision**: Store refresh tokens in Redis, not the database.
**Rationale**: Refresh tokens are accessed frequently and have short TTLs.
Redis provides better performance for this access pattern.
**Alternatives Rejected**: Database storage (too slow for high-frequency access),
in-memory storage (doesn't survive restarts).

### Password Hashing
**Decision**: Use bcrypt with cost factor 12.
**Rationale**: Balances security with acceptable login latency (~300ms).
**Trade-off**: Higher cost factor would be more secure but unacceptably slow.
```

### 3. API Contracts

**Purpose**: Document any APIs introduced or modified.

**Content**:
- New endpoints with request/response schemas
- Modified endpoints with before/after comparison
- Authentication requirements
- Error responses

**Mandatory**: If modifying existing endpoint, include before/after comparison.

**Example**:
```markdown
## API Contracts

### New: POST /api/auth/login

**Request**:
```json
{
  "email": "user@example.com",
  "password": "secret123"
}
```

**Response (200)**:
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "dGhpcyBp...",
  "expiresIn": 3600
}
```

**Error Responses**:
- 400: Invalid request body
- 401: Invalid credentials
- 429: Too many attempts
```

### 4. Data Model Specification

**Purpose**: Document the complete data model for recreation purposes.

**Content**:
- Complete entity definitions (not just changes)
- All fields with types, constraints, defaults, and descriptions
- Primary keys and unique constraints
- Relationships with cardinality
- Indexes with rationale
- Sample data showing expected patterns

**Why Enhanced**: This section enables recreating equivalent database structure months later. It documents what EXISTS, not just what CHANGED.

**Example**:
```markdown
## Data Model Specification

### Entity: refresh_tokens

**Purpose**: Stores refresh tokens for JWT re-authentication without password re-entry.

#### Fields

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | UUID | PK, NOT NULL | gen_random_uuid() | Unique identifier |
| user_id | UUID | FK → users.id, NOT NULL | — | Owner of the token |
| token_hash | VARCHAR(64) | NOT NULL | — | SHA-256 hash of token (not plaintext) |
| expires_at | TIMESTAMP | NOT NULL | — | When token becomes invalid |
| created_at | TIMESTAMP | NOT NULL | NOW() | When token was issued |
| revoked_at | TIMESTAMP | NULL | NULL | When manually revoked (NULL = active) |

#### Relationships

| Related Entity | Cardinality | Description |
|----------------|-------------|-------------|
| users | Many-to-One | Each token belongs to one user; users can have many tokens |

#### Indexes

| Index Name | Columns | Type | Rationale |
|------------|---------|------|-----------|
| idx_refresh_tokens_hash | token_hash | BTREE | Fast lookup during token validation |
| idx_refresh_tokens_user | user_id | BTREE | Find all tokens for a user (for revocation) |
| idx_refresh_tokens_expires | expires_at | BTREE | Efficient cleanup of expired tokens |

#### Sample Data

| id | user_id | token_hash | expires_at | created_at | revoked_at |
|----|---------|------------|------------|------------|------------|
| 550e8400-e29b-41d4-a716-446655440000 | a1b2c3d4-... | 9f86d08... | 2026-03-09T10:00:00Z | 2026-03-02T10:00:00Z | NULL |
| 660e8400-e29b-41d4-a716-446655440001 | a1b2c3d4-... | 7c4a8d0... | 2026-03-08T10:00:00Z | 2026-03-01T10:00:00Z | 2026-03-02T15:30:00Z |

**Migration**: `migrations/20260302_create_refresh_tokens.sql`
```

### 5. Configuration Changes

**Purpose**: Document any new configuration requirements.

**Content**:
- New environment variables
- New settings/options
- Default values
- Required vs optional

**Example**:
```markdown
## Configuration Changes

### New Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| JWT_SECRET | Yes | — | Secret key for signing JWTs |
| JWT_ACCESS_TTL | No | 3600 | Access token TTL in seconds |
| JWT_REFRESH_TTL | No | 604800 | Refresh token TTL in seconds |
| REDIS_URL | Yes | — | Redis connection string for token storage |
```

### 6. Dependencies Added

**Purpose**: Document any new dependencies.

**Content**:
- Package name and version
- Why it was added
- Any security considerations

**Example**:
```markdown
## Dependencies Added

| Package | Version | Purpose |
|---------|---------|---------|
| jsonwebtoken | ^9.0.0 | JWT creation and verification |
| bcrypt | ^5.1.0 | Password hashing |
| ioredis | ^5.3.0 | Redis client for token storage |
```

### 7. Known Limitations

**Purpose**: Document what this unit does NOT do or known issues.

**Content**:
- Scope limitations
- Known edge cases not handled
- Deferred decisions
- Technical debt introduced

**Mandatory**: This section is required even if the entry is "None at this time."

**Example**:
```markdown
## Known Limitations

- **Token revocation**: Individual token revocation is not implemented.
  Workaround: Wait for token expiry or rotate JWT secret (affects all users).
- **Rate limiting**: Login rate limiting is per-IP only. Sophisticated attackers
  using distributed IPs are not blocked. Consider adding per-user rate limiting
  in a future unit.
- **MFA**: Multi-factor authentication is deferred to AUTH-003.
```

### 8. How to Test Manually

**Purpose**: Enable manual verification of the feature.

**Content**:
- Step-by-step instructions
- Required setup/prerequisites
- Expected outcomes
- Common troubleshooting

**Example**:
```markdown
## How to Test Manually

### Prerequisites
- Redis running locally or REDIS_URL configured
- JWT_SECRET set in environment

### Steps

1. Start the server: `npm run dev`

2. Create a test user (if not exists):
   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. Login:
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

4. Use the access token:
   ```bash
   curl http://localhost:3000/api/me \
     -H "Authorization: Bearer {accessToken}"
   ```

### Expected Outcome
- Step 3 returns 200 with token pair
- Step 4 returns 200 with user profile
```

### 9. Relationship to Other Domains/Features

**Purpose**: Document how this feature connects to the broader system.

**Content**:
- Dependencies on other domains
- Features that depend on this
- Integration points
- Cross-domain data flows

**Example**:
```markdown
## Relationship to Other Domains/Features

### Dependencies
- **Users domain**: Requires user records for authentication
- **Redis**: External dependency for token storage

### Dependents
- **API domain**: All authenticated endpoints now require valid JWT
- **Frontend**: Will integrate with login flow (FRONTEND-002)

### Integration Points
- Auth middleware intercepts all /api/* routes except /api/auth/*
- User ID extracted from JWT is available via `req.userId`
```

### 10. Decision Log

**Purpose**: Capture key implementation decisions for future recreation.

**Content**:
- Key decisions made during implementation
- Alternatives considered for each decision
- Why alternatives were rejected (specific reasons)
- Trade-offs accepted
- Constraints that influenced decisions

**Why This Matters**: When recreating a project, developers need to understand WHY choices were made to make equivalent decisions with new technologies or requirements.

**Example**:
```markdown
## Decision Log

| Decision | Alternatives Considered | Why Chosen | Trade-offs Accepted |
|----------|------------------------|------------|---------------------|
| Use Redis for token storage | PostgreSQL, In-memory | High-frequency access pattern needs sub-ms latency; Redis provides TTL natively | Additional infrastructure dependency |
| bcrypt cost factor 12 | Argon2id, cost factor 14 | bcrypt widely supported; factor 12 balances security (~300ms) with UX | Argon2id would be more future-proof |
| Store token hash, not token | Store encrypted token | Hashing is simpler and sufficient for validation | Cannot recover original token (by design) |
| Stateless access tokens | Stateful (DB-backed) tokens | Better scalability, no DB lookup per request | Cannot revoke individual access tokens |

### Detailed Decision: Token Storage Strategy

**Context**: Need to store refresh tokens for JWT re-authentication.

**Constraints**:
- Must survive server restarts
- Must support high-frequency lookups (every token refresh)
- Must support TTL-based expiration

**Options Evaluated**:

1. **PostgreSQL** ❌
   - Pro: Already in stack, ACID guarantees
   - Con: ~5-10ms latency for simple lookups, overkill for ephemeral data

2. **In-Memory (Map)** ❌
   - Pro: Fastest possible, zero dependencies
   - Con: Lost on restart, doesn't scale horizontally

3. **Redis** ✅
   - Pro: Sub-ms latency, built-in TTL, survives restarts, scales
   - Con: Additional infrastructure

**Decision**: Redis — performance requirements outweigh operational complexity.
```

### 11. Interface Contracts

**Purpose**: Document public interfaces that other code depends on for recreation.

**Content**:
- Function/method signatures with parameters, returns, and exceptions
- Events/hooks with payloads and trigger conditions
- Invariants and guarantees the implementation provides

**Why This Matters**: Interface contracts define what tests verify and what new implementations must honor. They are the "specification" that enables recreation.

**Example**:
```markdown
## Interface Contracts

### Functions/Methods

| Function | Parameters | Returns | Throws | Purpose |
|----------|------------|---------|--------|---------|
| authenticateUser | (email: string, password: string) | Promise\<TokenPair\> | InvalidCredentialsError, ValidationError | Validates credentials, returns token pair |
| refreshTokens | (refreshToken: string) | Promise\<TokenPair\> | InvalidTokenError, ExpiredTokenError | Exchanges refresh token for new pair |
| validateAccessToken | (token: string) | Promise\<DecodedToken\> | InvalidTokenError, ExpiredTokenError | Validates and decodes access token |
| revokeAllUserTokens | (userId: string) | Promise\<void\> | — | Revokes all refresh tokens for user |

### Type Definitions

```typescript
interface TokenPair {
  accessToken: string;   // JWT, expires in JWT_ACCESS_TTL seconds
  refreshToken: string;  // Opaque token, expires in JWT_REFRESH_TTL seconds
  expiresIn: number;     // Access token TTL in seconds
}

interface DecodedToken {
  userId: string;        // User's UUID
  email: string;         // User's email (for convenience)
  iat: number;           // Issued at (Unix timestamp)
  exp: number;           // Expires at (Unix timestamp)
}
```

### Events (if applicable)

| Event | Payload | When Fired |
|-------|---------|------------|
| auth.login.success | { userId, email, timestamp } | After successful authentication |
| auth.login.failed | { email, reason, timestamp } | After failed authentication attempt |
| auth.tokens.revoked | { userId, count, timestamp } | After revoking user's tokens |

### Invariants

These guarantees MUST be maintained by any equivalent implementation:

- **Email normalization**: Emails are always lowercase and trimmed before comparison
- **Token uniqueness**: Each refresh token is globally unique (UUID-based)
- **Hash-only storage**: Refresh tokens are stored as SHA-256 hashes, never plaintext
- **Atomic revocation**: revokeAllUserTokens is atomic — all or none
- **Access token stateless**: Access tokens can be validated without database lookup
```

### 12. Recreation Notes

**Purpose**: Specific guidance for recreating this feature from scratch.

**Content**:
- Bootstrap sequence (what to set up first)
- Critical dependencies that must exist
- Common pitfalls and how to avoid them
- Minimum viable implementation vs full implementation

**Example**:
```markdown
## Recreation Notes

### Bootstrap Sequence

To recreate this feature:

1. **Prerequisites**:
   - Users table must exist with id, email, password_hash columns
   - Redis instance must be available
   - Environment variables configured (see Configuration Changes)

2. **Minimum Viable Implementation**:
   - authenticateUser function (login)
   - validateAccessToken middleware
   - Access token only (skip refresh tokens for MVP)

3. **Full Implementation** (add after MVP works):
   - Refresh token generation and storage
   - Token refresh endpoint
   - Revocation functionality

### Critical Dependencies

| Dependency | Why Critical | Alternative If Unavailable |
|------------|--------------|---------------------------|
| Redis | Token storage with TTL | Use PostgreSQL with scheduled cleanup job |
| bcrypt | Password hashing | Use Argon2id (actually preferred) |
| jsonwebtoken | JWT creation/validation | Use jose library |

### Common Pitfalls

| Pitfall | How to Avoid |
|---------|--------------|
| Storing plaintext refresh tokens | Always hash with SHA-256 before storage |
| Forgetting to normalize email | Lowercase and trim in authenticateUser, not at call site |
| Access token in URL params | Never — use Authorization header only |
| Missing rate limiting | Add per-IP rate limiting from day one |
```

### 13. External References

**Purpose**: Link this feature to the original request source for traceability.

**This section is OPTIONAL** — only include if user mentioned external references (Jira ticket, ADO item, GitHub issue, Slack thread, etc.) in their initial request.

**Content** (if applicable):
- Ticket/issue number (Jira, ADO, GitHub, Linear, etc.)
- Link to original request (Slack, email, meeting notes)
- Any related tickets/issues

**Example**:
```markdown
## External References

- **Jira Ticket**: [PROJ-1234](https://company.atlassian.net/browse/PROJ-1234)
- **Original Request**: [Slack thread](https://workspace.slack.com/archives/C123/p456)
- **Related Issues**:
  - PROJ-1200 (blocks this feature)
  - PROJ-1250 (depends on this feature)
```

**If no external references**, omit this section entirely.

---

## Code Example Requirements

**Every feature doc must include at least one working code example.**

Requirements:
- Must be actual working code (not pseudocode)
- Must be copy-paste runnable
- Must include any necessary imports
- Must show realistic usage

**Bad Example**:
```
// pseudocode
authenticate(user, password) -> token
```

**Good Example**:
```javascript
import { authenticateUser } from './auth';

const result = await authenticateUser({
  email: 'user@example.com',
  password: 'secret123'
});

console.log(result.accessToken); // Use this for API calls
```

---

## Rejected Alternatives

Document alternatives that were considered but not chosen. This helps future developers understand why the current approach was selected.

**Format**:
```markdown
### Rejected: {Alternative Name}
**What**: Brief description of the alternative
**Why Rejected**: Specific reason it wasn't chosen
```

---

## Integration with Workflow

### Input From
- Testing & Validation phase results
- All Construction phase artifacts
- Design documents for comparison

### Output To
- Impact Scan (uses feature doc to identify affected files)
- Consistency Check (verifies feature doc is internally consistent)

### Extension Loading
Documentation extensions are loaded for this phase. See `extensions/documentation/doc-creation.md` for enforcement rules.

---

## Domain Documentation Promotion

**Purpose**: Improve documentation discoverability while preserving unit cohesion.

After creating the feature doc, the workflow automatically promotes a copy to the domain-level docs folder with a descriptive filename.

### How It Works

1. **Canonical doc stays in unit folder**: `aidlc-docs/{domain}/{unit}/documentation/feature-doc.md`
2. **Promoted copy goes to domain docs**: `aidlc-docs/{domain}/docs/{UNIT-ID}-{feature-title}.md`
3. **Domain index is regenerated**: `aidlc-docs/{domain}/docs/_index.md`

### Promotion Process

**Step 1: Extract Feature Title**

Parse the "What Was Built" section to derive the feature title:
- Take the first sentence or heading
- Slugify: lowercase, replace spaces with hyphens, remove special characters
- Example: "JWT-based authentication for the API layer" → `jwt-based-authentication`

**Step 2: Create Promoted Copy**

Copy the feature doc to the domain docs folder with:
- Filename: `{UNIT-ID}-{feature-title}.md` (e.g., `AUTH-001-jwt-authentication.md`)
- Add source reference header at the top of the promoted copy:

```markdown
> **Source**: [View canonical doc](../{UNIT-ID}/documentation/feature-doc.md)
> **Unit**: {UNIT-ID}
> **Last synced**: {YYYY-MM-DD}

---

{original feature doc content}
```

**Step 3: Update Domain Index**

Create or update `aidlc-docs/{domain}/docs/_index.md`:

```markdown
# {Domain} Documentation Index

> Auto-generated index of feature documentation for the {domain} domain.
> Each document links to a promoted copy; canonical sources are in unit folders.

| Document | Unit | Description | Completed |
|----------|------|-------------|-----------|
| [{feature-title}]({UNIT-ID}-{feature-title}.md) | {UNIT-ID} | {one-line summary from What Was Built} | {date} |
```

### Directory Structure After Promotion

```
aidlc-docs/
├── auth/
│   ├── docs/                              # Domain documentation (promoted copies)
│   │   ├── _index.md                      # Auto-generated table of contents
│   │   ├── AUTH-001-jwt-authentication.md # Promoted copy with source reference
│   │   └── AUTH-002-oauth2-integration.md
│   ├── aidlc-backlog.md
│   ├── AUTH-001/
│   │   └── documentation/
│   │       └── feature-doc.md             # Canonical source
│   └── AUTH-002/
│       └── documentation/
│           └── feature-doc.md             # Canonical source
```

### Benefits

- **Discoverability**: `ls aidlc-docs/auth/docs/` shows all auth documentation
- **Descriptive names**: `AUTH-001-jwt-authentication.md` is self-explanatory
- **Unit cohesion preserved**: Canonical doc stays in unit folder
- **Traceability**: Source reference header links back to canonical
- **Sortable**: Files sort by unit ID (chronological order)

### Handling Edge Cases

| Scenario | Resolution |
|----------|------------|
| Feature title too long | Truncate to 50 characters, ensure valid filename |
| Special characters in title | Remove or replace with hyphens |
| No "What Was Built" section | Use unit ID only: `{UNIT-ID}.md` |
| Domain docs folder doesn't exist | Create `aidlc-docs/{domain}/docs/` |
| Promoted file already exists | Overwrite (this is a re-promotion after edits) |

### Orphan Detection

When a unit is rolled back or deleted, its promoted doc becomes orphaned:
- The source reference header points to a non-existent file
- During next domain index regeneration, orphaned entries are flagged
- Manual cleanup required (delete orphaned promoted doc)

---

## Best Practices

1. **Write for newcomers**: Assume the reader has never seen this codebase
2. **Be specific**: Vague descriptions don't help anyone
3. **Include examples**: Working code examples are worth more than paragraphs of description
4. **Document the "why"**: Decisions without rationale lose their value over time
5. **Keep it current**: Update this doc if the feature changes significantly
6. **Check promoted copy**: After unit completion, verify the promoted doc in `{domain}/docs/` is accurate
