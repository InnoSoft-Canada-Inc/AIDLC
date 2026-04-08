# Feature Documentation Standards

## Overview

These documentation rules are MANDATORY cross-cutting constraints that apply during Phase 5 (Documentation & Consolidation). They define the required sections, content standards, and quality requirements for feature documentation.

**Enforcement**: The Feature Documentation stage MUST verify compliance with these rules before presenting the stage completion message to the user.

### Blocking Documentation Finding Behavior

A **blocking documentation finding** means:
1. The finding MUST be listed in the stage completion message under a "Documentation Findings" section with the DOC rule ID and description
2. The stage MUST NOT present the "Continue to Next Stage" option until all blocking findings are resolved
3. The model MUST present only the "Request Changes" option with a clear explanation of what needs to change
4. The finding MUST be logged in `aidlc-docs/audit.md` with the DOC rule ID, description, and stage context

### Default Enforcement

All rules in this document are **blocking** by default. If any rule's verification criteria are not met, it is a blocking documentation finding — follow the blocking finding behavior defined above.

---

## Rule DOC-01: Required Sections

**Rule**: Every feature document MUST include all of the following sections:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **What Was Built** | Summary of the feature (not implementation details) |
| 2 | **Architecture Decisions** | Key technical decisions and their rationale |
| 3 | **API Contracts** | APIs introduced or modified, with request/response examples |
| 4 | **Data Model Specification** | Complete entity definitions, relationships, indexes, sample data |
| 5 | **Configuration Changes** | Environment variables, settings, feature flags |
| 6 | **Dependencies Added** | New packages with versions and purposes |
| 7 | **Known Limitations** | Scope limits, deferred items, edge cases |
| 8 | **How to Test Manually** | Step-by-step verification instructions |
| 9 | **Relationship to Other Domains** | Dependencies and integration points |
| 10 | **Decision Log** | Key trade-offs, alternatives considered, why rejected |
| 11 | **Interface Contracts** | Function signatures, events, type definitions, invariants |
| 12 | **Recreation Notes** | Bootstrap sequence, critical dependencies, common pitfalls |

**Verification**:
- All twelve sections are present in the feature document
- No section is empty (each contains meaningful content or explicit "None" statement)
- Section headings match the required names for consistency

**Note**: Section 13 (External References) is OPTIONAL and only included if user mentioned external references in their initial request.

---

## Rule DOC-02: Working Code Examples

**Rule**: Every feature document MUST include at least one working code example demonstrating the primary use case.

**Requirements**:
- Must be actual runnable code, not pseudocode
- Must include necessary imports/requires
- Must be copy-paste executable (given appropriate environment)
- Must demonstrate the primary/happy-path use case

**Verification**:
- At least one code block is marked as executable (language-specific, e.g., ```javascript, ```python)
- Code includes import statements where required
- Code shows realistic values, not placeholders like `<your-value-here>`
- Example is complete enough to run (not a fragment)

**Good Example**:
```javascript
import { authenticateUser } from './auth';

const result = await authenticateUser({
  email: 'user@example.com',
  password: 'secret123'
});

console.log(result.accessToken); // Use this for API calls
```

**Bad Example**:
```
// pseudocode
authenticate(user, password) -> token
```

---

## Rule DOC-03: API Before/After for Modifications

**Rule**: When modifying an existing API endpoint, the documentation MUST include a before/after comparison showing exactly what changed.

**Requirements**:
- Show the previous request/response schema
- Show the new request/response schema
- Highlight the differences
- Explain why the change was made

**Verification**:
- If an existing endpoint is modified, before/after comparison is present
- Changes are clearly marked or highlighted
- Rationale for the change is provided

**Example Format**:
```markdown
### Modified: GET /api/users/{id}

**Before (v1)**:
```json
{
  "id": 123,
  "name": "John Doe"
}
```

**After (v2)**:
```json
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",  // Added
  "lastLogin": "2026-03-02T10:00:00Z"  // Added
}
```

**Reason**: Added user contact info to reduce API calls for profile display.
```

---

## Rule DOC-04: Rejected Alternatives

**Rule**: Every feature document MUST document alternatives that were considered but rejected, along with the rationale for rejection.

**Purpose**: Prevents future developers from re-opening closed decisions without understanding why the current approach was chosen.

**Requirements**:
- List at least one alternative that was considered (or explicitly state "No significant alternatives considered")
- For each alternative, provide a clear reason for rejection
- Reasoning must be specific, not vague

**Verification**:
- Section "Rejected Alternatives" or equivalent is present
- At least one alternative is documented, OR explicit statement that no alternatives were considered
- Each rejected alternative has a specific rationale (not "didn't seem right")

**Good Example**:
```markdown
### Rejected: Store tokens in database

**What**: Use PostgreSQL instead of Redis for refresh token storage.

**Why Rejected**: Refresh tokens are accessed on every authenticated request
and have short TTLs (7 days). Redis's sub-millisecond reads and native TTL
support make it better suited for this access pattern. Database storage would
add ~5-10ms latency per request.
```

**Bad Example**:
```markdown
### Rejected: Other options

We considered other approaches but went with this one.
```

