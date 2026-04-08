# Contract Validation

## Purpose

**Verify implementation matches specifications and consumer expectations**

Contract Validation focuses on:
- Validating API implementations match OpenAPI specs
- Verifying tool schemas match consumer expectations
- Flagging any drift between spec and implementation
- Preventing silent data errors for SDK consumers

**Note**: Contract drift is dangerous because SDK consumers will silently receive wrong data without any error being thrown.

## Prerequisites

- Regression Run must be complete
- All legitimate regressions fixed
- Test updates for intentional changes complete
- API/tool implementations finalized

---

## Why Contract Validation Matters

When a contract drifts from its specification:

1. **SDK consumers receive wrong data** — Fields may be missing, renamed, or have different types
2. **No errors are thrown** — The response is still valid JSON/data, just not what was expected
3. **Failures are silent** — Consumers don't know they're getting incorrect data
4. **Debugging is hard** — Issues manifest far from the source of the problem

Contract validation catches these issues before they reach production.

---

## Steps to Execute

### Step 1: Identify Contracts to Validate

Determine which contracts this unit affects:

| Contract Type | Location | When to Validate |
|---------------|----------|------------------|
| **OpenAPI/REST** | `openapi.yaml` or similar | Unit touches API layer |
| **Tool Schemas** | Tool definition files | Unit adds/modifies service tools |
| **Event Schemas** | Event definition files | Unit publishes events |
| **GraphQL** | Schema files | Unit modifies GraphQL resolvers |
| **gRPC** | Proto files | Unit modifies gRPC services |

### Step 2: API Contract Validation

For units touching the API layer:

#### Step 2a: Load OpenAPI Specification

Read the canonical OpenAPI spec (typically `openapi.yaml` or equivalent).

#### Step 2b: Extract Affected Endpoints

Identify all endpoints modified or added by this unit.

#### Step 2c: Compare Implementation to Spec

For each affected endpoint, verify:

| Aspect | Validation |
|--------|------------|
| **Path** | Endpoint path matches spec exactly |
| **Method** | HTTP method matches spec |
| **Request Schema** | Request body matches spec schema |
| **Response Schema** | Response body matches spec schema |
| **Status Codes** | All returned status codes are documented |
| **Headers** | Required headers are present |
| **Query Parameters** | Parameters match spec definitions |

#### Step 2d: Document Findings

```markdown
## API Contract Validation

### Endpoint: {METHOD} {path}

| Aspect | Spec | Implementation | Status |
|--------|------|----------------|--------|
| Response Schema | { id: number, name: string } | { id: number, name: string } | ✅ Match |
| Status Codes | 200, 400, 404 | 200, 400, 404, 500 | ⚠️ 500 undocumented |
```

### Step 3: Tool Schema Validation

For units adding or modifying service tools:

#### Step 3a: Load Tool Definitions

Read the tool schema definitions.

#### Step 3b: Identify Affected Tools

List all tools modified or added by this unit.

#### Step 3c: Validate Against Consumer Expectations

For each affected tool, verify:

| Aspect | Validation |
|--------|------------|
| **Input Schema** | Input parameters match what callers send |
| **Output Schema** | Output matches what callers expect |
| **Required Fields** | All required fields are present |
| **Field Types** | Data types match expectations |
| **Error Handling** | Error responses match documented format |

#### Step 3d: Document Findings

```markdown
## Tool Schema Validation

### Tool: {tool_name}

| Aspect | Schema | Implementation | Status |
|--------|--------|----------------|--------|
| Input: user_id | string (required) | string (required) | ✅ Match |
| Output: result | { success: boolean } | { success: boolean, data: object } | ⚠️ Extra field |
```

### Step 4: Flag All Drift

Any mismatch between spec and implementation is flagged:

```markdown
## Contract Drift Detected

### ⚠️ Blocking Issues

The following drift was detected between specs and implementation:

| # | Contract | Spec Says | Implementation Does | Risk |
|---|----------|-----------|---------------------|------|
| 1 | GET /users/{id} | Returns `email` field | Missing `email` field | SDK consumers won't receive email |
| 2 | createUser tool | Output: `{ id }` | Output: `{ user_id }` | Field name mismatch breaks callers |

### Why This Is Blocking

Contract drift means SDK consumers will silently receive wrong data. This must be resolved before proceeding:

**Option A**: Update implementation to match spec
**Option B**: Update spec to match implementation (requires consumer notification)

These issues cannot be ignored or deferred.
```

### Step 5: Present Validation Results

```markdown
**Contract Validation Complete**

**Contracts Validated**: {count}
**Matches**: {count}
**Drift Detected**: {count}

{If no drift}
✅ **All contracts validated successfully.**

Implementation matches specifications. Ready to proceed to Coverage Report.

{If drift detected}
⚠️ **Contract drift detected — blocking issue.**

{count} contract(s) have drift between spec and implementation:

1. **{contract}**: {brief description of drift}
2. **{contract}**: {brief description of drift}

**This is a blocking issue.** Contract drift must be resolved before proceeding.

Options:
A) Update implementation to match spec
B) Update spec to match implementation
C) Review detailed drift report

How would you like to proceed?

[Answer]:
```

### Step 6: Resolution Workflow

#### If updating implementation

1. Return to Construction to fix implementation
2. Re-run Testing & Validation from Integration Tests

#### If updating spec

1. Update the spec file to match implementation
2. Document the spec change and rationale
3. Notify consumers of the spec change (if applicable)
4. Proceed to Coverage Report

---

## Drift Categories

### Critical Drift (Blocking)

- Missing required fields in responses
- Wrong data types
- Renamed fields without aliases
- Removed endpoints
- Changed authentication requirements

### Warning Drift (Review Required)

- Extra fields in responses (usually safe)
- Undocumented status codes
- Additional optional parameters
- Documentation-only discrepancies

### Acceptable Variance

- Whitespace differences
- Field ordering differences
- Extra metadata fields marked as optional

---

## Common Drift Patterns

### Field Rename Without Alias

**Spec**: `user_id`
**Implementation**: `userId`

**Risk**: All consumers expecting `user_id` will fail.

**Fix**: Either rename back, or add alias and deprecation period.

### Type Change

**Spec**: `id: number`
**Implementation**: `id: string`

**Risk**: Consumer type validation fails, or wrong calculations.

**Fix**: Match spec type, or version the API.

### Missing Field

**Spec**: `{ name, email, created_at }`
**Implementation**: `{ name, email }`

**Risk**: Consumers expecting `created_at` receive undefined.

**Fix**: Add the missing field to implementation.

### Extra Undocumented Field

**Spec**: `{ name, email }`
**Implementation**: `{ name, email, internal_id }`

**Risk**: Low, but consumers may start depending on undocumented field.

**Fix**: Either document the field or remove it.

---

## Integration with Workflow

### Blocking Behavior

Contract drift is **always blocking**. The workflow cannot proceed to Coverage Report until all drift is resolved.

```
Contract Validation → [Drift Found] → Construction → Testing & Validation (full re-run)
```

### Clean Path

```
Contract Validation → [No Drift] → Coverage Report
```

---

## Best Practices

1. **Spec-first development**: Write specs before implementation to reduce drift
2. **Automate validation**: Use tools like spectral, dredd, or similar for automated checking
3. **Version APIs**: Major changes should use API versioning, not silent updates
4. **Consumer notification**: Spec changes require notifying affected consumers
5. **Zero tolerance for blocking drift**: Never proceed with known contract violations
