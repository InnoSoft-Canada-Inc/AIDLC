# Technical Guidelines System

> **For explanatory content and philosophy**, see [RULE_AUTHORING.md § Technical Guidelines Management](/.aidlc-rule-details/RULE_AUTHORING.md#technical-guidelines-management)

---

## MANDATORY: Loading Instructions

**When to load**: During Workspace Detection, BEFORE domain-specific anchor docs
**How to load**: Read path from `aidlc-docs/anchor-map.md` under `## Project-Wide Guidelines` section
**Default path**: `{knowledge_base}/TECHNICAL_GUIDELINES.md`

**Treatment**:
- Immutable constraints throughout session
- Do not suggest alternatives unless explicitly asked
- Violations are blocking findings

---

## File Format Specification

TECHNICAL_GUIDELINES.md MUST include these sections:

```markdown
# Technical Guidelines

## Framework & Versions
- **Framework**: {name and version}
- **Language**: {language and version}
- **Runtime**: {runtime and version}

## Component Standards
- **UI Library**: {library name}
- **State Management**: {state solution}
- **Icons**: {icon library}

## Coding Standards
- {coding convention 1}
- {coding convention 2}
- ...

## API Standards
- {API convention 1}
- {API convention 2}
- ...

## Database Standards
- {database convention 1}
- {database convention 2}
- ...

## Compliance Requirements
| Framework | Required | Rationale |
|-----------|----------|-----------|
| Security Baseline | {Yes/No} | {reason} |
| HIPAA | {Yes/No} | {reason} |
| PCI-DSS | {Yes/No} | {reason} |
| SOC 2 | {Yes/No} | {reason} |
| UI Baseline | {Yes/No} | {reason} |

## Testing Standards
- {testing requirement 1}
- {testing requirement 2}
- ...

## Constraints
<!-- Hard rules that must NEVER be violated -->
- {constraint 1}
- {constraint 2}
- ...

## UI/UX Standards (Optional)
<!-- Omit this section for backend-only/CLI projects -->

### Design System
- **Design System**: {None, Figma URL, Storybook URL}
- **Component Library**: {library name}
- **Icon Library**: {icon library}

### Styling
- **CSS Approach**: {CSS framework/approach}
- **Theme**: {Light only, Dark only, Both}

### Accessibility
- **A11y Standard**: {e.g., WCAG 2.2 AA}
- **Screen Reader Testing**: {Required, Recommended, Not required}

### Performance
- **Core Web Vitals Targets**: {Yes/No}
- **Bundle Size Budget**: {budget or "No budget"}
```

---

## Creation Triggers

### Trigger 1: Create with Content
**Pattern**: `Using AI-DLC, create technical guidelines with [specifications]`

**Workflow**:
1. Parse specifications from user message
2. Check if guidelines file exists (ask Replace/Merge if exists)
3. Generate TECHNICAL_GUIDELINES.md with user specifications
4. Present for approval
5. Write file, add to anchor-map.md, log in audit.md

### Trigger 2: Explicit Update
**Pattern**: `Using AI-DLC, update technical guidelines`

**Workflow**:
1. Load current TECHNICAL_GUIDELINES.md
2. Ask: "What would you like to update?"
3. Generate proposed changes
4. Present diff for approval
5. Update file, log in audit.md

### Trigger 3: Inline Update
**Patterns**:
- "Update my guidelines to use {version/library}"
- "Add {library} to my technical guidelines"
- "Change {setting} in my guidelines to {value}"

**Workflow**:
1. Load current TECHNICAL_GUIDELINES.md
2. Show proposed change (single change only)
3. On approval: update file, log in audit.md
4. Continue with current session

---

## Constraint Application Rules

| Guideline Type | Enforcement Rule |
|----------------|------------------|
| **Version pinning** | Use specified version in package.json, imports. Do not suggest alternatives. |
| **Component standards** | Use specified libraries by default. Suggest alternatives ONLY if specified library cannot fulfill requirement. |
| **Coding standards** | Generate code following conventions. Flag violations in code review. |
| **API standards** | Follow patterns in new endpoints. Flag deviations during Construction. |
| **Database standards** | Apply to all schema designs. Include in Data Model Specification. |
| **Compliance requirements** | Enforce enabled frameworks throughout all phases. Skip opt-in prompts for pre-configured frameworks. |
| **Testing standards** | Enforce during Testing & Validation. Include in coverage requirements. |
| **Hard constraints** | Never violate. If user requests violation, explain constraint and require explicit override confirmation. |

---

## Compliance Requirements Configuration

### Supported Frameworks

| Framework | Extension Path | Description |
|-----------|---------------|-------------|
| Security Baseline | `extensions/security/baseline/` | OWASP Top 10 (2025) |
| HIPAA | `extensions/security/compliance/hipaa/` | Healthcare PHI |
| PCI-DSS | `extensions/security/compliance/pci-dss/` | Cardholder data |
| SOC 2 | `extensions/security/compliance/soc2/` | Trust Services Criteria |
| UI Baseline | `extensions/ui/baseline/` | UI/UX standards |

### Enforcement Rules

When `## Compliance Requirements` section exists in TECHNICAL_GUIDELINES.md:

1. **Skip opt-in prompts**: Do NOT ask "Does this application handle PHI?" if HIPAA is configured as Yes/No
2. **Immediate enforcement**: Enabled frameworks enforced from first stage
3. **Blocking behavior**: Non-compliance blocks stage completion
4. **Audit source**: Log as "TECHNICAL_GUIDELINES.md" not "Requirements Analysis answer"

### Precedence Rules

| Scenario | Behavior |
|----------|----------|
| Configured in TECHNICAL_GUIDELINES.md | Use configured value, skip opt-in prompt |
| Not configured, extension loaded | Ask opt-in prompt during Requirements Analysis |
| Conflicting configuration | TECHNICAL_GUIDELINES.md takes precedence |
| User requests override | Require explicit confirmation, log in audit.md |

---

## Initialization Question

During `Using AI-DLC, initialize project`, ask:

```markdown
## Question: Technical Guidelines (Optional)

Do you have a technical guidelines document that should be loaded at the start of EVERY session?

A) Yes, it's at: [provide path]
B) Create one for me at {knowledge_base}/TECHNICAL_GUIDELINES.md
C) Skip for now (I'll add one later)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**If user selects B**, follow up with compliance requirements question (see RULE_AUTHORING.md § Technical Guidelines Management for details).

---

## Template for New Projects

```markdown
# Technical Guidelines

> This file is loaded at the start of EVERY AI-DLC session.

## Framework & Versions
- **Framework**: [TODO]
- **Language**: [TODO]
- **Runtime**: [TODO]

## Component Standards
- **UI Library**: [TODO]
- **State Management**: [TODO]

## Coding Standards
- [TODO]

## Compliance Requirements

| Framework | Required | Rationale |
|-----------|----------|-----------|
| Security Baseline | Yes | Production application |
| HIPAA | No | [Update if handling PHI] |
| PCI-DSS | No | [Update if handling cardholder data] |
| SOC 2 | No | [Update if enterprise SaaS] |
| UI Baseline | Yes | [Update if no UI] |

## UI/UX Standards

### Design System
- **Design System**: [TODO]
- **Component Library**: [TODO]
- **Icon Library**: [TODO]

### Styling
- **CSS Approach**: [TODO]
- **Theme**: [TODO]

### Accessibility
- **A11y Standard**: WCAG 2.2 AA
- **Screen Reader Testing**: Recommended

### Performance
- **Core Web Vitals Targets**: Yes
- **Bundle Size Budget**: [TODO]

## Constraints
- [TODO]

---
*Last updated: {timestamp}*
```

---

## Error Handling

| Scenario | Action |
|----------|--------|
| Guidelines file not found | Warn user, offer to create template, continue without guidelines |
| Malformed guidelines | Parse what's possible, warn about unparseable sections |
| Conflicting guidelines | Flag conflict, ask user to resolve |
| User requests constraint violation | Explain constraint, require explicit override confirmation |

---

## Audit Logging Requirement

ALL guideline updates MUST be logged in `aidlc-docs/audit.md`:

```markdown
## Technical Guidelines Update
**Timestamp**: {ISO 8601 timestamp}
**Trigger**: {Inline update / Explicit update / Creation}
**Changes**: {list of changes}
**User Approval**: Yes
**Context**: {session context}

---
```

---

## Integration Points

| Phase | Enforcement Action |
|-------|-------------------|
| **Workspace Detection** | Load guidelines BEFORE domain anchor docs |
| **Requirements Analysis** | Use as constraints, skip questions about pre-configured decisions |
| **Construction** | Generate code following standards, use specified libraries/versions |
| **Testing & Validation** | Enforce testing standards, verify coverage requirements |
| **Documentation** | Include guideline compliance in feature doc, note approved deviations |