---

## Rule DOC-05: Mandatory Known Limitations

**Rule**: The "Known Limitations" section is MANDATORY in every feature document, even if the entry is "None at this time."

**Purpose**: Forces explicit review of limitations rather than optimistic omission. A feature with no known limitations should still have the section with an explicit acknowledgment.

**Requirements**:
- Section must exist
- If limitations exist, list them with brief explanations
- If no limitations, explicitly state "None identified at this time"
- Consider: scope limitations, edge cases not handled, technical debt, deferred decisions

**Verification**:
- "Known Limitations" section is present
- Section is not empty
- Content is either specific limitations OR explicit "None identified at this time"

**Good Example (with limitations)**:
```markdown
## Known Limitations

- **Token revocation**: Individual token revocation is not implemented.
  Workaround: Wait for token expiry or rotate JWT secret (affects all users).
- **Rate limiting**: Login rate limiting is per-IP only. Distributed attacks
  are not blocked. Consider per-user rate limiting in future work.
- **MFA**: Multi-factor authentication is deferred to AUTH-003.
```

**Good Example (no limitations)**:
```markdown
## Known Limitations

None identified at this time. This feature has been tested against all
documented edge cases and integrates cleanly with existing systems.
```

**Bad Example**:
```markdown
## Known Limitations

(empty)
```

---

## Rule DOC-06: Complete Data Model Specification

**Rule**: The Data Model Specification section MUST fully document all entities for recreation purposes.

**Requirements for each entity**:
- Entity name and purpose
- Complete field list with: name, type, constraints, default, description
- Primary key and unique constraints
- Relationships with cardinality (one-to-many, etc.)
- Indexes with rationale for each
- 2-3 sample data records showing expected patterns

**Verification**:
- All entities touched by this unit are documented
- Field definitions include all required attributes (type, constraints, default, description)
- Relationships specify cardinality
- At least one index is documented with rationale (or explicit "no indexes needed")
- Sample data provided

**Good Example**: See `documentation/feature-docs.md` section 4 for complete template.

---

## Rule DOC-07: Interface Contracts

**Rule**: Public interfaces that other code depends on MUST be documented with signatures, types, and invariants.

**Requirements**:
- Function/method signatures with parameters, returns, and exceptions
- Type definitions for complex inputs/outputs
- Events/hooks with payloads and trigger conditions (if applicable)
- Invariants and guarantees the implementation provides

**Verification**:
- All public functions/methods are listed with complete signatures
- Return types and error conditions documented
- If events/hooks exist, they are documented with payloads
- At least one invariant documented (or explicit "no invariants")

**Purpose**: Interface contracts define what tests verify and what new implementations must honor during recreation.

---

## Rule DOC-08: Decision Log

**Rule**: Key implementation decisions MUST be documented with alternatives considered and trade-offs accepted.

**Requirements**:
- At least one decision documented (or explicit "no significant decisions")
- For each decision: what was decided, alternatives considered, why chosen, trade-offs accepted
- Architectural, data model, and API design decisions all considered

**Verification**:
- Decision Log section exists and is not empty
- Each decision includes alternatives and rationale
- Trade-offs are explicit (not just "chose the best option")

**Purpose**: When recreating a project, developers need to understand WHY choices were made to make equivalent decisions.

---

## Rule DOC-09: Recreation Notes

**Rule**: Specific guidance for recreating this feature from scratch MUST be provided.

**Requirements**:
- Bootstrap sequence (what to set up first)
- Critical dependencies that must exist
- Common pitfalls and how to avoid them
- Minimum viable vs full implementation distinction (if applicable)

**Verification**:
- Recreation Notes section exists
- Bootstrap sequence is documented
- At least one common pitfall documented (or "no known pitfalls")

**Purpose**: Enables developers to recreate equivalent functionality without reverse-engineering from code.

---

## Enforcement Integration

These rules are enforced during the Feature Documentation stage of Phase 5:

1. Before marking the stage complete, verify all DOC rules
2. Include a "Documentation Compliance" section in the stage completion summary:
   - DOC-01: Compliant / Non-compliant (12 required sections present)
   - DOC-02: Compliant / Non-compliant (working code examples)
   - DOC-03: Compliant / N/A (API before/after, if no modifications)
   - DOC-04: Compliant / Non-compliant (rejected alternatives)
   - DOC-05: Compliant / Non-compliant (known limitations)
   - DOC-06: Compliant / Non-compliant (complete data model)
   - DOC-07: Compliant / Non-compliant (interface contracts)
   - DOC-08: Compliant / Non-compliant (decision log)
   - DOC-09: Compliant / Non-compliant (recreation notes)
3. If any rule is non-compliant, this is a blocking finding
4. Log compliance status in audit.md

---

## Relationship to Phase Rules

This extension works in conjunction with:
- `documentation/feature-docs.md` — defines the Feature Documentation stage process
- `documentation/impact-scan.md` — uses feature doc as source for impact analysis
- `documentation/consistency-check.md` — verifies feature doc consistency

The extension defines **what** must be in the document; the phase rules define **how** the document is created and validated.
