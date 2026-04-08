# Playwright E2E Test Extension (Example)

## Overview

This is an **example custom extension** showing how to add Playwright-specific E2E testing patterns on top of the core E2E Test Standards extension.

**Purpose**: Provide Playwright-specific implementation rules and code templates for teams using Playwright as their E2E test framework.

## Prerequisites

- E2E Test Standards extension must be enabled (core extension)
- Project uses Playwright for E2E testing
- Playwright configuration exists (`playwright.config.ts` or `playwright.config.js`)

## What This Extension Provides

1. **Playwright-Specific Rules** (`playwright-e2e.md`):
   - Enforce Page Object Model pattern
   - Require test fixtures for authentication
   - Mandate data-testid selectors
   - Configure CI retry strategy

2. **Code Templates** (`templates/`):
   - Standard Playwright test structure
   - Page Object Model template
   - Fixture configuration

3. **Example Output** (`sample-output/`):
   - Complete E2E test implementation example

## Installation

### Option 1: Copy to Custom Extensions

1. Copy this directory to `.aidlc-rule-details/extensions/custom/playwright-e2e/`
2. Enable in `.aidlc-rule-details/extensions/custom/README.md`:
   ```markdown
   ## Active Custom Extensions

   - [x] playwright-e2e.md - Playwright E2E test patterns
   ```

### Option 2: Use as Reference

Browse this example to understand how to create your own custom E2E extension for different frameworks (Cypress, Selenium, etc.).

## How It Works

**Integration Flow**:

1. **Inception Phase** → User enables E2E Test Standards (core)
2. **Requirements Analysis** → Ask if project uses Playwright
3. **Testing & Validation Phase** → E2E Workflow Validation generates scenarios
4. **After E2E Workflow Validation** → This extension executes:
   - Loads E2E test scenarios
   - Generates Playwright test code from templates
   - Enforces Playwright-specific rules

## Files in This Example

```
playwright-e2e/
├── README.md                          # This file
├── playwright-e2e.md                  # Extension definition with rules
├── templates/
│   ├── playwright-test-template.ts   # Standard test structure
│   └── page-object-template.ts       # Page Object Model template
└── sample-output/
    └── checkout.spec.ts               # Example generated test
```

## Customization

To adapt this for your team:

1. **Modify Rules**: Edit `playwright-e2e.md` to match your team's conventions
2. **Update Templates**: Customize templates in `templates/` for your patterns
3. **Add Templates**: Create additional templates (auth fixtures, test data helpers, etc.)
4. **Configure Integration Point**: Choose when extension executes (after E2E Workflow Validation or during Build and Test)

## Extending for Other Frameworks

### Cypress Extension

Copy this structure and modify for Cypress:
- `cypress-e2e.md` with Cypress-specific rules
- Templates for Cypress commands, page objects
- Sample output with Cypress test syntax

### Selenium Extension

Copy this structure and modify for Selenium:
- `selenium-e2e.md` with WebDriver rules
- Templates for Selenium page objects
- Sample output with Selenium syntax

## Support

This is an **example extension** for reference. Customize it for your project's needs.

For questions about the core E2E Test Standards extension, see:
- `.aidlc-rule-details/extensions/testing/e2e-test-standards.md`
- `.aidlc-rule-details/testing/e2e-workflow-validation.md`
