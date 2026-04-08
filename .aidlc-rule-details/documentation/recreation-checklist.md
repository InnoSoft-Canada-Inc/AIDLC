# Recreation Readiness Checklist

## Purpose

Verify that documentation + tests are sufficient to recreate equivalent functionality months from now. This is the final quality gate ensuring the unit is "recreation-ready."

**Goal**: A developer with no prior context should be able to recreate equivalent functionality using only:
- Documentation from this unit
- Test suite (as behavioral specification)
- General knowledge of the tech stack

---

## Stage: Recreation Readiness Check (ALWAYS EXECUTE)

**Position in Workflow**: Final stage of Documentation & Consolidation phase, after Backlog Update

**Execution Time**: ~5-10 minutes (checklist review)

---

## Checklist

Work through each section, marking items complete or noting gaps.

### Requirements & Design

- [ ] **Requirements documented** — All functional requirements have clear descriptions
- [ ] **Acceptance criteria defined** — Each user story has testable acceptance criteria
- [ ] **Architectural decisions captured** — Key decisions documented with rationale (in feature doc section 2 or 10)
- [ ] **Interface contracts defined** — Public APIs documented with signatures, parameters, returns, and errors (feature doc section 11)

### Data Model

- [ ] **Entities fully specified** — All tables/collections documented with complete field definitions (feature doc section 4)
- [ ] **Relationships documented** — Foreign keys, cardinality, and constraints specified
- [ ] **Sample data provided** — Representative records showing expected data patterns
- [ ] **Indexes documented** — Performance-critical indexes listed with rationale

### Implementation Guidance

- [ ] **Decision log exists** — Key trade-offs and rejected alternatives documented (feature doc section 10)
- [ ] **Configuration documented** — Environment variables, settings, and defaults listed (feature doc section 5)
- [ ] **Dependencies documented** — All packages listed with versions and purposes (feature doc section 6)
- [ ] **Known limitations documented** — Scope boundaries and deferred decisions noted (feature doc section 7)
- [ ] **Recreation notes exist** — Bootstrap sequence and common pitfalls documented (feature doc section 12)

### Test Coverage

- [ ] **Requirement-test mapping exists** — `aidlc-docs/{domain}/{unit}/testing/requirement-test-map.md` present
- [ ] **All acceptance criteria have tests** — 100% coverage of acceptance criteria
- [ ] **All business rules have tests** — Each documented rule has corresponding test(s)
- [ ] **Edge cases documented and tested** — Common edge cases have dedicated tests
- [ ] **Test names are descriptive** — Tests serve as readable specifications

### Bootstrap Capability

- [ ] **Setup instructions present** — How to install dependencies, configure environment
- [ ] **Manual test instructions work** — Steps in feature doc section 8 can be followed from scratch
- [ ] **Prerequisites documented** — External dependencies (databases, services) listed

---

## Recreation Confidence Score

Rate each area 1-5, where:
- **5** = Complete, could recreate without questions
- **4** = Good, minor gaps but sufficient
- **3** = Adequate, some guesswork needed
- **2** = Incomplete, significant gaps
- **1** = Missing, cannot recreate this aspect

| Area | Score | Gaps (if < 4) |
|------|-------|---------------|
| Requirements clarity | /5 | |
| Data model completeness | /5 | |
| Interface specification | /5 | |
| Test coverage as specification | /5 | |
| Decision rationale | /5 | |
| Bootstrap instructions | /5 | |

**Average Score**: ___/5

---

## Completion Gate

**Minimum Requirement**: Average score of 4 or higher

### If Score ≥ 4

Unit is recreation-ready. Proceed to finalize session summary and complete the unit.

### If Score < 4

Address gaps before completing the unit:

1. **Identify gaps** from the checklist
2. **Prioritize** by impact on recreation ability
3. **Update documentation** to fill critical gaps
4. **Re-score** after updates

**Note**: Perfect scores (all 5s) are not required. The goal is "good enough to recreate equivalent functionality," not "perfect documentation."

---

## Completion Message

Present to user:

```markdown
## Recreation Readiness Check Complete

**Checklist Results**:
- Requirements & Design: X/4 items complete
- Data Model: X/4 items complete
- Implementation Guidance: X/5 items complete
- Test Coverage: X/5 items complete
- Bootstrap Capability: X/3 items complete

**Recreation Confidence Score**: X.X/5

**Gaps Identified**: [None / List critical gaps]

---

**Assessment**: [Recreation-ready / Needs improvement]

**Options**:
1. **Address Gaps** — Update documentation to improve score
2. **Complete Unit** — Proceed with current documentation (if score ≥ 4)
```

---

## Integration with Workflow

### Input From
- Feature Documentation (all 12 required sections)
- Requirement-Test Mapping
- All prior Construction and Testing artifacts

### Output To
- Session Summary (final verification before archive)
- Marks unit as complete in backlog

---

## Why This Matters

Without this checklist, units may be marked "complete" but lack sufficient documentation for recreation. This creates technical debt that compounds over time:

- **Without**: Developer tries to recreate feature, spends days reverse-engineering from code
- **With**: Developer reads docs + tests, implements equivalent functionality in hours

The checklist ensures every completed unit meets the same recreation-readiness bar.
