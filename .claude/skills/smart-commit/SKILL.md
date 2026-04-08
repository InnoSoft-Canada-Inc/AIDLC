---
name: smart-commit
description: Generate properly formatted AI-DLC commit messages from staged changes. Use when committing code or documentation, or when asking "create commit message", "what should my commit message be", or "help me commit".
---

# Smart Commit Message Generator

Generates AI-DLC compliant commit messages following the framework's conventions.

## What This Does

Analyzes staged git changes and generates commit messages following AI-DLC conventions:
- **Code commits**: `feat({domain}): {description} ({UNIT-ID})`
- **Docs commits**: `docs(aidlc): {UNIT-ID} complete — {details}`
- **Other types**: `fix`, `refactor`, `test`, `chore` as appropriate

## AI-DLC Commit Conventions

The framework uses a two-commit pattern per unit:

1. **Code commit** - Implementation work:
   ```
   feat({domain}): {concise description} ({UNIT-ID})

   {Optional detailed body}
   ```

2. **Documentation commit** - Session summary, backlog, feature docs:
   ```
   docs(aidlc): {UNIT-ID} complete — session summary, backlog, feature docs updated
   ```

Other commit types:
- `fix({domain}): {description} ({UNIT-ID})` - Bug fixes
- `refactor({domain}): {description} ({UNIT-ID})` - Code restructuring
- `test({domain}): {description} ({UNIT-ID})` - Test additions
- `chore: {description}` - Maintenance tasks

## Instructions

When invoked:

1. **Check for staged changes**:
   - Run `git diff --cached --name-only` to list staged files
   - If nothing staged: "No changes staged. Stage changes with: git add {files}"

2. **Analyze change type**:
   - **AI-DLC docs** (`aidlc-docs/**`): Documentation commit
   - **Application code** (`src/`, `lib/`, etc.): Code commit
   - **Tests** (`test/`, `tests/`, `*.test.*`): Test commit
   - **Mixed changes**: Suggest separate commits

3. **Determine domain and UNIT-ID**:
   - Read `aidlc-docs/aidlc-state.md` for current UNIT-ID and domain
   - If not in AI-DLC workflow: Prompt user for domain/unit or use generic message

4. **Generate commit message**:
   - Choose appropriate type (feat/fix/docs/test/refactor/chore)
   - Include domain scope for code changes
   - Include UNIT-ID if available
   - Write concise, imperative description

5. **Present options**:
   - Show generated message
   - Offer to commit directly or let user copy/modify

## Output Format

```
## Suggested Commit Message

{type}({scope}): {description} ({UNIT-ID})

**Files changed**: {count} files
- {file1}
- {file2}
...

**Commands**:
```bash
# Copy this command to commit:
git commit -m "{generated message}"
```

{If mixed changes:}
⚠️ **Mixed changes detected**: Consider splitting into separate commits:
- Code changes: {list}
- Doc changes: {list}
```

## Examples

**Scenario 1 - Feature code**:
```
Staged: src/auth/jwt.js, src/middleware/auth.js
Current: AUTH-001 in Construction phase

Generated:
feat(auth): add JWT token validation (AUTH-001)
```

**Scenario 2 - Documentation**:
```
Staged: aidlc-docs/auth/AUTH-001/documentation/feature-doc.md
Current: AUTH-001 in Documentation phase

Generated:
docs(aidlc): AUTH-001 complete — session summary, backlog, feature docs updated
```

**Scenario 3 - Bug fix**:
```
Staged: src/api/routes.js
Current: API-003 in Testing phase

Generated:
fix(api): correct route parameter validation (API-003)
```

## Edge Cases

- **No UNIT-ID available**: Use generic format without UNIT-ID
- **Multiple domains affected**: Suggest multi-scope or separate commits
- **Non-standard changes** (config, build files): Use `chore:` type
- **Emergency hotfix**: Suggest `fix:` with descriptive message

## Advanced Features

- **Conventional commits validation**: Check if message follows conventions
- **Length checking**: Warn if subject line > 72 characters
- **Body suggestions**: For complex changes, suggest adding commit body

## Integration

Works seamlessly with AI-DLC workflow:
- After Code Generation: Suggests feat commit
- After Documentation: Suggests docs commit
- During Hotfix: Suggests fix commit
