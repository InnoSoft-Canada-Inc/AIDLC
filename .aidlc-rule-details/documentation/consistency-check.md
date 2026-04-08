# Consistency Check

## Purpose

**Verify documentation is internally consistent and accurate**

Consistency Check focuses on:
- Ensuring terminology is used consistently across all updated docs
- Verifying version references are current
- Confirming code examples reflect actual implementation
- Flagging anything that could mislead developers

**Note**: This stage validates the quality of documentation updates made in Cross-Doc Update.

## Prerequisites

- Cross-Doc Update must be complete
- All targeted updates have been made
- Audit log contains all changes

---

## Verification Categories

### 1. Terminology Consistency

**Problem**: Inconsistent terms confuse readers and suggest lack of polish.

**Examples of Inconsistency**:
- "agent" vs "Agent" vs "AI agent" vs "assistant"
- "token" vs "Token" vs "JWT" vs "access token"
- "endpoint" vs "route" vs "API" vs "path"

**Check Process**:

1. Identify key terms from the feature doc
2. Search all updated docs for variations
3. Flag any inconsistencies

```markdown
## Terminology Check

### Term: "access token"

| File | Usage Found | Consistent? |
|------|-------------|-------------|
| docs/api-reference.md | "access token" | ✅ |
| docs/configuration.md | "Access Token" | ⚠️ Case mismatch |
| README.md | "JWT" | ⚠️ Different term |

**Recommendation**: Standardize on "access token" (lowercase) throughout.
```

### 2. Version References

**Problem**: Outdated version references mislead developers.

**Examples of Issues**:
- API v1 patterns where v2 now applies
- Old package versions in examples
- Deprecated method names
- Outdated URLs or paths

**Check Process**:

1. Identify current versions from feature doc and codebase
2. Search updated docs for version references
3. Flag any outdated references

```markdown
## Version Reference Check

### API Version

| File | Reference | Current | Status |
|------|-----------|---------|--------|
| docs/api-reference.md | /api/v2/auth | v2 | ✅ Current |
| README.md | /api/v1/auth | v2 | ❌ Outdated |

### Package Versions

| File | Package | Documented | Actual | Status |
|------|---------|------------|--------|--------|
| README.md | jsonwebtoken | ^8.0.0 | ^9.0.0 | ❌ Outdated |
```

### 3. Code Example Accuracy

**Problem**: Code examples that don't work frustrate developers and erode trust.

**Verification Requirements**:
- Examples must reflect actual implementation
- Import paths must be correct
- Function signatures must match actual code
- Output examples must be realistic

**Check Process**:

1. Extract all code examples from updated docs
2. Verify each against actual implementation
3. Flag any discrepancies

```markdown
## Code Example Check

### Example 1: docs/api-reference.md, line 45

**Documented**:
```javascript
const result = await auth.login(email, password);
```

**Actual Implementation**:
```javascript
const result = await auth.authenticateUser({ email, password });
```

**Status**: ❌ Function name and signature mismatch

**Fix Required**: Update example to use `authenticateUser({ email, password })`
```

### 4. Misleading Content

**Problem**: Content that could mislead a first-time reader wastes their time and causes errors.

**What to Flag**:
- Ambiguous instructions
- Missing prerequisites
- Incomplete examples
- Contradictory statements
- Outdated screenshots or diagrams
- Dead links

**Check Process**:

1. Read each updated section as if seeing it for the first time
2. Ask: "Could this mislead someone?"
3. Flag anything questionable

```markdown
## Misleading Content Check

### Issue 1: docs/configuration.md

**Problem**: Says JWT_SECRET is "optional" but authentication fails without it.

**Location**: Configuration table, row 3

**Fix Required**: Change "optional" to "required" and add note about auth failure.

### Issue 2: README.md

**Problem**: Setup steps don't mention Redis, but auth requires it.

**Location**: Quick Start section

**Fix Required**: Add Redis to prerequisites and setup steps.
```

---

## Steps to Execute

### Step 1: Compile Verification Targets

List all files that were updated in Cross-Doc Update:

```markdown
## Files to Verify

1. docs/api-reference.md
2. docs/configuration.md
3. README.md
4. openapi.yaml
```

### Step 2: Extract Key Terms

From the feature doc, identify terms that should be consistent:

