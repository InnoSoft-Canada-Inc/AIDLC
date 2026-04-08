---
name: find-definition
description: Quickly find where classes, functions, or variables are defined in the codebase. Use when asking "where is X defined", "find definition of", "where's the implementation", or navigating unfamiliar code.
---

# Code Definition Finder

Quickly locates class, function, and variable definitions in your codebase.

## What This Does

Uses smart pattern matching to find where code entities are defined:
- Class definitions
- Function/method definitions
- Variable/constant declarations
- Interface/type definitions
- Component definitions (React, Vue, etc.)

## Instructions

When invoked with a search term:

1. **Parse search term**:
   - Extract the identifier name (class/function/variable name)
   - If no term provided, ask: "What do you want to find?"

2. **Determine search patterns** based on common language syntax:
   - **JavaScript/TypeScript**:
     - `class {term}`
     - `function {term}`
     - `const {term} =`
     - `export function {term}`
     - `interface {term}`
     - `type {term} =`
   - **Python**:
     - `def {term}(`
     - `class {term}(`
     - `{term} = lambda`
   - **Java/C#**:
     - `class {term}`
     - `interface {term}`
     - `public/private .* {term}(`
   - **Go**:
     - `func {term}(`
     - `type {term} struct`

3. **Search codebase**:
   - Use Grep tool with appropriate patterns
   - Exclude common non-source directories: `node_modules`, `vendor`, `dist`, `build`, `.git`
   - Search only in likely source directories: `src/`, `lib/`, `app/`, project root

4. **Rank results**:
   - Prioritize exact matches over partial
   - Prioritize source files over test files
   - Show most relevant first

5. **Present with context**:
   - Show file path as clickable link
   - Show 2-3 lines of code context
   - Highlight the definition line

## Output Format

```
## Found {N} definition(s) for "{term}"

### Primary Definition
**[{filename}:{line}]({path}#L{line})**
```{language}
{context lines showing definition}
```

{If multiple matches:}
### Other Matches
**[{filename}:{line}]({path}#L{line})** - {brief context}
**[{filename}:{line}]({path}#L{line})** - {brief context}

{If too many matches:}
💡 **Tip**: {N} total matches found. Showing top 5. Refine search with more context.
```

## Smart Features

1. **Language detection**: Automatically detect language from file extensions
2. **Case sensitivity**: Try case-insensitive if no exact matches
3. **Fuzzy matching**: Suggest similar names if exact match not found
4. **Import tracking**: Optionally show where the definition is imported

## Examples

**User asks**: "Where is UserService defined?"
**User asks**: "Find the authenticateUser function"
**User asks**: "Show me the definition of JWT_SECRET"
**User asks**: "Where's the TodoList component?"

## Edge Cases

- **No matches found**:
  - "No definition found for '{term}'. Possible reasons:
    - Typo in name
    - Defined in external library
    - Using different naming convention"
  - Suggest similar names if found

- **Too many matches** (>10):
  - Show top 5 most relevant
  - Suggest more specific search: "Try: /find-definition {term} in {directory}"

- **Ambiguous results**:
  - Group by type (class vs function vs variable)
  - Show all with context for user to choose

## Advanced Usage

- `/find-definition {term}` - Basic search
- `/find-definition {term} in {path}` - Scoped search
- `/find-definition {term} *.js` - File type filter

## Performance

- Excludes `node_modules/`, `vendor/`, `dist/`, `build/`, `.git/` by default
- Limits results to top 10 for readability
- Fast response using Grep tool

## Integration with AI-DLC

Particularly useful during:
- **Reverse Engineering** phase - Understanding existing code
- **Construction** phase - Finding patterns to reuse
- **Testing & Validation** phase - Understanding integration points
