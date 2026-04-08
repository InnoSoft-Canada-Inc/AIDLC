# UI/UX Baseline Rules

## Overview

These UI/UX rules are cross-cutting constraints that apply during Construction (Code Generation) and Testing phases. They ensure accessibility compliance, performance optimization, and secure UI rendering.

**Enforcement**: At Code Generation completion, the model MUST verify compliance with these rules before presenting the completion message.

### Blocking vs Advisory Rules

| Rule Type | Behavior | Rules |
|-----------|----------|-------|
| **Blocking** | Non-compliance prevents "Continue to Next Stage" | UIUX-01 to UIUX-05, UIUX-09, UIUX-11, UIUX-13 |
| **Advisory** | Flagged but does not block progression | UIUX-06 to UIUX-08, UIUX-10, UIUX-12 |

### Blocking Finding Behavior

A **blocking UI/UX finding** means:
1. The finding MUST be listed in the completion message under "UI/UX Compliance" section
2. The stage MUST NOT present "Continue to Next Stage" until resolved
3. Only "Request Changes" option is available
4. The finding MUST be logged in `aidlc-docs/audit.md`

If a UIUX rule is not applicable (e.g., no UI code generated), mark it as **N/A** — this is not a blocking finding.

### Verification Criteria Format

Verification items are plain bullet points describing compliance checks. Each item should be evaluated as compliant, non-compliant, or N/A during review.

---

## Opt-In Configuration

**Opt-in prompt**: See `ui-baseline.opt-in.md` (loaded separately for context efficiency)

**Project-level override**: Configure in `TECHNICAL_GUIDELINES.md` under `## UI/UX Standards` to skip opt-in prompt.

**Recommendation**: UI Baseline should be enabled for all applications with user interfaces. Only disable for backend-only services, CLI tools, or library packages.

---

## Rule UIUX-01: Semantic HTML Structure (BLOCKING)

**Rule**: All UI components MUST use semantic HTML elements appropriately:
- Use `<button>` for actions, not `<div onclick>` or `<span onclick>`
- Use `<a>` for navigation links
- Use heading hierarchy (`<h1>` → `<h2>` → `<h3>`) without skipping levels
- Use landmark elements (`<main>`, `<nav>`, `<aside>`, `<header>`, `<footer>`)
- Use `<ul>`/`<ol>` for lists, `<table>` for tabular data

**Verification**:
- No `<div>` or `<span>` elements with click handlers where `<button>` is appropriate
- Heading levels do not skip (no `<h1>` directly to `<h3>`)
- Page has exactly one `<main>` landmark (or none if component library)
- Navigation menus use `<nav>` element
- Lists use `<ul>` or `<ol>`, not styled divs

---

## Rule UIUX-02: ARIA Labels on Interactive Elements (BLOCKING)

**Rule**: All interactive elements without visible text MUST have accessible names:
- Icon-only buttons: `aria-label` describing the action (not the icon)
- Form inputs: Associated `<label>` element or `aria-label` attribute
- Images conveying information: Descriptive `alt` text
- Decorative images: `alt=""` (empty string)
- Custom controls: Appropriate ARIA role and label

**Verification**:
- Every `<button>` without text content has `aria-label`
- Every `<input>`, `<select>`, `<textarea>` has associated `<label>` or `aria-label`
- Every `<img>` has `alt` attribute (empty string for decorative)
- Icon buttons describe the action (e.g., "Close dialog" not "X icon")
- Custom components have appropriate `role` and `aria-*` attributes

---

## Rule UIUX-03: Color Contrast Compliance (BLOCKING)

**Rule**: All text and UI components MUST meet WCAG 2.2 AA contrast ratios:
- Normal text (< 18px or < 14px bold): 4.5:1 minimum contrast ratio
- Large text (>= 18px or >= 14px bold): 3:1 minimum contrast ratio
- UI components and graphical objects: 3:1 minimum contrast ratio
- Focus indicators: 3:1 minimum against adjacent colors

**Verification**:
- Text colors against backgrounds meet minimum contrast requirements
- Focus indicators (outlines, rings) are clearly visible
- Error states, warnings, and success indicators use compliant colors
- No critical information conveyed by color alone (use icons, text, patterns)

**Note**: When using design tokens from TECHNICAL_GUIDELINES.md or anchor-map.md, assume tokens are pre-validated. Flag if custom colors are introduced outside the token set.

---

## Rule UIUX-04: Keyboard Navigation (BLOCKING)

