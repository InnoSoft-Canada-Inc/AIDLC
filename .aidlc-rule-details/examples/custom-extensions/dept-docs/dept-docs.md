# Department-Level Documentation Extension

## Extension Type
Conditional (enabled/disabled per project)

## Integration Point
After Feature Documentation stage in Documentation & Consolidation phase

## Opt-In Prompt

**Question**: Does this project need department-level documentation for non-technical stakeholders (Sales, Marketing, Support)?

**When to enable**:
- Product features need to be communicated to sales teams
- Marketing needs feature messaging and use cases
- Support teams need customer-facing documentation
- Cross-functional teams need shared understanding

**When to skip**:
- Internal tools with no external stakeholders
- Backend-only projects with no customer-facing impact
- Solo developer projects
- Open-source libraries without business stakeholders

## Rules

### DEPT-DOC-01: Department Documentation Required
**When**: After Feature Documentation is complete and approved
**What**: Generate department-specific documentation based on feature doc
**Departments**: Sales, Marketing, Support/Customer Success
**Verification**: All three department docs exist in `{domain}/{unit}/documentation/`

### DEPT-DOC-02: Content Derivation
**When**: Generating department docs
**What**: All content must be derived from approved feature documentation
**Verification**: Department docs reference feature doc as source, no contradictions

### DEPT-DOC-03: Template Compliance
**When**: Generating department docs
**What**: Each department doc must follow its template structure
**Verification**: All required sections from template are present

## Enforcement

**Blocking conditions**:
- Feature Documentation must be complete before department docs
- All three department docs must be generated (Sales, Marketing, Support)
- Content must align with feature doc (no contradictions)

**Non-blocking advisories**:
- Department docs may need manual editing for tone/branding
- Consider stakeholder review before finalizing

## Stage Definition

See `dept-documentation.md` for detailed stage process.
