# Department Documentation Stage

## Stage Overview

**Phase**: Documentation & Consolidation
**When**: After Feature Documentation is complete
**Duration**: 5-10 minutes
**Output**: Three department-specific documents

## Prerequisites

- Feature Documentation must be complete and approved
- Feature doc must include all 12 required sections
- dept-docs extension must be enabled in aidlc-state.md

## Process

### Step 1: Load Feature Documentation
1. Read the completed feature doc from `{domain}/{unit}/documentation/feature-doc.md`
2. Extract key information:
   - What was built (summary)
   - Customer value and business impact
   - User-facing changes
   - API contracts (if customer-facing)
   - Known limitations
   - Testing guidance

### Step 2: Generate Sales Documentation
**File**: `{domain}/{unit}/documentation/dept-sales.md`

**Content** (use sales-template.md as guide):
1. **Feature Summary** (1-2 sentences for elevator pitch)
2. **Customer Value Proposition** (why customers care)
3. **Competitive Positioning** (how this differentiates us)
4. **Demo Points** (what to show in demos)
5. **Common Objections** (anticipated customer concerns + responses)
6. **Pricing Impact** (if applicable)

### Step 3: Generate Marketing Documentation
**File**: `{domain}/{unit}/documentation/dept-marketing.md`

**Content** (use marketing-template.md as guide):
1. **Feature Headline** (announcement-ready)
2. **Messaging Framework** (key messages for different audiences)
3. **Use Cases** (customer scenarios where this helps)
4. **Benefits** (outcome-focused, not feature-focused)
5. **Target Audience** (who should care most)
6. **Release Notes Draft** (customer-facing changelog entry)

### Step 4: Generate Support Documentation
**File**: `{domain}/{unit}/documentation/dept-support.md`

**Content** (use support-template.md as guide):
1. **Customer-Facing Description** (how to explain this to customers)
2. **How to Use** (simple step-by-step for customers)
3. **Common Questions** (anticipated customer questions + answers)
4. **Known Issues** (what might go wrong)
5. **Troubleshooting** (how to diagnose and resolve)
6. **Escalation Criteria** (when to involve engineering)

### Step 5: Verification
Verify compliance with dept-docs extension rules:
- [ ] All three department docs exist
- [ ] Content derived from feature doc (no contradictions)
- [ ] All required sections present per templates
- [ ] No technical jargon without explanation
- [ ] Customer-focused language (not developer-focused)

### Step 6: Present for Approval
**Completion Message**:
```
Department-level documentation complete for {UNIT-ID}.

Generated:
- Sales brief: aidlc-docs/{domain}/{unit}/documentation/dept-sales.md
- Marketing brief: aidlc-docs/{domain}/{unit}/documentation/dept-marketing.md
- Support guide: aidlc-docs/{domain}/{unit}/documentation/dept-support.md

Extension Rule Compliance:
- DEPT-DOC-01 (Department Documentation Required): ✅ Compliant
- DEPT-DOC-02 (Content Derivation): ✅ Compliant
- DEPT-DOC-03 (Template Compliance): ✅ Compliant

Note: These docs are starting points. Review for tone, branding, and accuracy before sharing with stakeholders.

Ready to proceed to Impact Scan?
```

## Common Pitfalls

1. **Too technical**: Department docs should be accessible to non-technical readers
2. **Feature-focused instead of outcome-focused**: Focus on "what customers can do" not "what we built"
3. **Missing context**: Explain acronyms and technical terms
4. **Copy-paste from feature doc**: Transform technical content into business language

## Success Criteria

- Sales team can pitch the feature after reading sales brief
- Marketing can draft announcement without additional context
- Support can answer customer questions using support guide
- All docs align with feature doc (single source of truth)
