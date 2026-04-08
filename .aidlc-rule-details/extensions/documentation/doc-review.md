# Impact Scan and Documentation Review Standards

## Overview

These documentation review rules are MANDATORY cross-cutting constraints that apply during Phase 5 (Documentation & Consolidation). They define the standards for impact scanning and documentation updates.

**Enforcement**: The Impact Scan and Cross-Doc Update stages MUST verify compliance with these rules before presenting stage completion messages.

### Blocking Documentation Finding Behavior

A **blocking documentation finding** means:
1. The finding MUST be listed in the stage completion message under a "Documentation Findings" section with the REVIEW rule ID and description
2. The stage MUST NOT present the "Continue to Next Stage" option until all blocking findings are resolved
3. The model MUST present only the "Request Changes" option with a clear explanation of what needs to change
4. The finding MUST be logged in `aidlc-docs/audit.md` with the REVIEW rule ID, description, and stage context

### Default Enforcement

All rules in this document are **blocking** by default. If any rule's verification criteria are not met, it is a blocking documentation finding — follow the blocking finding behavior defined above.

---

## Rule REVIEW-01: Impact Scan Scope

**Rule**: The impact scan MUST check all of the following locations for affected documentation:

| Location | What to Scan |
|----------|--------------|
| `docs/` | All project documentation files |
| `README.md` | Project readme at repository root |
| `openapi.yaml` | API specification (and variants: `swagger.yaml`, `openapi.json`) |
| `aidlc-docs/` | All domain feature docs from prior units |
| `CLAUDE.md` | Workflow instructions (if unit affects workflow behavior) |

**Verification**:
- Scan report shows all five locations were checked
- If a location doesn't exist, it is marked as "not present" rather than skipped silently
- No project documentation locations are excluded from the scan

---

## Rule REVIEW-02: Affected Document Definition

**Rule**: A document is considered "affected" and must be updated if it references any of the following:

| Change Type | What Makes a Doc Affected |
|-------------|---------------------------|
| **Code Reference** | References a class, function, or module changed in this unit |
| **API Endpoint Added** | Describes an API surface that now has a new endpoint |
| **API Endpoint Modified** | Shows request/response format that has changed |
| **API Endpoint Removed** | References an endpoint that no longer exists |
| **Database Change** | References a database table or column touched by this unit |
| **Configuration Change** | Lists environment variables or settings that were added/changed |
| **Dependency Change** | Lists dependencies that were added or version-pinned |

**Verification**:
- Each document in the affected list has a clear reason mapped to one of the above categories
- Documents are not excluded arbitrarily — if they reference changed items, they are affected
- The determination is objective, not subjective ("seems related")

---

## Rule REVIEW-03: Specific Scan Output

**Rule**: The impact scan MUST produce a specific, actionable list — not vague references.

**Bad Output**:
```
- Check the auth docs
- Update API documentation
- Review configuration section
```

**Good Output**:
```
- docs/auth.md line 47: references JWT payload shape which changed (added email claim)
- docs/api-reference.md lines 123-145: shows old response format for GET /users/{id}
- README.md line 89: lists environment variables, missing new JWT_SECRET
- openapi.yaml paths./api/auth/login: endpoint does not exist yet, needs adding
```

**Requirements**:
- Include file path
- Include line number or section reference when possible
- Include specific reason why the document is affected
- Describe what needs to change

**Verification**:
- Every affected file entry includes a file path
- Every entry includes a specific reason (not "needs updating")
- Line numbers or section names are provided where applicable
- The list is actionable — a developer could start updating immediately

---

## Rule REVIEW-04: Post-Update Consistency Verification

**Rule**: After updating a document, verify the updated sections are internally consistent with the rest of the document.

**Purpose**: A targeted update should not create a contradiction elsewhere in the same document.

**What to Check**:
- Terminology consistency (new section uses same terms as existing content)
- No contradictory statements (e.g., two sections describing different default values)
- Cross-references are valid (links to other sections still work)
- Version references are aligned (don't mix v1 and v2 references)

**Verification**:
- Each updated file has a consistency check performed
- Any contradictions introduced by the update are identified and resolved
- The update doesn't orphan existing content (e.g., removing something referenced elsewhere)

**Example Contradiction**:
```markdown
## Configuration (existing section)
The default timeout is 30 seconds.

## New Feature (added section)
The default timeout is 60 seconds for enhanced requests.
```

This creates ambiguity — which is the actual default? The update must either:
- Clarify both sections refer to different contexts
- Update the existing section to align with the new behavior
- Explicitly document the override behavior

---

## Rule REVIEW-05: No Orphaned References

**Rule**: Documentation updates MUST NOT create orphaned references — links, mentions, or cross-references that point to content that no longer exists or has been renamed.

**What to Check**:
- Internal links (`[see authentication](#authentication)`) still resolve
- Referenced code entities (function names, class names) still exist
- Version numbers mentioned are current
- Example commands and code snippets are still valid

**Verification**:
- After updates, scan for broken internal references
- Verify any mentioned code entities match actual implementation
- Flag any references to deprecated or removed items

---

## Enforcement Integration

These rules are enforced during the Impact Scan and Cross-Doc Update stages of Phase 5:

### Impact Scan Stage

1. Before presenting scan results, verify:
   - REVIEW-01: All locations were scanned
   - REVIEW-02: Affected determination follows defined criteria
   - REVIEW-03: Output is specific and actionable
2. Include compliance status in scan completion message

### Cross-Doc Update Stage

1. After each update, verify:
   - REVIEW-04: Consistency check performed
   - REVIEW-05: No orphaned references created
2. Include compliance status in update completion message
3. If any rule is non-compliant, this is a blocking finding

---

## Impact Scan Output Template

Use this format for scan results:

```markdown
# Impact Scan Results: {UNIT-ID}

**Scanned**: {timestamp}
**Locations Checked**: 5/5

## Affected Documents

| # | File | Line/Section | Reason | Update Needed |
|---|------|--------------|--------|---------------|
| 1 | docs/auth.md | Line 47 | JWT payload shape changed | Update payload example |
| 2 | docs/api-reference.md | Lines 123-145 | Response format changed | Update GET /users response |
| 3 | README.md | Line 89 | Missing env var | Add JWT_SECRET |
| 4 | openapi.yaml | paths | New endpoint | Add /api/auth/login |

## Locations Checked

- [x] docs/ — 15 files scanned, 2 affected
- [x] README.md — affected
- [x] openapi.yaml — affected
- [x] aidlc-docs/ — 3 feature docs scanned, 0 affected
- [x] CLAUDE.md — not affected

## REVIEW Rule Compliance

- REVIEW-01: ✅ Compliant (all locations scanned)
- REVIEW-02: ✅ Compliant (affected criteria applied)
- REVIEW-03: ✅ Compliant (specific output provided)
```

---

## Relationship to Phase Rules

This extension works in conjunction with:
- `documentation/impact-scan.md` — defines the Impact Scan stage process
- `documentation/cross-doc-update.md` — defines the update process
- `documentation/consistency-check.md` — performs broader consistency verification

The extension defines **standards** for the scan and updates; the phase rules define **how** the process is executed.
