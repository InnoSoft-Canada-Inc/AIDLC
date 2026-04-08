# Functional Design

## Purpose
**Detailed business logic design per unit**

Functional Design focuses on:
- Detailed business logic and algorithms for the unit
- Domain models with entities and relationships
- Detailed business rules, validation logic, and constraints
- Technology-agnostic design (no infrastructure concerns)

**Note**: This builds upon high-level component design from Application Design (INCEPTION phase)

## Prerequisites
- Units Generation must be complete
- Unit of work artifacts must be available
- Application Design recommended (provides high-level component structure)
- Execution plan must indicate Functional Design stage should execute

## Overview
Design detailed business logic for the unit, technology-agnostic and focused purely on business functions.

## Steps to Execute

### Step 1: Analyze Unit Context
- Read unit definition from `aidlc-docs/_shared/application-design/unit-of-work.md`
- Read assigned stories from `aidlc-docs/_shared/application-design/unit-of-work-story-map.md`
- Understand unit responsibilities and boundaries

### Step 2: Create Functional Design Plan
- Generate plan with checkboxes [] for functional design
- Focus on business logic, domain models, business rules
- Each step should have a checkbox []

### Step 3: Generate Context-Appropriate Questions
**DIRECTIVE**: Thoroughly analyze the unit definition and functional design artifacts to identify ALL areas where clarification would improve the functional design. Be proactive in asking questions to ensure comprehensive understanding.

**CRITICAL**: Default to asking questions when there is ANY ambiguity or missing detail that could affect functional design quality. It's better to ask too many questions than to make incorrect assumptions.

- EMBED questions using [Answer]: tag format
- Focus on ANY ambiguities, missing information, or areas needing clarification
- Generate questions wherever user input would improve functional design decisions
- **When in doubt, ask the question** - overconfidence leads to poor designs

**Question categories to consider** (evaluate ALL categories):
- **Business Logic Modeling** - Ask about core entities, workflows, data transformations, and business processes
- **Domain Model** - Ask about domain concepts, entity relationships, data structures, and business objects
- **Business Rules** - Ask about decision rules, validation logic, constraints, and business policies
- **Data Flow** - Ask about data inputs, outputs, transformations, and persistence requirements
- **Integration Points** - Ask about external system interactions, APIs, and data exchange
- **Error Handling** - Ask about error scenarios, validation failures, and exception handling
- **Business Scenarios** - Ask about edge cases, alternative flows, and complex business situations
- **Frontend Components** (if applicable) - Ask about UI component structure, user interactions, state management, and form handling

### Step 4: UI State Inventory (Conditional - Opt-In Only)

**Execute IF** (ALL conditions must be true):
- UI Baseline extension is enabled in `aidlc-state.md`
- DESIGN_GUIDELINES.md exists and is populated (not empty template)
- Feature has user-facing components (frontend, UI, web pages, mobile screens)
- **User opted in to UI state enumeration** (see opt-in question below)

**Skip IF** (ANY condition is true):
- UI Baseline extension is disabled
- DESIGN_GUIDELINES.md does not exist or is empty template
- Backend-only feature (APIs, services, databases)
- User chose to skip UI state enumeration (let AI decide)

**Opt-In Question** (asked at start of Functional Design if first 3 conditions met):

