---
name: customize
description: Interactive AIDLC framework customization. Use when asking to "add a rule", "add a phase", "add a stage", "create an extension", "modify a rule", "customize the workflow", "adjust AIDLC", or "validate framework consistency".
---

# AIDLC Framework Customizer

Guides users through safe, consistent modifications to the Orbit AI-DLC framework. Handles all cascading updates so no references break.

## What This Does

Provides an interactive menu for customizing the AIDLC framework:
- Adding custom extensions (conditional, always-on, stage, hook)
- Modifying existing rules
- Adding stages to existing phases
- Adding entirely new phases
- Adjusting CLAUDE.md workflow behavior
- Validating framework consistency after changes

## Instructions

When invoked:

### Step 1: Present Customization Menu

Display:

```
## AIDLC Framework Customizer

What would you like to do?

**A) Add a custom extension** — Create a new extension in `extensions/custom/` (opt-in rules, validation, hooks)
**B) Modify an existing rule** — Adjust behavior in any `.aidlc-rule-details/` rule file
**C) Add a stage to an existing phase** — Insert a new stage into Inception, Construction, Testing, or Documentation
**D) Add a new phase** — Add an entirely new phase to the workflow (rare)
**E) Adjust CLAUDE.md** — Modify track definitions, approval behavior, loading paths, or other top-level workflow config
**F) Validate consistency** — Check all references, file paths, and loading instructions for broken links

[Answer]:
```

Wait for user's selection before proceeding.

---

### Option A: Add a Custom Extension

**Step A1: Gather extension info**

Ask:

```
## New Extension

**1. Extension name** (e.g., "sox-compliance", "team-slack-notify"):
**2. What does it do?** (one sentence):
**3. Extension type:**
   A) Conditional — enabled per-project via opt-in prompt during Requirements Analysis
   B) Always-On — enforced in every session, no opt-in
   C) Stage — adds a new stage to an existing phase
   D) Hook — executes at a workflow event (phase transition, stage completion, approval gate)

[Answer]:
```

**Step A2: Gather type-specific details**

Based on the extension type chosen:

- **Conditional**: Ask for the opt-in question, when to enable, when to skip
- **Always-On**: Ask for the rules to enforce
- **Stage**: Ask which phase and after which existing stage it should run. Then ask for the stage process steps.
- **Hook**: Ask for the integration point (which event triggers it) and what action to take

For all types, ask:
- What rules should be enforced? (with IDs, conditions, verification, blocking vs advisory)
- Does it produce any output artifacts? If so, what filenames and where?

**Step A3: Read reference material**

Read these files for patterns and templates:
- `.aidlc-rule-details/CUSTOMIZATION_DETAILED.md` — for extension file structure, integration points, and patterns
- `.aidlc-rule-details/examples/custom-extensions/` — for working examples to follow
- `.aidlc-rule-details/extensions/custom/README.md` — for current enabled extensions

**Step A4: Create the extension files**

1. Create the extension file at `.aidlc-rule-details/extensions/custom/{extension-name}.md` using the template from CUSTOMIZATION_DETAILED.md
2. If the extension is a Stage type, also create a stage definition file at `.aidlc-rule-details/extensions/custom/{stage-name}.md`
3. If the extension produces templated output, create templates at `.aidlc-rule-details/extensions/custom/templates/{template-name}.md`

**Step A5: Enable the extension**

Edit `.aidlc-rule-details/extensions/custom/README.md`:
- Add `- [x] {extension-name}.md - {one-line description}` under `## Active Custom Extensions`

**Step A6: Update CLAUDE.md if needed**

Only if the extension is a Stage type or requires special loading:
- Add the extension's stage to the appropriate phase section in CLAUDE.md as a CONDITIONAL stage
- Add any new loading instructions if the extension needs to be loaded outside the standard custom extension mechanism

**Step A7: Run consistency validation**

Execute Option F (Validate Consistency) automatically to verify nothing is broken.

**Step A8: Present summary**

Show:
- Files created (with paths)
- Files modified (with what changed)
- How the extension will activate (opt-in prompt, always-on, event trigger)
- How to test it (suggest running a test unit)
- How to disable it (uncheck in README.md)

---

### Option B: Modify an Existing Rule

**Step B1: Identify the rule**

Ask:

```
Which rule do you want to modify?

You can specify:
- A file path (e.g., `construction/code-generation.md`)
- A stage name (e.g., "Code Generation", "Requirements Analysis")
- A description of the behavior (e.g., "how approval messages work")

[Answer]:
```

**Step B2: Locate the rule file**

Search for the rule in:
1. `.aidlc-rule-details/` — rule detail files (primary location)
2. `CLAUDE.md` — top-level workflow behavior
3. `.aidlc-rule-details/extensions/` — extension rules

Read the identified file(s). Present the current behavior to the user.

**Step B3: Gather the change**

Ask what specifically should change. Get explicit details — don't accept vague requests like "make it better."

**Step B4: Make the change**

