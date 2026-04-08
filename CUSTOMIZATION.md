# AIDLC Customization Guide

**Version**: 1.0.0
**Last Updated**: 2026-03-04

---

## Philosophy

AIDLC is designed to be **generic and universally applicable** — it works for open-source projects, solo developers, backend APIs, frontend applications, and everything in between.

However, some teams need **business-specific features** that don't fit the core framework:
- Industry-specific compliance checks
- Internal tool integrations (Jira, Confluence, Slack)
- Company-specific approval workflows
- Department-level documentation for stakeholders
- Custom reporting formats

**The customization layer enables you to extend AIDLC without forking or modifying core files.**

---

## When to Customize

### ✅ Good Reasons to Customize

- **Industry-specific**: Feature applies only to your industry (healthcare, finance, etc.)
- **Not universal**: Feature isn't needed by open source, CLI, or backend-only projects
- **Internal integration**: Connecting to your company's tools (Jira, Slack, etc.)
- **Business process**: Approval gates, sign-offs, or workflows unique to your company
- **Stakeholder communication**: Documentation for non-technical teams

### ❌ Don't Customize If...

- **Universal benefit**: Most AIDLC users would benefit → [propose as core feature](https://github.com/csiorbit/orbit-aidlc/issues)
- **Already exists**: Can be achieved with existing extensions (Security, UI, Documentation)
- **One-time need**: Just do it manually rather than building infrastructure
- **Configuration**: Use `TECHNICAL_GUIDELINES.md` or `DESIGN_GUIDELINES.md` instead

---

## Customization Directory

Your customizations live in:

```
.aidlc-rule-details/extensions/custom/
```

### Why This Location?

1. **Separation**: Core framework (from release) stays untouched
2. **Update-safe**: Easy to copy `custom/` when updating to new AIDLC release
3. **Clear boundary**: Obvious distinction between generic and business-specific
4. **Gitignored**: Custom extensions don't pollute the repository (by default)

### Directory Structure

```
.aidlc-rule-details/
├── extensions/
│   ├── documentation/          # Core extensions (don't modify)
│   ├── security/              # Core extensions (don't modify)
│   ├── ui/                    # Core extensions (don't modify)
│   └── custom/                # YOUR customizations
│       ├── README.md          # Extension index (enable/disable here)
│       ├── .gitkeep           # Ensures directory exists
│       └── your-extension.md  # Your custom extensions
```

---

## How Custom Extensions Work

### Loading Mechanism

1. During workflow initialization, AIDLC checks if `extensions/custom/README.md` exists
2. If it exists, AIDLC reads the file for enabled extensions (marked with `[x]`)
3. For each enabled extension:
   - Load the extension file from `extensions/custom/{extension-name}.md`
   - Execute at integration points specified in the extension
   - Log custom extension usage in `audit.md`

### Integration Points

Custom extensions can execute at:

| Integration Point | When It Runs | Use Cases |
|-------------------|--------------|-----------|
| **Requirements Analysis** | During Inception phase | Ask opt-in questions, gather business context |
| **After Core Stages** | After any built-in stage | Add custom validation, generate additional artifacts |
| **Before Stage Completion** | Before presenting stage results | Add compliance checks, custom approval gates |
| **Phase Transitions** | Between phases | Add approval workflows, notifications |

---

## Creating a Custom Extension

### Option 1: Copy an Example (Recommended)

The fastest way to create a custom extension is to copy a working example:

1. Browse examples in `.aidlc-rule-details/examples/custom-extensions/`
2. Choose an example that's closest to your need
3. Copy files to your `custom/` directory
4. Customize for your business
5. Enable in `custom/README.md`

**Available Examples**:
- [Department-Level Documentation](.aidlc-rule-details/examples/custom-extensions/dept-docs/) - Generate sales, marketing, support docs

### Option 2: Build from Scratch

If no example matches your need, create from scratch. See `.aidlc-rule-details/CUSTOMIZATION_DETAILED.md` for detailed guide with templates and step-by-step instructions.

---

## Quick Start

### 1. Create Custom Extensions Directory

```bash
mkdir -p .aidlc-rule-details/extensions/custom
cd .aidlc-rule-details/extensions/custom
```

### 2. Create README.md

```markdown
# Custom Extensions

This directory contains YOUR business-specific customizations to AIDLC.

## Active Custom Extensions

List your enabled extensions here:

- [ ] None yet

## How to Add a Custom Extension

1. Copy an example from `.aidlc-rule-details/examples/custom-extensions/`
2. Or create from scratch following `CUSTOMIZATION.md`
3. Add the extension file to this directory
4. List it above with [x] to enable
5. Test with a real unit of work

## Available Examples

See `.aidlc-rule-details/examples/custom-extensions/` for:
- Department-level documentation (sales, marketing, support)
- [Future examples will be added here]
```

### 3. Copy an Example

```bash
# Example: Copy department docs extension
cp ../../.aidlc-rule-details/examples/custom-extensions/dept-docs/dept-docs.md .
```

### 4. Enable Extension

Edit `custom/README.md`:

```markdown
## Active Custom Extensions

- [x] dept-docs.md - Department-level documentation (sales, marketing, support)
```

### 5. Test

Run `Using AI-DLC...` trigger and complete a feature to see your extension in action.

---

## Extension Types

### 1. Conditional Extensions
Enabled/disabled per project via opt-in prompt during Requirements Analysis.

### 2. Always-On Extensions
Loaded and enforced in every session for company-wide policies.

### 3. Stage Extensions
Add new stages to existing phases for additional workflow steps.

### 4. Hook Extensions
Run at specific workflow events for notifications, logging, integrations.

---

## Best Practices

1. **Keep Extensions Simple**: One purpose per extension, minimal dependencies
2. **Document Thoroughly**: Include installation and customization guides
3. **Test Before Deploying**: Dogfood it on real features first
4. **Version Your Extensions**: Track changes if sharing across projects
5. **Handle Updates Gracefully**: Copy custom/ when updating AIDLC

---

## Updating AIDLC with Custom Extensions

When updating to a new AIDLC release:

```bash
# 1. Backup your customizations
cp -R .aidlc-rule-details/extensions/custom /tmp/my-custom-extensions

# 2. Extract new AIDLC release
unzip orbit-aidlc-vX.Y.Z.zip
cd orbit-aidlc-vX.Y.Z

# 3. Copy customizations back
cp -R /tmp/my-custom-extensions/* .aidlc-rule-details/extensions/custom/

# 4. Test that customizations still work
```

---

## Getting Help

1. **Check examples**: `.aidlc-rule-details/examples/custom-extensions/`
2. **Detailed guide**: `.aidlc-rule-details/CUSTOMIZATION_DETAILED.md`
3. **Community**: [GitHub Discussions](https://github.com/csiorbit/orbit-aidlc/discussions)
4. **Issues**: [Report bugs](https://github.com/csiorbit/orbit-aidlc/issues)

---

## Summary

**Customization enables**:
- ✅ Business-specific features without forking
- ✅ Integration with your internal tools
- ✅ Custom workflows and approval gates
- ✅ Stakeholder-specific documentation

**Customization keeps**:
- ✅ Core framework generic and universal
- ✅ Updates simple (copy custom/ to new release)
- ✅ Clear separation (core vs custom)
- ✅ Community shareable (examples in docs/)

**Start with an example, customize for your needs, share with the community.**
