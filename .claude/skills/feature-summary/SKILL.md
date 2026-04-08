---
name: feature-summary
description: Get a concise summary of any completed AI-DLC feature including what was built, key decisions, and API contracts. Use when asking "what does UNIT-X do", "summarize feature", or "what was built in".
---

# Feature Summary Generator

Provides quick, digestible summaries of completed AI-DLC features.

## What This Does

Reads a feature's documentation and extracts the most important information:
- What was built (high-level summary)
- Key architecture decisions and rationale
- API contracts and interfaces
- Data model overview
- How to test/use it
- Known limitations

## Instructions

When invoked:

1. **Identify the feature**:
   - If user provides UNIT-ID, use it directly
   - If user provides description, search aidlc-backlog.md for matching unit
   - If ambiguous, ask: "Which unit? (provide UNIT-ID or more details)"

2. **Locate feature documentation**:
   - Find the feature-doc.md at: `aidlc-docs/{domain}/{unit-id}/documentation/feature-doc.md`
   - If not found, check domain docs index: `aidlc-docs/{domain}/docs/`

3. **Extract key sections**:
   - **What Was Built**: First major section
   - **Architecture Decisions**: Decision log section
   - **API Contracts**: Any endpoints, function signatures, events
   - **Data Model**: Entity definitions, relationships
   - **How to Test**: Manual testing section
   - **Known Limitations**: Constraints or deferred decisions

4. **Generate concise summary**:
   - Lead with 2-3 sentence overview
   - Bullet key decisions (max 3-4)
   - List API contracts if any
   - Note data model changes if any
   - Mention testing approach
   - Flag any limitations

## Output Format

```
## Feature Summary: {UNIT-ID} - {Title}

### Overview
{2-3 sentence summary of what was built and why}

### Key Decisions
- {Decision 1}: {Brief rationale}
- {Decision 2}: {Brief rationale}
- {Decision 3}: {Brief rationale}

{If API contracts exist:}
### API Contracts
- `{HTTP method} {endpoint}` - {purpose}
- `{function signature}` - {purpose}

{If data model changes exist:}
### Data Model
- **{Entity}**: {key fields} - {purpose}

### How to Use/Test
{Brief instructions or example}

{If limitations exist:}
### Known Limitations
- {Limitation 1}
- {Limitation 2}

📄 **Full docs**: [{unit-id}/documentation/feature-doc.md]({path})
```

## Edge Cases

- **Feature not found**: "Feature {UNIT-ID} not found. Check UNIT-ID or search backlogs."
- **Feature in progress**: Note that docs may be incomplete, show what's available
- **Multiple matches**: Present list of matching units, ask user to clarify
- **Very sparse documentation**: Note that documentation is minimal, show what's available

## Examples

**User asks**: "Summarize AUTH-001"
**User asks**: "What does the authentication feature do?"
**User asks**: "Give me a quick overview of API-003"
**User asks**: "What was built in the user management unit?"

## Advanced Usage

- `/feature-summary {UNIT-ID}` - Direct unit lookup
- `/feature-summary {domain}` - List all features in domain
- `/feature-summary recent` - Show last 3 completed features

## Integration with Other Skills

Works well with:
- `/aidlc-status` - Find current unit, then summarize it
- `/doc-search` - Find a unit, then summarize it
