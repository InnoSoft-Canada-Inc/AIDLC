# AIDLC Customization Guide (Detailed)

**Version**: 1.0.0
**Last Updated**: 2026-03-04

---

## Overview

This guide provides detailed instructions for creating custom extensions to AIDLC. For a quick start guide, see `CUSTOMIZATION.md` in the repository root.

---

## Table of Contents

1. [Philosophy and Principles](#philosophy-and-principles)
2. [Architecture Overview](#architecture-overview)
3. [Extension Types](#extension-types)
4. [Creating Extensions from Scratch](#creating-extensions-from-scratch)
5. [Integration Points](#integration-points)
6. [Testing Custom Extensions](#testing-custom-extensions)
7. [Advanced Patterns](#advanced-patterns)
8. [Troubleshooting](#troubleshooting)

---

## Philosophy and Principles

### Core Design Principles

1. **Core Stays Generic**: AIDLC framework must work for open-source projects, solo developers, backend APIs, frontend apps, and everything in between
2. **Customizations Are Isolated**: Business-specific features live in separate directory, never in core
3. **User Responsibility**: Custom extensions are maintained by users, not the core AIDLC team
4. **Update-Safe**: Customizations survive framework updates via directory copy

### When to Customize vs. Contribute to Core

**Create a custom extension IF**:
- Feature is specific to your industry (healthcare, finance, etc.)
- Feature requires integration with your internal tools
- Feature implements company-specific workflows
- Feature wouldn't benefit most AIDLC users

**Contribute to core IF**:
- Feature would benefit most AIDLC users
- Feature is universally applicable (not industry-specific)
- Feature improves the workflow for all project types

---

## Architecture Overview

### Directory Structure

```
.aidlc-rule-details/
├── extensions/
│   ├── documentation/          # Core extensions (from release)
│   │   ├── doc-creation.md
│   │   └── doc-review.md
│   ├── security/               # Core extensions (from release)
│   │   ├── baseline/
│   │   └── compliance/
│   ├── ui/                     # Core extensions (from release)
│   │   └── baseline/
│   └── custom/                 # YOUR customizations
│       ├── README.md           # Extension index (enable/disable)
│       ├── .gitkeep            # Ensures directory exists
│       └── *.md                # Your extension files
```

### Loading Mechanism

1. **Session Start**: CLAUDE.md checks if `extensions/custom/README.md` exists
2. **Parse Index**: Reads README.md for enabled extensions (marked with `[x]`)
3. **Load Extensions**: For each enabled extension, loads the file from `custom/`
4. **Execute**: Runs extension logic at specified integration points
5. **Audit**: Logs custom extension usage in `aidlc-docs/audit.md`

### Extension File Structure

```markdown
# {Extension Name}

## Extension Type
[Conditional | Always-On | Stage | Hook]

## Integration Point
[When/where this extension runs]

## Opt-In Prompt (if conditional)
**Question**: [Yes/No question asked during Requirements Analysis]
**When to enable**: [Guidance]
**When to skip**: [Guidance]

## Rules
[Rule definitions with ID, condition, requirement, verification]

## Enforcement
[How to verify compliance, blocking vs advisory]

## Stage Definition (if adding a stage)
[Link to detailed stage process file]
```

---

## Extension Types

### 1. Conditional Extensions

**Definition**: Enabled/disabled per project based on applicability

**Example**: Department-level documentation (only for product teams)

**Opt-In Prompt Pattern**:
```markdown
## Opt-In Prompt

**Question**: Does this project need {feature description}?

**When to enable**:
- [Scenario 1]
- [Scenario 2]

**When to skip**:
- [Scenario 1]
- [Scenario 2]
```

**Configuration**: Asked during Requirements Analysis, stored in `aidlc-state.md`

### 2. Always-On Extensions

**Definition**: Loaded and enforced in every session

**Example**: Company-wide security policies, compliance checks

**No Opt-In Prompt**: Always applies, no conditional logic

**Use Case**: Mandatory company policies that apply to all projects

### 3. Stage Extensions

**Definition**: Add new stages to existing phases

**Example**: Department Documentation stage after Feature Documentation

**Pattern**:
- Extension file (`your-extension.md`) defines rules and integration point
- Stage definition file (`your-stage.md`) defines detailed process
- Both files referenced in extension

### 4. Hook Extensions

**Definition**: Execute at specific workflow events

**Example**: Post to Slack when unit completes, create Jira ticket on failure

**Integration Points**: Phase transitions, stage completion, approval gates

---

## Creating Extensions from Scratch

### Step 1: Define Your Extension's Purpose

**Questions to answer**:
1. What business problem does this solve?
2. Who needs this? (personas, teams, industries)
3. When should this run? (which phase, which stage)
4. What outputs does it create?
5. What rules must be enforced?

**Example**: Department-level documentation
- **Problem**: Non-technical teams need feature information without reading technical docs
- **Who**: Product teams with Sales, Marketing, Support stakeholders
- **When**: After Feature Documentation in Documentation phase
- **Outputs**: dept-sales.md, dept-marketing.md, dept-support.md
- **Rules**: All three docs must be generated, content derived from feature doc

### Step 2: Choose Extension Type

Based on your answers above:
- **Conditional**: If only some projects need it
- **Always-On**: If all projects in your company need it
- **Stage**: If adding a new workflow step
- **Hook**: If triggering external action at event

### Step 3: Create Extension File

**Filename**: `{descriptive-name}.md` (lowercase, hyphens)

**Template**:
```markdown
# {Extension Name}

## Extension Type
[Conditional | Always-On | Stage | Hook]

## Integration Point
[Phase name] → [Stage name] → [Before/After/During]

## Opt-In Prompt (if conditional)
**Question**: [Yes/No question]
**When to enable**: [Scenarios]
**When to skip**: [Scenarios]

## Rules

### RULE-01: {Rule Name}
**When**: [Condition when this rule applies]
**What**: [What must happen]
**Verification**: [How to check compliance]
**Enforcement**: [Blocking | Advisory]

### RULE-02: {Rule Name}
[Same pattern]

## Enforcement

**Blocking conditions**:
- [Condition 1 that prevents stage progression]
- [Condition 2 that prevents stage progression]

**Non-blocking advisories**:
- [Advisory 1 that warns but doesn't block]
- [Advisory 2 that warns but doesn't block]

## Stage Definition (if adding a stage)
See `{stage-name}.md` for detailed process.
```

### Step 4: Create Stage Definition (if applicable)

**Filename**: `{stage-name}.md`

**Template**:
```markdown
# {Stage Name}

## Stage Overview
**Phase**: {phase name}
**When**: [Trigger condition]
**Duration**: [Estimate]
**Output**: [What gets created]

## Prerequisites
- [Prerequisite 1]
- [Prerequisite 2]

## Process

### Step 1: {Step Name}
[Detailed instructions]

### Step 2: {Step Name}
[Detailed instructions]

### Step N: Verification
Verify compliance with extension rules:
- [ ] Rule-01 verification
- [ ] Rule-02 verification

### Step N+1: Present for Approval
**Completion Message**:
\`\`\`
[Message template with file paths and compliance summary]
\`\`\`

## Common Pitfalls
1. [Pitfall 1 - how to avoid]
2. [Pitfall 2 - how to avoid]

## Success Criteria
[What defines successful execution]
```

### Step 5: Create Templates (if applicable)

If your extension generates documents, create reusable templates:

**Filename**: `templates/{template-name}.md`

**Example**: `templates/sales-template.md`
```markdown
# Sales Brief: {Feature Name}

## Feature Summary
[1-2 sentence pitch]

## Customer Value
- [Benefit 1]
- [Benefit 2]

[... other sections ...]
```

### Step 6: Enable Extension

**Edit** `.aidlc-rule-details/extensions/custom/README.md`:
```markdown
## Active Custom Extensions

- [x] your-extension.md - Brief description
```

---

## Integration Points

Custom extensions can execute at these workflow locations:

### 1. Requirements Analysis Phase

**When**: During Inception, after user request is captured

**Use Case**: Ask opt-in questions, gather business context

**Example**:
```markdown
## Integration Point
Inception → Requirements Analysis → During (opt-in check)

## Opt-In Prompt
**Question**: Does this project need compliance documentation for SOX?
```

### 2. After Core Stages

**When**: After any built-in stage completes

**Use Case**: Add custom substage, generate additional artifacts

**Example**:
```markdown
## Integration Point
Documentation → After Feature Documentation → Add Department Documentation stage
```

### 3. Before Stage Completion

**When**: Before stage completion message is presented

**Use Case**: Add custom validation, enforce business rules

**Example**:
```markdown
## Integration Point
Construction → Code Generation → Before completion → Verify no hardcoded secrets
```

### 4. Phase Transitions

**When**: Between phases (e.g., Inception → Construction)

**Use Case**: Add approval workflows, send notifications

**Example**:
```markdown
## Integration Point
Phase Transition → Inception → Construction → Manager approval required
```

---

## Testing Custom Extensions

### Test Strategy

1. **Isolated Testing**: Test extension on a sandbox feature first
2. **Integration Testing**: Test with real feature in your project
3. **Regression Testing**: Verify core workflow still works
4. **Documentation Testing**: Verify generated docs are useful

### Test Checklist

**Before Deploying Extension**:
- [ ] Extension file has all required sections
- [ ] Applicability question is clear and unambiguous
- [ ] Rules are verifiable (not subjective)
- [ ] Templates generate usable output
- [ ] Blocking vs advisory enforcement is correct
- [ ] Extension doesn't break core workflow

**Test Scenarios**:
1. **Enable Extension**: Verify opt-in prompt appears
2. **Execute Stage**: Verify custom stage runs at correct point
3. **Verify Output**: Check generated artifacts are useful
4. **Rule Compliance**: Verify rules are enforced correctly
5. **Disable Extension**: Verify workflow runs normally without it

---

## Advanced Patterns

### Pattern 1: Multi-Department Documentation

**Problem**: Different departments need different doc formats

**Solution**: Single extension with multiple templates, user selects which to generate

**Implementation**:
```markdown
## Opt-In Prompt
**Question**: Which departments need documentation? (Select all that apply)
- [ ] Sales
- [ ] Marketing
- [ ] Support
- [ ] Product Management

[Generate only selected department docs]
```

### Pattern 2: External Tool Integration

**Problem**: Need to create Jira ticket when unit completes

**Solution**: Hook extension at Documentation completion

**Implementation**:
```markdown
## Integration Point
Documentation → Backlog Update → After completion → Create Jira ticket

## Process
1. Extract unit metadata (UNIT-ID, domain, summary)
2. Call Jira API to create ticket
3. Link ticket ID in session-summary.md
4. Log ticket creation in audit.md
```

### Pattern 3: Approval Gates

**Problem**: Manager must approve before moving to Construction

**Solution**: Hook extension at phase transition

**Implementation**:
```markdown
## Integration Point
Phase Transition → Inception → Construction → Manager approval required

## Process
1. Generate approval request (email/Slack)
2. Wait for approval response
3. If approved: proceed to Construction
4. If rejected: return to Requirements Analysis with feedback
5. Log approval decision in audit.md
```

---

## Troubleshooting

### Problem: Extension Not Loading

**Symptoms**: Extension doesn't run even though enabled

**Diagnosis**:
1. Check `custom/README.md` has `[x]` checkbox (not `[ ]`)
2. Verify extension filename matches exactly (case-sensitive)
3. Check `aidlc-docs/audit.md` for loading errors

**Solution**: Fix checkbox or filename, restart session

### Problem: Rules Not Enforcing

**Symptoms**: Stage completes despite rule violations

**Diagnosis**:
1. Check rule verification criteria are objective (not subjective)
2. Verify enforcement is marked as "Blocking" (not "Advisory")
3. Check if rule applicability condition is met

**Solution**: Update rule verification to be objective and verifiable

### Problem: Extension Breaks Core Workflow

**Symptoms**: Workflow errors or stalls after enabling extension

**Diagnosis**:
1. Check if extension integration point conflicts with core stages
2. Verify extension doesn't override core rules
3. Check for infinite loops in extension logic

**Solution**: Adjust integration point, disable extension, debug stage process

### Problem: Generated Output Quality Poor

**Symptoms**: Extension generates docs but they're not useful

**Diagnosis**:
1. Review templates for missing sections
2. Check if AI has enough context to generate quality content
3. Verify business context questions are being asked

**Solution**: Improve templates, add opt-in prompts for context

---

## Best Practices

1. **Start Simple**: Begin with one extension, add complexity later
2. **Test Thoroughly**: Use sandbox features before deploying to production
3. **Document Well**: Future you will thank present you for clear docs
4. **Version Control**: Track extension changes like code
5. **Share Learnings**: Contribute successful patterns to community examples
6. **Iterate**: Extensions evolve based on usage feedback

---

## Getting Help

1. **Examples**: Check `.aidlc-rule-details/examples/custom-extensions/` for working examples
2. **Community**: [GitHub Discussions](https://github.com/csiorbit/orbit-aidlc/discussions)
3. **Issues**: [Report bugs](https://github.com/csiorbit/orbit-aidlc/issues)
4. **Quick Guide**: See root `CUSTOMIZATION.md` for quick start

---

## Appendix: Complete Example Walkthrough

See `.aidlc-rule-details/examples/custom-extensions/dept-docs/` for a complete, working example of:
- Extension file with rules and opt-in prompt
- Stage definition with detailed process
- Templates for Sales, Marketing, Support
- Sample output demonstrating what gets generated
- Installation and customization instructions

This example demonstrates all concepts in this guide in a real, usable extension.
