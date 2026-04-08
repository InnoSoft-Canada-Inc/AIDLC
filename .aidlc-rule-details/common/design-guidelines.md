# Design Guidelines System

> **For explanatory content and philosophy**, see [RULE_AUTHORING.md § Design Guidelines Management](/.aidlc-rule-details/RULE_AUTHORING.md#design-guidelines-management)

---

## MANDATORY: Loading Instructions

**When to load**: During Workspace Detection, AFTER Technical Guidelines, BEFORE domain-specific anchor docs
**How to load**: Read path from `aidlc-docs/anchor-map.md` under `## Project-Wide Guidelines` section
**Default path**: `{knowledge_base}/DESIGN_GUIDELINES.md`

**Treatment**:
- Immutable visual and behavioral constraints throughout session
- Do not suggest alternatives unless explicitly asked
- Violations are evaluated contextually (some blocking, some advisory)

---

## File Format Specification

DESIGN_GUIDELINES.md MUST include these sections:

```markdown
# Design Guidelines

## Design System
- **Design System**: {None, Figma URL, Storybook URL, MCP server name}
- **Component Library**: {library name and version}
- **Icon Library**: {icon library name}

## Visual Design Tokens

### Colors
- **Primary**: {hex color}
- **Secondary**: {hex color}
- **Success**: {hex color}
- **Error**: {hex color}
- **Warning**: {hex color}
- **Text**: {hex color for primary text}
- **Background**: {hex color for primary background}

### Typography
- **Font Family**: {font name or stack}
- **Base Size**: {px value, e.g., 16px}
- **Scale**: {list of sizes, e.g., 12/14/16/18/20/24/32/48px}
- **Line Height**: {ratio or values, e.g., 1.5 for body, 1.2 for headings}
- **Font Weight**: {scale, e.g., 400 regular, 500 medium, 600 semibold, 700 bold}

### Spacing
- **Base Unit**: {px value, e.g., 4px or 8px}
- **Scale**: {list of spacing values, e.g., 4/8/12/16/24/32/48/64px}
- **Layout Grid**: {description, e.g., 8px grid, 12-column grid}

### Borders & Radii
- **Border Width**: {default border width, e.g., 1px}
- **Border Radius**: {scale, e.g., 4/8/12/16px or none/sm/md/lg}

## Interaction Patterns

### Animations & Transitions
- **Duration**: {timing values, e.g., 150ms micro, 300ms standard, 500ms emphasis}
- **Easing**: {easing function, e.g., ease-in-out, cubic-bezier(0.4, 0, 0.2, 1)}
- **Transitions**: {allowed transition types, e.g., fade, slide, scale}

### Component States
- **Hover**: {behavior description}
- **Focus**: {ring style, color, offset}
- **Active/Pressed**: {behavior description}
- **Disabled**: {styling approach, e.g., opacity 50%, cursor not-allowed}

### Loading Indicators
- **Pattern**: {type, e.g., spinner, skeleton, progress bar}
- **Threshold**: {when to show, e.g., operations > 300ms}
- **Color**: {spinner/skeleton color}

## Screen States (Default Behaviors)

### Loading States
- **Pattern**: {description of loading UI pattern}
- **Placement**: {where loading indicators appear}

### Error States
- **Pattern**: {inline message, toast, modal, banner}
- **Duration**: {auto-dismiss timing or persistent}
- **Retry**: {include retry button: yes/no}

### Empty States
- **Pattern**: {message only, message + icon, message + icon + CTA}
- **Tone**: {helpful, neutral, encouraging}

### Success States
- **Pattern**: {toast, inline message, banner}
- **Duration**: {auto-dismiss timing}

## Responsive Strategy

### Breakpoints
- **Mobile**: {max width, e.g., < 640px}
- **Tablet**: {range, e.g., 640px - 1024px}
- **Desktop**: {min width, e.g., > 1024px}
- **Additional**: {any custom breakpoints}

### Touch Targets
- **Minimum Size**: {pixel dimensions, e.g., 44x44px per WCAG 2.5.5}
- **Spacing**: {minimum spacing between interactive elements}

### Layout Behavior
- **Mobile**: {description of mobile layout approach}
- **Tablet**: {description of tablet layout approach}
- **Desktop**: {description of desktop layout approach}

## Accessibility

### Color Contrast
- **Compliance Level**: {WCAG level, e.g., AA, AAA}
- **Text Contrast**: {minimum ratio, e.g., 4.5:1 for normal text}
- **UI Component Contrast**: {minimum ratio, e.g., 3:1}

### Focus Indicators
- **Style**: {ring, outline, underline, background}
- **Color**: {focus indicator color}
- **Width**: {focus indicator width, e.g., 2px}

## Constraints
<!-- Hard rules that must NEVER be violated -->
- {constraint 1}
- {constraint 2}
- ...

---
*Last updated: {timestamp}*
```

---

## Creation Triggers

### Trigger 1: Create with Content
**Pattern**: `Using AI-DLC, create design guidelines with [specifications]`

**Workflow**:
1. Parse specifications from user message
2. Check if guidelines file exists (ask Replace/Merge if exists)
3. Generate DESIGN_GUIDELINES.md with user specifications
4. Present for approval
5. Write file, add to anchor-map.md, log in audit.md

### Trigger 2: Explicit Update
**Pattern**: `Using AI-DLC, update design guidelines`

**Workflow**:
1. Load current DESIGN_GUIDELINES.md
2. Ask: "What would you like to update?"
3. Generate proposed changes
4. Present diff for approval
5. Update file, log in audit.md

### Trigger 3: Inline Update
**Patterns**:
- "Update my design guidelines to use {color/spacing/animation/etc}"
- "Add {design token} to my design guidelines"
- "Change {design setting} in my guidelines to {value}"

**Workflow**:
1. Load current DESIGN_GUIDELINES.md
2. Show proposed change (single change only)
3. On approval: update file, log in audit.md
4. Continue with current session

---

## Constraint Application Rules

| Guideline Type | Enforcement Rule | Strictness |
|----------------|------------------|------------|
| **Visual Design Tokens** | Use specified colors, typography, spacing. Flag if custom values introduced. | BLOCKING (UIUX-11) |
| **Component Library** | Use specified library components by default. | BLOCKING (UIUX-11) |
| **Interaction Patterns** | Follow specified animation durations, easing, transitions. Flag deviations. | ADVISORY (UIUX-12) |
| **Component States** | Implement specified hover, focus, active, disabled behaviors. | ADVISORY (UIUX-12) |
| **Screen States** | Use specified loading, error, empty, success patterns. | ADVISORY (UIUX-12) |
| **Responsive Strategy** | Follow specified breakpoints and layout behaviors. | BLOCKING (UIUX-11) |
| **Accessibility** | Meet specified contrast and focus indicator requirements. | BLOCKING (existing UIUX-03, UIUX-04) |
| **Hard Constraints** | Never violate. If user requests violation, explain constraint and require explicit override confirmation. | BLOCKING |

**Contextual Enforcement**:
- If DESIGN_GUIDELINES.md specifies a token/pattern → enforce it (blocking or advisory per table above)
- If DESIGN_GUIDELINES.md omits a section → no enforcement for that area (flexibility for incomplete guidelines)
- If custom values needed → require justification in code comments or design decision log

---

## Initialization Question

During `Using AI-DLC, initialize project`, ask (after Technical Guidelines question):

```markdown
## Question 3: Design Guidelines (Optional)

Does this project have design specifications or a design system?

A) Yes, it's at: [provide path]
B) Yes, Figma file with MCP server configured
C) Create a template for me at {knowledge_base}/DESIGN_GUIDELINES.md
D) Skip for now (I'm not a designer / backend-only project)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**If user selects B (Figma MCP)**, follow up with:

```markdown
You indicated Figma file with MCP server. Please provide:

1. **MCP Server Name**: [e.g., figma-design-system]
2. **Figma File URL** (optional): [URL for reference]

I'll attempt to connect to the MCP server to extract design tokens. If the server is not available or not configured, I'll fall back to creating a template with TODO placeholders.

[Answer]:
```

**If user selects C**, follow up asking if they want to auto-extract from planning docs (see Step 2.6 in initialization.md).

---

## Template for New Projects

```markdown
# Design Guidelines

> This file is loaded at the start of EVERY AI-DLC session.

## Design System
- **Design System**: [TODO: None, Figma URL, Storybook URL]
- **Component Library**: [TODO: e.g., shadcn/ui, Material-UI, Ant Design, custom]
- **Icon Library**: [TODO: e.g., Lucide, Heroicons, Material Icons, Font Awesome]

## Visual Design Tokens

### Colors
- **Primary**: [TODO: e.g., #0978ee]
- **Secondary**: [TODO]
- **Success**: [TODO: e.g., #10b981]
- **Error**: [TODO: e.g., #ef4444]
- **Warning**: [TODO: e.g., #f59e0b]
- **Text**: [TODO: e.g., #1f2937]
- **Background**: [TODO: e.g., #ffffff]

### Typography
- **Font Family**: [TODO: e.g., Inter, Roboto, system-ui]
- **Base Size**: [TODO: e.g., 16px]
- **Scale**: [TODO: e.g., 12/14/16/18/20/24/32/48px]
- **Line Height**: [TODO: e.g., 1.5 for body, 1.2 for headings]
- **Font Weight**: [TODO: e.g., 400/500/600/700]

### Spacing
- **Base Unit**: [TODO: e.g., 4px or 8px]
- **Scale**: [TODO: e.g., 4/8/12/16/24/32/48/64px]
- **Layout Grid**: [TODO: e.g., 8px grid, 12-column grid]

### Borders & Radii
- **Border Width**: [TODO: e.g., 1px]
- **Border Radius**: [TODO: e.g., 4/8/12/16px or none/sm/md/lg]

## Interaction Patterns

### Animations & Transitions
- **Duration**: [TODO: e.g., 150ms micro, 300ms standard, 500ms emphasis]
- **Easing**: [TODO: e.g., ease-in-out, cubic-bezier(0.4, 0, 0.2, 1)]
- **Transitions**: [TODO: e.g., fade, slide, scale]

### Component States
- **Hover**: [TODO: behavior description]
- **Focus**: [TODO: ring style, color, offset]
- **Active/Pressed**: [TODO: behavior description]
- **Disabled**: [TODO: opacity 50%, cursor not-allowed, or other approach]

### Loading Indicators
- **Pattern**: [TODO: spinner, skeleton, progress bar]
- **Threshold**: [TODO: e.g., show spinner for operations > 300ms]
- **Color**: [TODO: spinner/skeleton color]

## Screen States (Default Behaviors)

### Loading States
- **Pattern**: [TODO: description of loading UI pattern]
- **Placement**: [TODO: where loading indicators appear]

### Error States
- **Pattern**: [TODO: inline message, toast, modal, banner]
- **Duration**: [TODO: auto-dismiss timing or persistent]
- **Retry**: [TODO: include retry button: yes/no]

### Empty States
- **Pattern**: [TODO: message only, message + icon, message + icon + CTA]
- **Tone**: [TODO: helpful, neutral, encouraging]

### Success States
- **Pattern**: [TODO: toast, inline message, banner]
- **Duration**: [TODO: auto-dismiss timing or persistent]

## Responsive Strategy

### Breakpoints
- **Mobile**: [TODO: e.g., < 640px]
- **Tablet**: [TODO: e.g., 640px - 1024px]
- **Desktop**: [TODO: e.g., > 1024px]
- **Additional**: [TODO: any custom breakpoints]

### Touch Targets
- **Minimum Size**: [TODO: 44x44px per WCAG 2.5.5]
- **Spacing**: [TODO: minimum spacing between interactive elements]

### Layout Behavior
- **Mobile**: [TODO: description of mobile layout approach]
- **Tablet**: [TODO: description of tablet layout approach]
- **Desktop**: [TODO: description of desktop layout approach]

## Accessibility

### Color Contrast
- **Compliance Level**: WCAG 2.2 AA (minimum)
- **Text Contrast**: 4.5:1 for normal text, 3:1 for large text
- **UI Component Contrast**: 3:1 minimum

### Focus Indicators
- **Style**: [TODO: ring, outline, underline, background]
- **Color**: [TODO: focus indicator color]
- **Width**: [TODO: e.g., 2px]

## Constraints
<!-- Hard rules that must NEVER be violated -->
- [TODO: e.g., "Never use fixed pixel widths for layout"]
- [TODO: e.g., "Always support dark mode"]
- [TODO: e.g., "All interactive elements must have visible focus indicators"]

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
| Figma MCP not available | Warn user, fall back to template creation with TODO placeholders |

---

## Audit Logging Requirement

ALL guideline updates MUST be logged in `aidlc-docs/audit.md`:

```markdown
## Design Guidelines Update
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
| **Workspace Detection** | Load guidelines AFTER Technical Guidelines, BEFORE domain anchor docs |
| **Requirements Analysis** | Use as visual/behavioral constraints, reference in requirements doc |
| **Application Design** | Apply design system constraints to component design decisions |
| **Functional Design** | Reference screen state patterns (loading, error, empty) |
| **Code Generation** | Enforce UIUX-11 (blocking) and UIUX-12 (advisory), verify compliance before completion |
| **Build & Test** | Reference design guidelines in test instructions for visual/interaction testing |
| **Documentation** | Include design guideline compliance in feature doc, note approved deviations |

---

## Auto-Extraction from Planning Docs

**When**: During initialization, if planning docs exist and user approves auto-extraction

**Scan for**:

1. **Design System References**:
   - Figma URLs (figma.com links)
   - Storybook URLs (storybook.js.org or custom deployments)
   - Component library mentions (shadcn/ui, Material-UI, Ant Design, Chakra UI, etc.)
   - Icon library mentions (Lucide, Heroicons, Material Icons, Font Awesome, etc.)

2. **Color Palettes**:
   - Hex color codes (#RRGGBB format)
   - Color variable definitions (CSS custom properties, SCSS variables)
   - Brand color mentions (primary, secondary, accent, etc.)

3. **Typography Scales**:
   - Font family declarations
   - Font size scales (px, rem values)
   - Line height values
   - Font weight scales

4. **Spacing Systems**:
   - Spacing scale declarations (4px, 8px, 16px, etc.)
   - Grid system mentions (8px grid, 12-column grid, etc.)

5. **Interaction Patterns**:
   - Animation duration mentions (ms values)
   - Easing function declarations
   - Transition type mentions (fade, slide, scale)

6. **Responsive Breakpoints**:
   - Breakpoint values (640px, 768px, 1024px, 1280px, etc.)
   - Mobile/tablet/desktop layout mentions

**Extraction Heuristics**:
- Prefer explicit declarations over generic mentions
- Look for "design system", "design tokens", "brand guidelines", "style guide" sections
- Scan CSS files, Tailwind config files referenced in planning docs
- Check for design decision documents

**Figma MCP Integration**:
- If Figma MCP server name provided, attempt to query design tokens
- Extract: color styles, text styles, spacing tokens, component definitions
- If MCP query fails, log warning and fall back to manual template

---

## Relationship to Other Extensions

### UI Baseline Extension

DESIGN_GUIDELINES.md complements UI Baseline (accessibility + security) with project-specific visual/behavioral standards:

- **UI Baseline (UIUX-01 to UIUX-10)**: Universal accessibility and security rules
- **Design Guidelines (UIUX-11, UIUX-12)**: Project-specific design system compliance

Both are enforced during Code Generation.

### Technical Guidelines

DESIGN_GUIDELINES.md parallels TECHNICAL_GUIDELINES.md:

- **Technical Guidelines**: Framework versions, coding standards, tech stack constraints
- **Design Guidelines**: Visual design tokens, interaction patterns, responsive strategy

Both are loaded during Workspace Detection and treated as immutable constraints.

---

## Appendix: Design Token Reference

For human reviewers, common design token categories:

| Token Category | Examples |
|----------------|----------|
| **Colors** | Primary, Secondary, Success, Error, Warning, Text, Background |
| **Typography** | Font Family, Font Size Scale, Line Height, Font Weight |
| **Spacing** | Base Unit, Spacing Scale, Layout Grid |
| **Borders** | Border Width, Border Radius Scale |
| **Shadows** | Shadow Scale (sm, md, lg, xl) |
| **Animations** | Duration (micro, standard, emphasis), Easing |
| **Breakpoints** | Mobile, Tablet, Desktop, Custom |