**Rule**: All interactive elements MUST be fully keyboard accessible:
- Focusable with Tab key (forward) and Shift+Tab (backward)
- Activatable with Enter and/or Space as appropriate
- Dismissable with Escape key (modals, dropdowns, popovers)
- Arrow key navigation for composite widgets (tabs, menus, listboxes)

**Verification**:
- No interactive elements require mouse-only interaction
- Focus order follows logical/visual order (no `tabindex` values > 0)
- Modal dialogs trap focus within the dialog
- Focus is restored to trigger element when modal closes
- Custom widgets implement WAI-ARIA keyboard patterns

---

## Rule UIUX-05: Form Accessibility (BLOCKING)

**Rule**: All forms MUST be accessible to assistive technologies:
- Error messages programmatically associated with inputs (`aria-describedby`)
- Required fields indicated with `required` attribute or `aria-required="true"`
- Error states announced to screen readers (live regions or focus management)
- Form submission feedback is accessible (success/failure)
- Field groups use `<fieldset>` and `<legend>` where appropriate

**Verification**:
- Validation error messages linked to inputs via `aria-describedby`
- Required fields use native `required` attribute when possible
- Form errors trigger screen reader announcement (via live region or focus)
- Success/failure feedback is not visual-only
- Related fields (e.g., address, payment) grouped with fieldset/legend

---

## Rule UIUX-06: Core Web Vitals Targets (ADVISORY)

**Rule**: UI code SHOULD support Core Web Vitals performance targets:
- LCP (Largest Contentful Paint): < 2.5 seconds
- CLS (Cumulative Layout Shift): < 0.1
- INP (Interaction to Next Paint): < 200 milliseconds