Edit the rule file. Preserve the existing structure and formatting.

**Step B5: Check for cascading impacts**

After modifying a rule file, check if any of these need updating:
- `CLAUDE.md` — if the rule file's stage name, condition, or approval behavior changed
- `common/process-overview.md` — if a stage was renamed or its conditions changed
- `common/tracks.md` — if track behavior was affected
- Other rule files that reference the modified file (grep for the filename)
- `.aidlc-rule-details-teams/` — if the modified rule has a team-mode addendum

Make all necessary cascading updates.

**Step B6: Run consistency validation**

Execute Option F (Validate Consistency) automatically.

---

### Option C: Add a Stage to an Existing Phase

**Step C1: Gather stage info**

Ask:

```
## New Stage

**1. Stage name** (e.g., "Security Review", "Performance Audit"):
**2. Which phase?**
   A) Inception
   B) Construction (per-unit loop)
   C) Testing & Validation
   D) Documentation & Consolidation
**3. After which existing stage should it run?**
**4. Is it ALWAYS or CONDITIONAL?** If conditional, what are the execute/skip conditions?
**5. What does the stage do?** (brief description of process and outputs)

[Answer]:
```

**Step C2: Read the target phase**

Read the relevant rule files for the phase to understand the existing stage sequence and patterns:
- The phase section in `CLAUDE.md`
- The adjacent stage rule files in `.aidlc-rule-details/{phase}/`

**Step C3: Create the stage rule file**

Create `.aidlc-rule-details/{phase}/{stage-name}.md` following the pattern of existing stage files in that phase. Include:
- Purpose and prerequisites
- Detailed process steps
- Approval/completion message format (standardized 2-option for Construction, or approval gate for Testing/Documentation)
- Common pitfalls

**Step C4: Update CLAUDE.md**

Insert the new stage into the correct position in CLAUDE.md:
1. Add it to the phase's stage list at the top of the phase section
2. Add the full stage section (execute/skip conditions, execution steps) in sequence after the specified predecessor stage
3. Follow the same format as existing stages in that phase:
   - For Construction per-unit stages: include Execute IF/Skip IF conditions, 6-step execution with audit logging, 2-option approval
   - For Testing stages: include Execute IF/Skip IF if conditional, numbered steps with audit logging, approval gate
   - For Documentation stages: same pattern as Testing

**Step C5: Update supporting files**

- Edit `common/process-overview.md` — add the stage to the phase's stage list
- Edit `common/tracks.md` — specify whether the stage runs on Full, Lightweight, and/or Hotfix tracks
- If the stage interacts with extensions, update relevant extension files

**Step C6: Run consistency validation**

Execute Option F (Validate Consistency) automatically.

---

### Option D: Add a New Phase

**Step D1: Confirm intent**

Warn the user:

```
Adding a new phase is a significant structural change. It affects:
- CLAUDE.md (phase structure, flow, alignment checks)
- common/process-overview.md (phase list)
- common/tracks.md (track definitions)
- common/task-alignment.md (alignment check transitions)
- common/exit-conditions.md (exit conditions)
- Session summary templates
- Backlog phase progress checklists

Are you sure you want to add a new phase, or would adding a stage to an existing phase (Option C) achieve your goal?

A) Yes, add a new phase
B) Actually, let me add a stage instead (→ Option C)

[Answer]:
```

**Step D2: Gather phase info**

If confirmed, ask:

```
## New Phase

**1. Phase name** (e.g., "Security Audit", "Deployment"):
**2. Phase emoji** (for section headers, e.g., "🔴"):
**3. Where in the flow?** (after which existing phase):
**4. Purpose** (one sentence — what is the phase's focus?):
**5. Stages** (list the stages this phase will contain):
**6. Tracks** — which tracks include this phase?
   A) Full Track only
   B) Full + Lightweight
   C) All three tracks

[Answer]:
```

**Step D3: Create phase infrastructure**

1. Create a directory `.aidlc-rule-details/{phase-name}/` for the phase's stage rule files
2. Create each stage's rule file in that directory
3. Consider creating a phase-level overview file if the phase is complex

**Step D4: Update CLAUDE.md**

1. Add the phase section in the correct position (between the specified predecessor and the next phase)
2. Include: purpose, focus, stage list, each stage's full definition
3. Update the phase structure diagram at the top (`Inception → Construction → ...`)
4. Update the phase list in the "Project Configuration" section

**Step D5: Update all supporting files**

These files MUST be updated when adding a phase:

| File | What to update |
|------|----------------|
| `CLAUDE.md` | Phase section, phase structure diagram, Project Configuration |
| `common/process-overview.md` | Phase list, flow description |
| `common/tracks.md` | Which tracks include this phase |
| `common/task-alignment.md` | Add alignment check for the new phase transition |
| `common/exit-conditions.md` | Add exit conditions if the phase has them |
| `common/session-summary.md` | Update phase progress template if needed |
| `common/backlog.md` | Update domain backlog phase progress checklist |

