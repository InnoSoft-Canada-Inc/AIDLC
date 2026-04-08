# Department-Level Documentation Example

This example demonstrates how to create custom documentation for non-technical stakeholders.

## What It Does

After completing Feature Documentation, generates three additional docs:
- **Sales Brief**: Customer value, competitive positioning, demo points
- **Marketing Brief**: Messaging, use cases, announcement copy
- **Support Guide**: Customer-facing description, known issues, FAQs

## Installation

1. Copy files to your custom extensions directory:
   ```bash
   cp dept-docs.md ../../.aidlc-rule-details/extensions/custom/
   cp dept-documentation.md ../../.aidlc-rule-details/documentation/
   cp -r templates ../../.aidlc-rule-details/
   ```

2. Enable in custom/README.md:
   ```markdown
   - [x] dept-docs.md - Department-level documentation (sales, marketing, support)
   ```

3. Next "Using AI-DLC..." trigger will ask if you want to enable it

## Customization

Edit templates to match your business:
- `templates/sales-template.md` - Adjust sections for your sales process
- `templates/marketing-template.md` - Match your messaging framework
- `templates/support-template.md` - Align with your support documentation

## Testing

Run on a completed feature to see output quality before deploying widely.