**Verification** (advisory — flag but don't block):
- Images use lazy loading (`loading="lazy"`) for below-fold content
- Web fonts specify `font-display: swap` or `optional`
- Layout shifts minimized (explicit dimensions on images, embeds, ads)
- No render-blocking resources in critical path where avoidable
- Heavy computations moved off main thread where possible

**Note**: This is advisory because performance is often measured post-deployment, not during code generation.

---

## Rule UIUX-07: Image Optimization (ADVISORY)

**Rule**: Images SHOULD be optimized for performance and accessibility:
- Use next-generation formats (WebP, AVIF) when browser support allows
- Implement responsive images (`srcset`, `sizes`) for different viewports
- Lazy load below-fold images
- Specify explicit `width` and `height` to prevent layout shift
- Preload LCP candidate images

**Verification** (advisory):
- Images use framework optimization components (e.g., `next/image`, `nuxt-img`)
- Images have explicit `width` and `height` attributes or aspect-ratio CSS
- Below-fold images use `loading="lazy"`
- Hero/LCP images use `priority` or `fetchpriority="high"` preloading
- Decorative background images use CSS, not `<img>`

---

## Rule UIUX-08: Loading and Error States (ADVISORY)

**Rule**: UI components SHOULD gracefully handle asynchronous states:
- Loading indicators for operations > 300ms
- Error boundaries to catch component failures
- Empty states for zero-data scenarios
- Skeleton loaders to maintain layout during loading

**Verification** (advisory):
- Async data fetching shows loading indicator or skeleton
- Failed requests show user-friendly error message (not broken UI)
- Lists/tables show meaningful empty state when no data
- Loading states maintain approximate layout dimensions (prevent CLS)
- Error boundaries wrap critical component subtrees

---

## Rule UIUX-09: XSS Prevention in Dynamic Content (BLOCKING)

**Rule**: User-generated and dynamic content MUST be rendered safely:
- Use framework's default escaping (React JSX auto-escapes)
- No `dangerouslySetInnerHTML` (React), `v-html` (Vue), or `[innerHTML]` (Angular) without sanitization
- No `eval()`, `new Function()`, or `setTimeout(string)` with user input
- URL inputs validated before use in `href`, `src`, or `action` attributes
- Markdown/rich text rendered with safe parser

**Verification**:
- No raw HTML injection of user-provided content
- Any use of `dangerouslySetInnerHTML` (or equivalent) includes DOMPurify or similar sanitization
- No `javascript:` URLs can be constructed from user input
- Markdown rendering uses safe parser (e.g., marked with sanitize, remark with rehype-sanitize)
- SVG content sanitized if user-uploadable

---

## Rule UIUX-10: Component Test Coverage (ADVISORY)

**Rule**: Interactive UI components SHOULD have meaningful test coverage:
- User interactions tested (click, type, submit)
- Accessibility assertions included (role, name, state)
- Error and loading states verified
- Keyboard navigation tested for complex widgets

**Verification** (advisory):
- Interactive components (forms, modals, dropdowns) have test files
- Tests use accessible queries (`getByRole`, `getByLabelText`) over `getByTestId`
- Tests verify keyboard interaction for custom widgets
- Tests cover loading, error, and empty states
- Tests do not rely solely on implementation details

---

## Rule UIUX-11: Design Token Compliance (BLOCKING)

**Rule**: UI code MUST use design tokens from DESIGN_GUIDELINES.md when configured:
- Colors must match specified palette (primary, secondary, success, error, warning, text, background)
- Typography must use specified font family, size scale, line height, and font weights
- Spacing must follow specified base unit and scale
- Border radius must use specified scale
- Component library must match specified library (if configured)

**Verification** (blocking):
- No hardcoded colors outside the design guidelines palette
- Font family matches DESIGN_GUIDELINES.md specification
- Font sizes use values from specified scale (or calculated multiples)
- Spacing values use specified scale (e.g., 4/8/12/16/24/32/48/64px)
- Border radius values use specified scale
- Component library imports match specified library (e.g., shadcn/ui, Material-UI)

**Contextual enforcement**:
- If DESIGN_GUIDELINES.md exists and specifies tokens → enforce (blocking)
- If DESIGN_GUIDELINES.md omits a section → no enforcement for that category
- If custom values needed → require justification in code comments

**Graceful degradation**:
- If DESIGN_GUIDELINES.md does not exist → mark as N/A (not a blocking finding)
- If design guidelines exist but a specific token category is `[TODO]` → mark as N/A for that category

**Example violations**:
```jsx
// ❌ VIOLATION: Hardcoded color not in design guidelines
<button className="bg-[#1a73e8]">Submit</button>

// ✅ COMPLIANT: Using design token
<button className="bg-primary">Submit</button>

// ❌ VIOLATION: Font size not in scale
<h1 className="text-[19px]">Title</h1>

// ✅ COMPLIANT: Using specified scale (18px in scale)
<h1 className="text-lg">Title</h1>

// ❌ VIOLATION: Custom spacing not in scale
<div className="p-[13px]">Content</div>

// ✅ COMPLIANT: Using specified scale (12px in scale)
<div className="p-3">Content</div>
```

**Note**: This rule complements existing UIUX-03 (Color Contrast) by ensuring design system adherence beyond accessibility compliance.

---

## Rule UIUX-12: Interaction Pattern Compliance (ADVISORY)

**Rule**: UI code SHOULD follow interaction patterns from DESIGN_GUIDELINES.md when configured:
- Animation durations should match specified values (micro/standard/emphasis)
- Easing functions should match specified curves
- Component states should implement specified behaviors (hover, focus, active, disabled)
- Screen states should use specified patterns (loading, error, empty, success)
- Transitions should use specified types (fade, slide, scale)

**Verification** (advisory — flag but don't block):
- Animation durations approximately match specifications (±50ms tolerance)
- Easing functions match or are equivalent to specifications
- Hover/focus/active/disabled states exist for interactive components
- Loading indicators use specified pattern (spinner, skeleton, progress bar)
- Error states use specified pattern (inline, toast, modal, banner)
- Empty states use specified pattern (message, message + icon, message + icon + CTA)
- Transition types match specifications where applicable

**Contextual enforcement**:
- If DESIGN_GUIDELINES.md exists and specifies patterns → advise compliance
- If DESIGN_GUIDELINES.md omits a pattern → no advisory for that category
- If deviations are intentional → note in code comments or design decision log

**Graceful degradation**:
- If DESIGN_GUIDELINES.md does not exist → mark as N/A (not an advisory finding)
- If design guidelines exist but interaction patterns are `[TODO]` → mark as N/A

**Example advisories**:
```jsx
// ⚠️ ADVISORY: Animation duration doesn't match spec (300ms standard)
<motion.div transition={{ duration: 0.5 }}>  // Using 500ms instead of 300ms

// ✅ RECOMMENDED: Using specified standard duration
<motion.div transition={{ duration: 0.3 }}>

// ⚠️ ADVISORY: Easing function differs from spec (cubic-bezier specified)
<motion.div transition={{ ease: "easeInOut" }}>

// ✅ RECOMMENDED: Using specified easing
<motion.div transition={{ ease: [0.4, 0, 0.2, 1] }}>

// ⚠️ ADVISORY: Loading pattern differs from spec (skeleton specified)
{isLoading && <Spinner />}  // Using spinner instead of skeleton

// ✅ RECOMMENDED: Using specified pattern
{isLoading && <Skeleton />}
```

**Note**: This rule is advisory (not blocking) because interaction patterns often require context-specific adjustments. Deviations are acceptable with justification.

---

## Rule UIUX-13: Design Completeness Gate (BLOCKING)

**Rule**: All UI states for the feature MUST have design specifications or approved defaults before Code Generation.

**When**: Before Code Generation, during Functional Design stage

**What**: Enumerate all possible UI states and ensure each has design coverage:
- **Designed**: Has explicit design specification (Figma, screenshot, design doc)
- **Generic rule**: Uses pattern from DESIGN_GUIDELINES.md
- **Unspecified**: Requires user approval before Code Generation

**UI State Categories**:
- **Data loading states**: Initial load, loading, success, error
- **Empty states**: No data, search no results, empty list, new user
- **Permission states**: Unauthorized, forbidden, locked, private
- **Interactive states**: Enabled, disabled, hover, focus, active, pressed
- **Error states**: Validation errors, network errors, server errors
- **Form states**: Pristine, dirty, submitting, submitted, failed

**Process**:
1. Generate UI State Inventory document with all states classified
2. For unspecified states:
   - Create approval question file per `common/question-format-guide.md`
   - Present ASCII mockups with design token references
   - Provide recommendations based on DESIGN_GUIDELINES.md
   - Wait for explicit user approval before Code Generation

**Example UI State Inventory**:
```markdown
# UI State Inventory: User Profile Feature

## Summary
- Total UI states: 17
- Explicitly designed: 10 (59%)
- Using generic design rules: 5 (29%)
- Unspecified (need approval): 2 (12%)

## State Classification

| State | Type | Design Status | Pattern/Reference |
|-------|------|---------------|-------------------|
| Profile loading | Loading | ✅ Designed | Figma: [Profile Loading State](link) |
| Profile data loading | Loading | ⚠️ Generic rule | DESIGN_GUIDELINES.md "Loading States" → Skeleton loader |
| No profile data yet | Empty | ❌ Unspecified | See approval questions |
| Profile load error | Error | ✅ Designed | Figma: [Error State - Network](link) |
| Account suspended | Error | ❌ Unspecified | See approval questions |
| Profile private | Permission | ⚠️ Generic rule | DESIGN_GUIDELINES.md "Permission Errors" → Lock icon |
| Edit mode enabled | Interactive | ✅ Designed | Figma: [Profile Edit Mode](link) |
| Field validation (valid) | Form | ⚠️ Generic rule | DESIGN_GUIDELINES.md "Form States" → Green checkmark |
| Field validation (invalid) | Form | ⚠️ Generic rule | DESIGN_GUIDELINES.md "Form States" → Red error icon |
```

**Approval Question Example** (follows `common/question-format-guide.md`):
```markdown
## Question 1: No Profile Data Yet (New User Empty State)

**State**: User navigates to profile page but hasn't created profile yet

**Current Status**: ❌ No design specification in Figma or DESIGN_GUIDELINES.md

**AI Proposed Pattern**:
┌─────────────────────────────────────────┐
│                                         │
│           [User Plus Icon]              │
│                                         │
│         No Profile Yet                  │
│                                         │
│    Create your profile to get started   │
│                                         │
│      [Create Your Profile Button]       │
│                                         │
└─────────────────────────────────────────┘

**Design tokens I'll use**:
- Icon: `icon-user-plus` (Lucide, 48px, muted color)
- Heading: `text-xl font-semibold`
- Message: `text-muted-foreground`
- CTA: `Button variant="default"`

> **Recommended: Option A** — Follows DESIGN_GUIDELINES.md empty state pattern (message + icon + CTA with encouraging tone)

A) Approve this pattern as-is [Recommended]
B) Change CTA text to "Get Started" instead of "Create Your Profile"
C) Change CTA text to "Complete Profile" instead of "Create Your Profile"
D) Use a different icon (specify which icon from Lucide in [Answer])
E) Pause — I'll get design specs from designer before continuing
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Verification** (blocking):
- UI State Inventory document created for feature
- All UI states classified (designed / generic rule / unspecified)
- Unspecified states have approval questions created
- User answered all approval questions
- No contradictions or ambiguities in user responses

**Enforcement** (opt-in):

**CRITICAL**: This rule only enforces if user opted in to UI State Inventory during Functional Design.

**Blocking IF**:
- **User opted in to UI State Inventory** (answered "A" to Functional Design opt-in question) AND:
  - Unspecified states exist without approval questions created
  - Approval questions created but user hasn't answered
  - User chose "pause" option (waiting for designer input)

**Skip enforcement IF**:
- User skipped UI State Inventory (answered "B" or "C" to Functional Design opt-in question)
- UI Baseline extension is disabled
- DESIGN_GUIDELINES.md does not exist or is empty template
- Feature is backend-only (no UI components)

**When skipped**:
- Mark UIUX-13 as N/A in compliance summary
- AI proceeds to Code Generation using DESIGN_GUIDELINES.md defaults
- No blocking gate

**Rationale**:
- **Opt-in approach**: Only enforce granular UI state approval if user explicitly requested it
- **Flexibility**: Users who trust DESIGN_GUIDELINES.md can proceed without interruption
- **Prevents analysis paralysis**: Not every feature needs granular state enumeration
- **Power user feature**: Available for teams with strict design requirements
- **Design-engineering sync**: Ensures unspecified UI states are approved before implementation

**Integration**: Works with DESIGN_GUIDELINES.md (generic defaults) and Figma/design system links (explicit designs).

---

## Enforcement Integration

These rules are enforced during the Construction phase, specifically at Code Generation completion.

### When to Verify

| Stage | UIUX Verification |
|-------|-------------------|
| **Code Generation Part 2** | Verify all rules before presenting completion |
| **Build and Test** | Reference UIUX rules in test instructions |
| **Integration Tests** | Include a11y cross-domain checks if UI touches multiple domains |

### Compliance Summary Format

Include in Code Generation completion message when UI code is generated:

```markdown
### UI/UX Compliance

| Rule | Status | Notes |
|------|--------|-------|
| UIUX-01 Semantic HTML | Compliant | Proper button, heading, landmark usage |
| UIUX-02 ARIA Labels | Compliant | All icon buttons labeled |
| UIUX-03 Color Contrast | N/A | Using design system tokens |
| UIUX-04 Keyboard Nav | Compliant | Modal trap implemented |
| UIUX-05 Form A11y | Compliant | Error messages linked |
| UIUX-06 Core Web Vitals | Advisory | Consider lazy loading images |
| UIUX-07 Image Optimization | N/A | No images in this component |
| UIUX-08 Loading States | Advisory | Skeleton loader recommended |
| UIUX-09 XSS Prevention | Compliant | No raw HTML rendering |
| UIUX-10 Component Tests | Advisory | Tests recommended |
| UIUX-11 Design Tokens | Compliant | Colors, typography, spacing match design guidelines |
| UIUX-12 Interaction Patterns | Advisory | Animation durations within spec tolerance |
| UIUX-13 Design Completeness | N/A | User skipped UI State Inventory (opted for defaults) |

**Status**: 6 Compliant, 3 N/A, 4 Advisory — Ready to proceed
```

### Status Determination

| Condition | Status |
|-----------|--------|
| All blocking rules compliant or N/A | Ready to proceed |
| Any blocking rule non-compliant | Request Changes only |
| Advisory rules flagged | Ready to proceed (with notes) |

---

## Relationship to Other Extensions

### Design Guidelines

UIUX-11 and UIUX-12 integrate with the Design Guidelines system:
- **Design Guidelines (DESIGN_GUIDELINES.md)**: Project-specific visual/behavioral standards
- **UI Baseline (UIUX-01 to UIUX-10)**: Universal accessibility + security rules
- **UIUX-11**: Enforces design token compliance (blocking if DESIGN_GUIDELINES.md exists)
- **UIUX-12**: Advises interaction pattern compliance (advisory if DESIGN_GUIDELINES.md exists)

Both systems are loaded during Workspace Detection and enforced during Code Generation.

### Security Baseline

UIUX-09 (XSS Prevention) complements SECURITY-05 (Input Validation). Both should be enforced:
- SECURITY-05: Server-side input validation
- UIUX-09: Client-side safe rendering

### Documentation Standards

DOC-02 (Working Code Examples) should include accessible examples that pass UIUX rules.

### Testing Standards

TEST-01 (Descriptive Test Names) applies to component tests covered by UIUX-10.

---

## Appendix: WCAG Reference

For human reviewers, the following maps UIUX rules to WCAG 2.2 Success Criteria:

| UIUX Rule | WCAG Criteria |
|-----------|---------------|
| UIUX-01 | 1.3.1 Info and Relationships, 4.1.2 Name/Role/Value |
| UIUX-02 | 1.1.1 Non-text Content, 4.1.2 Name/Role/Value |
| UIUX-03 | 1.4.3 Contrast (Minimum), 1.4.11 Non-text Contrast |
| UIUX-04 | 2.1.1 Keyboard, 2.1.2 No Keyboard Trap, 2.4.3 Focus Order |
| UIUX-05 | 1.3.1 Info and Relationships, 3.3.1 Error Identification |
| UIUX-09 | N/A (Security, not WCAG) |