**Step D6: Run consistency validation**

Execute Option F (Validate Consistency) automatically.

---

### Option E: Adjust CLAUDE.md

**Step E1: Identify what to change**

Ask:

```
What part of CLAUDE.md do you want to adjust?

A) Track definitions (Full/Lightweight/Hotfix criteria or flow)
B) Phase structure or flow order
C) Approval gate behavior
D) Extension loading logic
E) Rule details loading paths
F) Directory structure or file conventions
G) Audit/logging behavior
H) Something else (describe)

[Answer]:
```

**Step E2: Read current state**

Read the relevant section of CLAUDE.md and any referenced rule files.

Present the current behavior to the user.

**Step E3: Make the change**

Edit CLAUDE.md. After editing, check for cascading impacts:
- If track definitions changed → update `common/tracks.md`
- If phase structure changed → update `common/process-overview.md`
- If approval behavior changed → check if `.aidlc-rule-details-teams/` needs a matching update
- If loading paths changed → verify files exist at new paths
- If directory structure changed → update `common/backlog.md` path references

**Step E4: Run consistency validation**

Execute Option F (Validate Consistency) automatically.

---

### Option F: Validate Consistency

Run a comprehensive check of the framework's internal references.

**Step F1: File existence checks**

Read `CLAUDE.md` and extract every file reference (rule details paths, extension paths, common/ files). Verify each referenced file exists:

```
Checking file references...
```

For each reference pattern in CLAUDE.md:
- `common/{filename}.md` → check `.aidlc-rule-details/common/{filename}.md` exists
- `inception/{filename}.md` → check `.aidlc-rule-details/inception/{filename}.md` exists
- `construction/{filename}.md` → check `.aidlc-rule-details/construction/{filename}.md` exists
- `testing/{filename}.md` → check `.aidlc-rule-details/testing/{filename}.md` exists
- `documentation/{filename}.md` → check `.aidlc-rule-details/documentation/{filename}.md` exists
- `extensions/{path}` → check `.aidlc-rule-details/extensions/{path}` exists

**Step F2: Stage-to-rule-file mapping**

For every stage defined in CLAUDE.md that has a "Load all steps from `{path}`" instruction, verify the rule file exists and contains process steps.

**Step F3: Cross-reference checks**

- Verify `common/process-overview.md` lists the same phases and stages as CLAUDE.md
- Verify `common/tracks.md` references the same track names and flows as CLAUDE.md
- Check that every extension listed as "always load" in CLAUDE.md exists
- Check that every opt-in prompt file listed in CLAUDE.md exists

**Step F4: Teams overlay check**

If `.aidlc-rule-details-teams/` exists:
- Verify every addendum file in `.aidlc-rule-details-teams/` corresponds to a base file in `.aidlc-rule-details/`
- Verify `CLAUDE-TEAMS.md` references to `.aidlc-rule-details-teams/` files are valid

**Step F5: Custom extension check**

If `.aidlc-rule-details/extensions/custom/README.md` has enabled extensions (`[x]`):
- Verify each enabled extension file exists
- Verify each extension file has required sections (Extension Type, Integration Point, Rules, Enforcement)
- If Stage type: verify the referenced stage definition file exists

**Step F6: Present results**

```
## Consistency Check Results

### File References
- [PASS/FAIL] {count} references checked, {issues} issues found
  {list any missing files}

### Stage-Rule Mapping
- [PASS/FAIL] {count} stages checked, {issues} issues found
  {list any stages with missing rule files}

### Cross-References
- [PASS/FAIL] Phase/stage alignment between CLAUDE.md and process-overview.md
- [PASS/FAIL] Track alignment between CLAUDE.md and tracks.md
- [PASS/FAIL] Extension file existence

### Teams Overlay
- [PASS/FAIL/SKIP] Teams consistency check
  {details if issues found}

### Custom Extensions
- [PASS/FAIL/SKIP] Custom extension validation
  {details if issues found}

**Overall: {PASS | {N} issues found}**
```

If issues found, offer to fix them:

```
Would you like me to fix the {N} issues found?
A) Yes, fix all
B) Let me review them first
C) No, I'll fix them manually

[Answer]:
```

---

## Important Notes

- **Never modify core extensions** (security/, documentation/, ui/, testing/unit-test-standards) — these come from the release and would be overwritten on update. Guide users to create custom extensions or use the `extensions/custom/` directory instead.
- **Always run validation** (Option F) after any structural change — it catches broken references before they cause runtime issues.
- **Preserve formatting** — CLAUDE.md and rule files follow specific patterns. Match the existing style when inserting new content.
- **Warn about teams overlay** — If the user modifies approval behavior or adds stages, check if `.aidlc-rule-details-teams/` needs a corresponding update for Agent Teams mode.
- **Reference docs**: Point users to `CUSTOMIZATION_DETAILED.md` and `RULE_AUTHORING.md` for deeper understanding of the framework's design principles.
