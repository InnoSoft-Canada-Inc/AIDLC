---
name: doc-search
description: Search across all AI-DLC generated documentation to find past decisions, API contracts, data models, or requirements. Use when looking for "where did we define", "what was the decision about", or "find documentation for".
---

# AI-DLC Documentation Search

Searches across all AI-DLC generated documentation to quickly find information.

## What This Does

Performs a comprehensive search across:
- Feature documentation (`aidlc-docs/{domain}/{unit}/documentation/`)
- Requirements (`aidlc-docs/_shared/requirements/`)
- User stories (`aidlc-docs/_shared/user-stories/`)
- Functional designs (`aidlc-docs/{domain}/{unit}/construction/functional-design/`)
- Session summaries
- Backlog entries

## Instructions

When invoked with a search query:

1. **Parse the search query**:
   - Extract keywords from user's request
   - If no explicit query, ask: "What would you like to search for?"

2. **Search strategy**:
   - Use Grep tool to search `aidlc-docs/` directory recursively
   - Search for the keyword(s) case-insensitively
   - Focus on markdown files (*.md)

3. **Prioritize results**:
   - Feature docs (feature-doc.md) - highest priority
   - Requirements and user stories - high priority
   - Functional designs - medium priority
   - Session summaries and other docs - lower priority

4. **Extract context**:
   - Show 2-3 lines before and after each match
   - Include file path with clickable link format: `[filename.md:line](path/to/file.md#Lline)`

## Output Format

```
## Search Results for "{query}"

Found {N} matches across {M} files:

### Feature Documentation
**[{UNIT-ID}]({path/to/feature-doc.md})** - {unit-title}
> {context snippet with match highlighted}
Line {number}

### Requirements
**[requirements.md]({path})** - {section}
> {context snippet}
Line {number}

### Other Matches
...

**No results?** Try:
- Broader keywords
- Alternative terminology
- Searching in specific domain: /doc-search [domain] [query]
```

## Search Tips

Include helpful tips if search returns too many/few results:
- Too many results: "Refine with more specific terms"
- Too few results: "Try broader keywords or check spelling"
- No results: "No documentation found. This might be undocumented."

## Examples

**User asks**: "Find documentation for JWT authentication"
**User asks**: "Where did we define the user data model?"
**User asks**: "What was the decision about caching?"
**User asks**: "Search for error handling in docs"

## Advanced Usage

Support domain-scoped search:
- `/doc-search auth token` - searches within auth domain
- `/doc-search api` - searches across all domains for "api"

## Edge Cases

- Empty query: Ask user what to search for
- No aidlc-docs/ folder: "AI-DLC not initialized or no documentation generated yet"
- Very large result sets (>20 matches): Show top 10 most relevant with option to see more