```markdown
## Key Terms

- access token (not "Access Token", not "JWT" alone)
- refresh token (not "Refresh Token")
- authentication (not "auth" in prose, "auth" OK in code/paths)
- token pair (when referring to access + refresh together)
```

### Step 3: Run Checks

Execute each verification category on all updated files.

### Step 4: Compile Findings

```markdown
## Consistency Check Results

**Unit**: {UNIT-ID}
**Checked**: {timestamp}

### Terminology Issues: {count}

| # | File | Issue | Recommended Fix |
|---|------|-------|-----------------|
| 1 | docs/configuration.md | "Access Token" should be "access token" | Update to lowercase |

### Version Reference Issues: {count}

| # | File | Issue | Recommended Fix |
|---|------|-------|-----------------|
| 1 | README.md | References API v1 | Update to v2 |

### Code Example Issues: {count}

| # | File | Issue | Recommended Fix |
|---|------|-------|-----------------|
| 1 | docs/api-reference.md | Wrong function name | Update to authenticateUser |

### Misleading Content: {count}

| # | File | Issue | Recommended Fix |
|---|------|-------|-----------------|
| 1 | docs/configuration.md | JWT_SECRET marked optional | Mark as required |

### Summary

- **Total Issues Found**: {count}
- **Critical (must fix)**: {count}
- **Minor (should fix)**: {count}
```

### Step 5: Present Findings

```markdown
**Consistency Check Complete**

I found **{count}** consistency issues across the updated documentation.

### Critical Issues (Must Fix)

| File | Issue |
|------|-------|
| docs/api-reference.md | Code example uses wrong function signature |
| docs/configuration.md | JWT_SECRET incorrectly marked as optional |

### Minor Issues (Should Fix)

| File | Issue |
|------|-------|
| docs/configuration.md | "Access Token" should be "access token" |
| README.md | References v1 API instead of v2 |

---

**Options**:
A) Fix all issues now
B) Fix critical issues only, note minor issues for later
C) Review detailed findings before deciding

[Answer]:
```

### Step 6: Apply Fixes

For each issue to fix:
1. Make the correction
2. Log the fix in audit.md
3. Verify the fix doesn't introduce new issues

### Step 7: Re-verify

After fixes are applied, re-run the consistency check to confirm:
- All critical issues are resolved
- No new issues were introduced

---

## Severity Guidelines

| Severity | Criteria | Action |
|----------|----------|--------|
| **Critical** | Would cause errors or serious confusion | Must fix before proceeding |
| **High** | Could mislead developers significantly | Should fix before proceeding |
| **Medium** | Inconsistency that looks unprofessional | Fix if time permits |
| **Low** | Minor style preference | Note for future cleanup |

---

## Common Issues and Fixes

### Terminology

| Issue | Fix |
|-------|-----|
| Mixed case (Token vs token) | Standardize to one form |
| Abbreviations (auth vs authentication) | Use full form in prose, abbreviations in code |
| Synonyms (endpoint vs route) | Pick one and use consistently |

### Versions

| Issue | Fix |
|-------|-----|
| Old API version | Update to current version |
| Old package version | Update to match package.json |
| Deprecated methods | Update to current methods |

### Code Examples

| Issue | Fix |
|-------|-----|
| Wrong function name | Match actual implementation |
| Wrong parameters | Match actual signature |
| Missing imports | Add required imports |
| Unrealistic output | Update to realistic values |

### Misleading Content

| Issue | Fix |
|-------|-----|
| Missing prerequisite | Add to prerequisites section |
| Wrong default value | Correct to actual default |
| Incomplete instructions | Add missing steps |

---

## Integration with Workflow

### Input From
- Cross-Doc Update (files that were updated)
- Feature Documentation (source of truth)
- Actual codebase (for verification)

### Output To
- Backlog Update (consistency check results)
- Audit log (all findings and fixes)

---

## Best Practices

1. **Read as a newcomer**: Pretend you've never seen this codebase
2. **Trust the code**: When docs and code disagree, code is usually right
3. **Fix don't flag**: If you can fix it easily, do so
4. **Be specific**: "Terminology issue" is unhelpful; "JWT vs access token" is actionable
5. **Prioritize**: Critical issues first, style issues later