```markdown
# UI State Inventory - Opt-In Question

I noticed this feature has user-facing components and DESIGN_GUIDELINES.md exists.

I can enumerate all UI states (loading, empty, error, permission, interactive, form) and ask for your approval on any unspecified states before Code Generation. This gives you granular control over the design implementation.

Alternatively, I can proceed directly to Code Generation using DESIGN_GUIDELINES.md defaults and my best judgment for unspecified states.

**Question**: Do you want to review and approve UI states before Code Generation?

> **Recommended: Option B** — Most users prefer to let AI use DESIGN_GUIDELINES.md defaults unless they have specific design requirements for this feature

A) Yes, enumerate all UI states and ask for my approval on unspecified ones
B) No, use DESIGN_GUIDELINES.md defaults and your best judgment [Recommended]
C) Skip UI design entirely for this feature (backend-only or will handle manually)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**If user chooses A** → Execute UI State Inventory (steps 1-7 below)
**If user chooses B** → Skip to next step, use DESIGN_GUIDELINES.md defaults
**If user chooses C** → Skip all UI validation for this feature

**UI State Inventory Process** (only if user chose A):

1. **Enumerate all UI states** for this feature:
   - **Data loading states**: Initial load, loading, success, error
   - **Empty states**: No data, search no results, empty list, new user
   - **Permission states**: Unauthorized, forbidden, locked, private
   - **Interactive states**: Enabled, disabled, hover, focus, active, pressed
   - **Error states**: Validation errors, network errors, server errors
   - **Form states**: Pristine, dirty, submitting, submitted, failed

2. **For each state, determine design status**:
   - ✅ **Designed**: Has explicit design specification (Figma link, screenshot, design doc)
   - ⚠️ **Generic rule**: Uses pattern from DESIGN_GUIDELINES.md (reference which rule)
   - ❌ **Unspecified**: No design spec and no applicable generic rule

3. **Create UI State Inventory document**:
   - **Location**: `aidlc-docs/{domain}/{unit}/construction/functional-design/ui-state-inventory.md`
   - **Content**: Table of all states with design status
   - **Summary**: Count of designed/generic/unspecified states

4. **If unspecified states exist, create approval questions**:
   - **Follow question format guide** (see `common/question-format-guide.md`)
   - **File**: `aidlc-docs/{domain}/{unit}/construction/ui-state-approval-questions.md`
   - **For each unspecified state**:
     - Show ASCII mockup of proposed pattern
     - List design tokens that will be used (from DESIGN_GUIDELINES.md)
     - Provide explicit recommendation based on generic rules
     - Offer multiple choice options (approve, modify, pause for designer)
     - Include "Other" option (mandatory per question format guide)

5. **Inform user and wait for completion**:
   ```
   I've completed the UI State Inventory for {feature name}.

   I've created ui-state-approval-questions.md with {X} questions about unspecified UI states.

   Most states ({Y}/{total}) have design specs or use generic rules from DESIGN_GUIDELINES.md.
   But {X} states need your approval before I proceed to Code Generation.

   Please answer each question by filling in the letter choice after the [Answer]: tag.
   Let me know when you're done.
   ```

6. **Read and validate responses**:
   - Extract all [Answer]: values
   - Check for missing or invalid answers
   - Check for contradictions (e.g., "approve all" but also "pause for designer")
   - If contradictions found, create clarification question file

7. **Proceed or clarify**:
   - **If all answers clear**: Update UI State Inventory with approved patterns
   - **If contradictions exist**: Create clarification file, wait for resolution
   - **If user chose "pause"**: Mark Functional Design as paused, wait for design specs

**Output artifacts** (if UI State Inventory executed):
- `aidlc-docs/{domain}/{unit}/construction/functional-design/ui-state-inventory.md`
- `aidlc-docs/{domain}/{unit}/construction/ui-state-approval-questions.md` (if unspecified states exist)
- `aidlc-docs/{domain}/{unit}/construction/ui-state-clarification-questions.md` (if contradictions detected)

**Log in audit.md**:
- "UI State Inventory: {total} states enumerated ({designed} designed, {generic} generic rules, {unspecified} unspecified)"
- "UI State Approval Questions: {count} questions created for unspecified states" (if applicable)
- "User responses: {summary of approved patterns}" (after user answers)

---

**Integration with Code Generation**:

When Code Generation begins, load approved UI state patterns from UI State Inventory:
- For ✅ Designed states: Reference design spec in code comments
- For ⚠️ Generic rule states: Use patterns from DESIGN_GUIDELINES.md
- For ❌ Unspecified states: Use user-approved patterns from approval questions

**Enforcement**: UI Baseline extension rule UIUX-13 (Design Completeness Gate) blocks Code Generation if unspecified states lack approved proposals.

### Step 5: Store Plan
- Save as `aidlc-docs/{domain}/{unit}/construction/plans/{unit-name}-functional-design-plan.md`
- Include all [Answer]: tags for user input

### Step 6: Collect and Analyze Answers
- Wait for user to complete all [Answer]: tags
- **MANDATORY**: Carefully review ALL responses for vague or ambiguous answers
- **CRITICAL**: Add follow-up questions for ANY unclear responses - do not proceed with ambiguity
- Look for responses like "depends", "maybe", "not sure", "mix of", "somewhere between"
- Create clarification questions file if ANY ambiguities are detected
- **Do not proceed until ALL ambiguities are resolved**

### Step 7: Generate Functional Design Artifacts
- Create `aidlc-docs/{domain}/{unit}/construction/functional-design/business-logic-model.md`
- Create `aidlc-docs/{domain}/{unit}/construction/functional-design/business-rules.md`
- Create `aidlc-docs/{domain}/{unit}/construction/functional-design/domain-entities.md`
- If unit includes frontend/UI: Create `aidlc-docs/{domain}/{unit}/construction/functional-design/frontend-components.md`
  - Component hierarchy and structure
  - Props and state definitions for each component
  - User interaction flows
  - Form validation rules
  - API integration points (which backend endpoints each component uses)

### Step 8: Present Completion Message
- Present completion message in this structure:
     1. **Completion Announcement** (mandatory): Always start with this:

```markdown
# 🔧 Functional Design Complete - [unit-name]
```

     2. **AI Summary** (optional): Provide structured bullet-point summary of functional design
        - Format: "Functional design has created [description]:"
        - List key business logic models and entities (bullet points)
        - List business rules and validation logic defined
        - Mention domain model structure and relationships
        - DO NOT include workflow instructions ("please review", "let me know", "proceed to next phase", "before we proceed")
        - Keep factual and content-focused
     3. **Formatted Workflow Message** (mandatory): Always end with this exact format:

```markdown
> **📋 <u>**REVIEW REQUIRED:**</u>**  
> Please examine the functional design artifacts at: `aidlc-docs/{domain}/{unit}/construction/functional-design/`



> **🚀 <u>**WHAT'S NEXT?**</u>**
>
> **You may:**
>
> 🔧 **Request Changes** - Ask for modifications to the functional design based on your review  
> ✅ **Continue to Next Stage** - Approve functional design and proceed to **[next-stage-name]**

---
```

### Step 9: Wait for Explicit Approval
- Do not proceed until the user explicitly approves the functional design
- Approval must be clear and unambiguous
- If user requests changes, update the design and repeat the approval process
- **Note**: If UI State Inventory created approval questions, wait for user to answer all questions before presenting completion message

### Step 10: Record Approval and Update Progress
- Log approval in audit.md with timestamp
- Record the user's approval response with timestamp
- Mark Functional Design stage complete in aidlc-state.md
