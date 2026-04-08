# Project Initialization

**Purpose**: Define the one-time initialization process that configures the AI-DLC framework for a specific project. Initialization runs before any unit of work can begin and is distinct from the three workflow tracks.

---

## Overview

The initialization track is:
- **A one-time setup run** — not a recurring workflow
- **Distinct from workflow tracks** — not Full, Lightweight, or Hotfix
- **Not a unit of work** — does not appear in the backlog
- **A prerequisite** — must complete before any "Using AI-DLC, ..." unit prompt can run

---

## Activation Trigger

**Exact trigger phrase**: `Using AI-DLC, initialize project`

No other phrase activates the initialization track. Variations like "initialize AI-DLC" or "set up AI-DLC" should prompt a clarification:

```markdown
To initialize AI-DLC for this project, please use the exact phrase:

**Using AI-DLC, initialize project**

Would you like to proceed with initialization?
```

---

## Initialization Questions

During initialization, the workflow asks two questions:

### Question 1: Knowledge Base Location

```markdown
**Where are your planning and architecture documents located?**

A) Local path: [provide path, e.g., `docs/planning`, `dev/planning/docs`]
B) MCP server: [provide server name, e.g., `confluence-mcp`, `notion-mcp`, `context7`]
C) None (I don't have any yet)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling for Question 1:**

| Answer | Behavior |
|--------|----------|
| **A) Local path** | Validate path exists, set Type=local, proceed with document discovery |
| **B) MCP server** | Set Type=mcp, ask follow-up Question 1B for server configuration |
| **C) None** | Set Type=local with empty Location, skip document discovery |
| **Invalid path** | Report error, ask for correction |

### Question 1B: MCP Server Configuration (if B selected)

```markdown
You selected MCP server for your knowledge base.

1. **MCP Server Name**: [e.g., confluence-mcp, notion-mcp, context7]
2. **Query Prefix** (optional): [context for queries, e.g., "MyProject architecture docs"]
3. **Test Query** (optional): [topic to test, e.g., "authentication design"]

I'll attempt to connect to the MCP server and verify it's available.
If the connection fails, I'll provide troubleshooting steps.

[Answer]:
```

**Answer Handling for Question 1B:**

| Field | Behavior |
|-------|----------|
| **MCP Server Name** | Required. Validate server is available, store in anchor-map.md |
| **Query Prefix** | Optional. If provided, prepend to all MCP queries for this project |
| **Test Query** | Optional. If provided, execute test query to verify connectivity |

**If MCP connection fails**:

```markdown
⚠️ **MCP Connection Failed**

Could not connect to MCP server "{server_name}".

**Possible causes**:
- MCP server is not running or not configured in your IDE/editor
- Server name is incorrect (check spelling)
- Network or authentication issue

**Troubleshooting**:
1. Verify the MCP server is configured in your IDE settings
2. Check that the server name matches exactly
3. Ensure the MCP server is running

**Options**:
A) Retry connection with a different server name
B) Switch to local path instead
C) Continue without knowledge base (can configure later)

[Answer]:
```

### Question 2: Technical Guidelines (Optional)

**Note**: If planning docs are provided in Question 1, this question is replaced by auto-extraction in Step 2.5.

**ONLY ask this question if user answered `none` to Question 1** (no planning docs):

```markdown
**Do you have a technical guidelines document?**

This file will be loaded at the start of EVERY session to enforce project-wide standards
(framework versions, component preferences, coding conventions).

A) Yes, it's at: [provide path, e.g., docs/TECHNICAL_GUIDELINES.md]
B) Create a template for me at aidlc-docs/TECHNICAL_GUIDELINES.md
C) Skip for now (I'll add one later)

[Answer]:
```

**Answer Handling for Question 2:**

| Answer | Behavior |
|--------|----------|
| **A) Path provided** | Validate file exists, add to anchor-map.md |
| **B) Create template** | Generate TODO template at aidlc-docs/TECHNICAL_GUIDELINES.md, add to anchor-map.md |
| **C) Skip** | No guidelines section in anchor-map.md (can be added later) |

**Template for Option B:**

```markdown
# Technical Guidelines

> This file is loaded at the start of EVERY AI-DLC session.
> Edit this file to enforce project-wide standards.

## Framework & Versions
- **Framework**: [TODO: e.g., Next.js 16.1.4]
- **Language**: [TODO: e.g., TypeScript 5.x]
- **Runtime**: [TODO: e.g., Node.js 20.x]

## Component Standards
- **UI Library**: [TODO: e.g., shadcn/ui]
- **State Management**: [TODO: e.g., Zustand]

## Coding Standards
- [TODO: Add your coding standards]

## Constraints
- [TODO: Add hard constraints that must never be violated]

---
*Last updated: {timestamp}*
```

See `common/technical-guidelines.md` for complete documentation on the technical guidelines system.

---

## Initialization Process

After Question 1 is answered and confirmed, the workflow executes these steps:

**Flow**:
- **IF Type=local (Option A)**: Question 1 → Step 1 (Validate Path) → Step 2 (Discover Documents)
- **IF Type=mcp (Option B)**: Question 1 → Question 1B (MCP Config) → Step 1.5 (Verify MCP Connection) → Step 2 (Query MCP for Docs)
- **IF planning docs found** → Step 2.5 (Auto-Extract Technical Stack) → Step 3 (Auto-Detect Domains) → Step 4 (Present Configuration)
- **IF no planning docs** → Question 2 (Technical Guidelines) → Step 3 (Minimal Domain Structure) → Step 4 (Present Configuration)

### Step 1: Validate Path (Type=local only)

**ONLY execute if Type=local (Option A selected)**

If a local path was provided:

1. Verify the path exists relative to project root
2. If path does not exist:
   ```markdown
   **Path not found**: `{provided-path}`

   Please verify the path and try again, or enter `none` to skip document discovery.

   [Answer]:
   ```

### Step 1.5: Verify MCP Connection (Type=mcp only)

**ONLY execute if Type=mcp (Option B selected)**

After Question 1B is answered:

1. **Attempt MCP connection** using the provided server name
2. **Execute test query** if provided, otherwise use default: "List available documentation"
3. **Record connection status**

**If connection successful**:
```markdown
✅ **MCP Connection Successful**

Connected to MCP server: {server_name}
Query prefix: {query_prefix or "none"}

Proceeding to query available documentation...
```

**If connection fails**: Present troubleshooting options (see Question 1B error handling above)

**Store in anchor-map.md**:
```markdown
## Knowledge Base

- **Type**: mcp
- **MCP Server**: {server_name}
- **MCP Query Prefix**: {query_prefix or empty}
- **Initialized**: {date}
- **Docs Found**: (queried on demand)
- **Cache Location**: aidlc-docs/_shared/kb-cache/
```

### Step 2: Discover Documents

#### For Type=local:

If a valid local path was provided:

1. List all documentation files found at the specified location
2. Present the discovery results:
   ```markdown
   **Documents found at `{path}`:**

   - `architecture-overview.md`
   - `api-design.md`
   - `auth-module-spec.md`
   - `database-schema.md`

   Total: {count} documents
   ```

#### For Type=mcp:

If MCP connection was successful:

1. Query MCP server for available documentation topics
2. Cache the index to `aidlc-docs/_shared/kb-cache/mcp-index.md`
3. Present the discovery results:
   ```markdown
   **Documentation available via MCP server `{server_name}`:**

   Topics discovered:
   - Architecture Overview
   - API Design
   - Authentication Module
   - Database Schema

   Total: {count} topics

   Note: Full content will be queried on-demand during workflow phases.
   Cached index saved to: aidlc-docs/_shared/kb-cache/mcp-index.md
   ```

**MCP Query Pattern**:
```
Server: {configured MCP server name}
Query: "{query_prefix} list all documentation topics and sections"
```

### Step 2.5: Auto-Extract Technical Stack (NEW)

**Purpose**: Automatically scan planning docs to extract technical stack information and generate TECHNICAL_GUIDELINES.md.

**ONLY execute this step if planning docs were found in Step 2.**

#### 2.5.1 Scan Planning Docs for Technical Stack

Search all discovered markdown files for technical stack information:

**Look for section headers**:
- "Technology Stack", "Tech Stack", "Technologies", "Technical Overview"
- "Architecture", "System Architecture", "Technical Architecture"
- "Dependencies", "Frameworks", "Libraries", "Tools"
- "Database", "Backend", "Frontend", "Infrastructure"

**Extract specific categories**:

| Category | Search Patterns | Examples |
|----------|----------------|----------|
| **Frameworks** | Framework names with versions | Next.js 16.1.4, FastAPI, Django 4.x, Spring Boot 3.2 |
| **Languages** | Language names with versions | Python 3.12+, TypeScript 5.x, Java 21, Go 1.22 |
| **Databases** | Database names with versions | PostgreSQL 18, MongoDB 7.0, MySQL 8.0, Redis 7.2 |
| **ORMs/Query Tools** | ORM/query library names | SQLAlchemy 2.0, Prisma, Hibernate, GORM |
| **UI Libraries** | UI component libraries | shadcn/ui, Material-UI, Ant Design, Chakra UI |
| **State Management** | State management tools | Zustand, Redux Toolkit, Pinia, Recoil |
| **AI/ML SDKs** | AI/ML framework names | Strands SDK, LangChain, LlamaIndex, OpenAI SDK |
| **Testing Tools** | Testing frameworks | pytest, Jest, Vitest, JUnit, Cypress |
| **Build Tools** | Build system tools | Vite, Webpack, Gradle, Maven, npm |
| **Cloud/Infrastructure** | Cloud provider services | AWS Lambda, Google Cloud Run, Azure Functions |
| **Runtime** | Runtime environments | Node.js 20.x, Deno, Bun, Python 3.12 |

**Extraction heuristics**:
- Prefer explicit version numbers (e.g., "PostgreSQL 18") over generic mentions
- Look for "we use", "built with", "based on", "powered by" phrases
- Scan bullet lists under tech stack sections
- Check README files for dependency listings
- Look for package.json, requirements.txt, pom.xml, build.gradle references in planning docs

#### 2.5.2 Generate TECHNICAL_GUIDELINES.md Draft

If technical stack information was found, generate a draft TECHNICAL_GUIDELINES.md:

```markdown
# Technical Guidelines

> This file is loaded at the start of EVERY AI-DLC session.
> Auto-generated from planning docs during initialization. Edit to refine.

## Framework & Versions
{extracted_frameworks}

## Language & Runtime
{extracted_languages}

## Database & ORM
{extracted_databases}
{extracted_orms}

## Component Standards
{extracted_ui_libraries}
{extracted_state_management}

## AI/ML SDKs
{extracted_ai_sdks}

## Testing Tools
{extracted_testing_tools}

## Build & Infrastructure
{extracted_build_tools}
{extracted_cloud_infrastructure}

## Coding Standards
- [TODO: Add project-specific coding standards not found in planning docs]

## Constraints
- [TODO: Add hard constraints that must never be violated]

---
*Auto-generated: {timestamp}*
*Source documents: {list of planning docs scanned}*
```

**Formatting rules**:
- Use bullet points with bold labels: `- **Framework**: Next.js 16.1.4`
- If category has no extracted data, omit the section entirely
- Include source attribution at bottom

#### 2.5.3 Present Technical Guidelines for Review

**If technical stack was successfully extracted**, present to user BEFORE Step 3:

```markdown
**Auto-Extracted Technical Stack**

I scanned {count} planning documents and extracted this technical stack:

## Framework & Versions
- **Backend**: Python 3.12+, FastAPI
- **Frontend**: Next.js 16.1.4, React 19

## Database & ORM
- **Database**: PostgreSQL 18 with pgvector
- **ORM**: SQLAlchemy 2.0 (async-first)
- **Migrations**: Alembic

## AI/ML SDKs
- **Primary SDK**: Strands Agents SDK
- **Vector Store**: pgvector

## Component Standards
- **UI Library**: shadcn/ui
- **State Management**: Zustand

**Source documents**: v2-orbit-overview.md, v2-postgres-sqlalchemy-strategy.md, v2-multiagent-architecture.md

Would you like me to:

A) Generate TECHNICAL_GUIDELINES.md with this extracted stack (Recommended)
B) Let me manually specify the tech stack instead (skip auto-extraction)
C) Skip technical guidelines for now (can add later)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling**:

| Answer | Behavior |
|--------|----------|
| **A) Generate with extracted stack** | Create TECHNICAL_GUIDELINES.md at {knowledge_base}/TECHNICAL_GUIDELINES.md, add to anchor-map.md |
| **B) Manual specification** | Fall back to original Question 2 workflow (ask user to provide path or create template) |
| **C) Skip** | No guidelines section in anchor-map.md |
| **X) Other** | Clarify user intent |

**If NO technical stack was extracted** (empty results):

```markdown
I scanned {count} planning documents but couldn't auto-extract technical stack information.

Would you like to:

A) Provide a specific planning doc to scan (e.g., architecture-overview.md)
B) Manually specify the tech stack now
C) Skip technical guidelines for now (can add later)

[Answer]:
```

#### 2.5.4 Create TECHNICAL_GUIDELINES.md

If user approved Option A, create the file:

1. **Location**: `{knowledge_base}/TECHNICAL_GUIDELINES.md`
2. **Content**: Use the generated draft from Step 2.5.2
3. **Add to anchor-map.md**: Include in `## Project-Wide Guidelines` section
4. **Validation**: File must be non-empty and contain at least one technical constraint

**Success message**:

```markdown
✅ Created TECHNICAL_GUIDELINES.md at {path}

This file will be loaded at the start of EVERY AI-DLC session to enforce these standards.

You can edit it anytime to refine the constraints.
```

---

### Step 2.6: Auto-Extract Design Specifications from Planning Docs (NEW)

**Purpose**: Automatically scan planning docs to extract design specifications and generate DESIGN_GUIDELINES.md.

**ONLY execute this step if planning docs were found in Step 2.**

**Skip if**:
- No planning docs (user answered `none` to Question 1)
- Greenfield project with no design documentation

#### 2.6.1 Scan Planning Docs for Design Specifications

Search all discovered markdown files for design-related content:

**Look for section headers**:
- "Design System", "Design Tokens", "Brand Guidelines", "Style Guide"
- "Visual Design", "UI/UX Standards", "Component Library"
- "Colors", "Typography", "Spacing", "Layout"
- "Animations", "Transitions", "Interactions"

**Extract specific categories**:

| Category | Search Patterns | Examples |
|----------|----------------|----------|
| **Design System** | Figma URLs, Storybook links, MCP server mentions | figma.com/file/, storybook URLs |
| **Component Library** | Library names with versions | shadcn/ui, Material-UI, Ant Design, Chakra UI |
| **Colors** | Hex color codes, CSS variables | #0978ee, --color-primary, $primary-color |
| **Typography** | Font family declarations, size scales | Inter, Roboto, 16px base, 1.5 line-height |
| **Spacing** | Spacing scales, grid systems | 4/8/16/24px, 8px grid, 12-column grid |
| **Animations** | Duration values, easing functions | 300ms, ease-in-out, cubic-bezier() |
| **Breakpoints** | Responsive breakpoint values | 640px, 768px, 1024px, 1280px |
| **Icon Library** | Icon library names | Lucide, Heroicons, Material Icons, Font Awesome |

**Extraction heuristics**:
- Prefer explicit declarations over generic mentions
- Look for code blocks with CSS/SCSS/Tailwind config
- Scan for design decision documents
- Check for references to external design systems

**Figma MCP Integration**:
- Search for Figma URLs in planning docs
- Check if Figma MCP server is mentioned or configured
- Note: MCP integration will be prompted in Step 2.7

#### 2.6.2 Generate DESIGN_GUIDELINES.md Draft

If design specifications were found, generate a draft DESIGN_GUIDELINES.md:

```markdown
# Design Guidelines

> This file is loaded at the start of EVERY AI-DLC session.
> Auto-generated from planning docs during initialization. Edit to refine.

## Design System
{extracted_design_system}

## Visual Design Tokens
{extracted_colors}
{extracted_typography}
{extracted_spacing}

## Interaction Patterns
{extracted_animations}

## Screen States (Default Behaviors)
{extracted_patterns}

## Responsive Strategy
{extracted_breakpoints}

## Accessibility
{extracted_a11y_standards}

## Constraints
- [TODO: Add hard constraints that must never be violated]

---
*Auto-generated: {timestamp}*
*Source documents: {list of planning docs scanned}*
```

**Formatting rules**:
- Use bullet points with bold labels: `- **Primary**: #0978ee`
- If category has no extracted data, include with `[TODO]` placeholder
- Include source attribution at bottom

#### 2.6.3 Present Design Guidelines for Review

**If design specifications were successfully extracted**, present to user BEFORE Step 3:

```markdown
**Auto-Extracted Design Specifications**

I scanned {count} planning documents and extracted these design specifications:

## Design System
- **Design System**: {Figma URL or None}
- **Component Library**: {library name}
- **Icon Library**: {icon library}

## Visual Design Tokens
### Colors
- **Primary**: {color}
- **Secondary**: {color}
(additional colors...)

### Typography
- **Font Family**: {fonts}
- **Scale**: {scale}

### Spacing
- **Base Unit**: {unit}
- **Scale**: {scale}

## Interaction Patterns
- **Animation Duration**: {durations}
- **Easing**: {easing}

## Responsive Strategy
- **Breakpoints**: {breakpoints}

**Source documents**: {list of docs}

Would you like me to:

A) Generate DESIGN_GUIDELINES.md with this extracted design system (Recommended)
B) Let me manually specify the design system instead (skip auto-extraction)
C) Skip design guidelines for now (can add later)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling**:

| Answer | Behavior |
|--------|----------|
| **A) Generate with extracted design specs** | Proceed to Step 2.8 with auto-generated content |
| **B) Manual specification** | Fall back to Question 3 workflow (ask user to provide path or create template) |
| **C) Skip** | No design guidelines section in anchor-map.md |
| **X) Other** | Clarify user intent |

**If Figma URL was found in planning docs**, add follow-up question:

```markdown
I found a Figma file reference in your planning docs: {URL}

Do you have a Figma MCP server configured to extract design tokens automatically?

A) Yes, MCP server name: [provide name]
B) No, use the planning doc extraction above
C) Skip Figma integration for now

[Answer]:
```

**If NO design specifications were extracted** (empty results):

```markdown
I scanned {count} planning documents but couldn't auto-extract design specifications.

Would you like to:

A) Manually create design guidelines now
B) Skip design guidelines for now (can add later)

[Answer]:
```

If user selects A, proceed to Question 3 below.

---

### Question 3: Design Guidelines (Optional - Fallback)

**ONLY ask this question if**:
- User answered `none` to Question 1 (no planning docs), OR
- User selected "Manual specification" in Step 2.6.3, OR
- Design specs auto-extraction failed

**Skip this question if**:
- Design specs were auto-extracted and user approved Option A in Step 2.6.3

```markdown
## Question 3: Design Guidelines (Optional)

Does this project have design specifications or a design system?

A) Yes, it's at: [provide path, e.g., docs/DESIGN_GUIDELINES.md]
B) Yes, Figma file with MCP server configured
C) Create a template for me at {knowledge_base}/DESIGN_GUIDELINES.md
D) Skip for now (I'm not a designer / backend-only project)
X) Other (please describe after [Answer]: tag below)

[Answer]:
```

**Answer Handling for Question 3:**

| Answer | Behavior |
|--------|----------|
| **A) Path provided** | Validate file exists, add to anchor-map.md |
| **B) Figma MCP** | Ask for MCP server name and Figma URL, attempt extraction (see Step 2.7) |
| **C) Create template** | Generate TODO template at {knowledge_base}/DESIGN_GUIDELINES.md, add to anchor-map.md |
| **D) Skip** | No design guidelines section in anchor-map.md (can be added later) |

**If user selects B (Figma MCP)**, follow up with:

```markdown
You indicated Figma file with MCP server. Please provide:

1. **MCP Server Name**: [e.g., figma-design-system]
2. **Figma File URL** (optional): [URL for reference]

I'll attempt to connect to the MCP server to extract design tokens. If the server is not available or not configured, I'll fall back to creating a template with TODO placeholders.

[Answer]:
```

---

### Step 2.7: Extract from Figma MCP (if applicable)

**Execute ONLY if**:
- User selected "Figma MCP" option AND provided MCP server name

**Process**:

1. **Attempt MCP connection**:
   - Query the specified MCP server
   - Request design tokens: colors, typography, spacing, components

2. **If successful**:
   - Extract color styles, text styles, spacing tokens
   - Generate DESIGN_GUIDELINES.md with extracted values
   - Present for approval (proceed to Step 2.8)

3. **If connection fails or MCP not configured**:
   ```markdown
   ⚠️ **Figma MCP Connection Failed**

   I couldn't connect to the MCP server "{server_name}".

   This could mean:
   - MCP server is not running or configured
   - Server name is incorrect
   - Network/authentication issue

   **Fallback options**:

   A) Create DESIGN_GUIDELINES.md template with TODO placeholders
   B) Skip design guidelines for now (can configure MCP and re-run initialization later)
   X) Other (please describe after [Answer]: tag below)

   [Answer]:
   ```

---

### Step 2.8: Create DESIGN_GUIDELINES.md

**Execute if user approved**:
- Option A in Step 2.6.3 (auto-extracted design specs), OR
- Option A/C in Question 3 (manual path or template), OR
- Successful Figma MCP extraction in Step 2.7

**Process**:

1. **Determine content source**:
   - Auto-extracted from planning docs (Step 2.6.2)
   - Figma MCP extraction (Step 2.7)
   - User-provided path (validate and reference)
   - TODO template (generate from template in design-guidelines.md)

2. **Location**: `{knowledge_base}/DESIGN_GUIDELINES.md`

3. **Content**: Use the appropriate source from step 1

4. **Add to anchor-map.md**: Include in `## Project-Wide Guidelines` section:
   ```markdown
   ## Project-Wide Guidelines

   - **Technical Guidelines**: {path to TECHNICAL_GUIDELINES.md}
   - **Design Guidelines**: {path to DESIGN_GUIDELINES.md}
   - **Last Updated**: {timestamp}
   ```

5. **Validation**: File must be non-empty

**Success message**:

```markdown
✅ Created DESIGN_GUIDELINES.md at {path}

This file will be loaded at the start of EVERY AI-DLC session to enforce visual and behavioral standards.

You can edit it anytime to refine the design specifications.
```

---

### Step 3: Derive Domain Structure (ENHANCED - Auto-Detection)

**Purpose**: Automatically detect domains from planning doc structure and content instead of manual specification.

#### 3.1 Domain Detection Strategy

Use multi-heuristic analysis to identify domains:

**Heuristic 1: Directory Structure**

If planning docs are organized in subdirectories, use those as domain indicators:

```
docs/
  architecture/  → "architecture" or "core" domain
  database/      → "database" domain
  auth/          → "auth" domain
  api/           → "api" domain
  frontend/      → "frontend" domain
  rag/           → "rag" domain
```

**Heuristic 2: Document Naming Patterns**

Extract domain names from file prefixes and themes:

| File Name Pattern | Detected Domain | Rationale |
|-------------------|-----------------|-----------|
| `auth-*.md`, `authentication-*.md` | **auth** | Authentication/authorization |
| `api-*.md`, `rest-*.md`, `graphql-*.md` | **api** | API layer |
| `database-*.md`, `db-*.md`, `schema-*.md` | **database** | Data persistence |
| `frontend-*.md`, `ui-*.md`, `web-*.md` | **frontend** | User interface |
| `rag-*.md`, `knowledge-*.md`, `retrieval-*.md` | **rag** | Retrieval-augmented generation |
| `security-*.md`, `encryption-*.md` | **security** | Security layer |
| `multiagent-*.md`, `agents-*.md` | **agents** | Multi-agent systems |
| `testing-*.md`, `test-*.md` | **testing** | Test infrastructure |
| `infra-*.md`, `infrastructure-*.md`, `deployment-*.md` | **infrastructure** | Deployment/ops |
| `multitenancy-*.md`, `tenants-*.md` | **multitenancy** | Multi-tenant architecture |

**Heuristic 3: Content Analysis**

Scan document contents for domain indicators (section headers, keywords):

- **Authentication domain**: "JWT", "OAuth", "session", "login", "authorization", "RBAC"
- **API domain**: "REST endpoint", "GraphQL schema", "API contract", "OpenAPI"
- **Database domain**: "table schema", "migration", "SQL", "NoSQL", "indexes", "relationships"
- **Frontend domain**: "component", "UI", "React", "Vue", "Angular", "user interface"
- **RAG domain**: "vector store", "embedding", "retrieval", "knowledge base", "RAG pipeline"
- **Security domain**: "encryption", "TLS", "certificates", "secrets management", "compliance"

**Heuristic 4: Architectural Layer Detection**

Look for planning docs describing system layers:

- Architecture overview docs mentioning "layers", "tiers", "modules", "components"
- Folder structure docs showing package organization
- Component interaction diagrams showing boundaries

#### 3.2 Domain Mapping Algorithm

Execute the following steps:

1. **Collect domain candidates**:
   - From subdirectory names (if planning docs are organized)
   - From file name prefixes (e.g., "auth-*", "api-*")
   - From content analysis (keyword frequency)

2. **Score each candidate domain**:
   - +3 points: Dedicated subdirectory exists
   - +2 points: 3+ files with matching prefix
   - +1 point: Mentioned in architecture overview doc
   - +1 point: High keyword frequency in content

3. **Filter and merge**:
   - Keep domains with score ≥ 3
   - Merge synonyms (e.g., "authentication" + "auth" → "auth")
   - Merge overlapping domains (e.g., "rest-api" + "api" → "api")

4. **Map documents to domains**:
   - Primary mapping: File name prefix match
   - Secondary mapping: Content keyword density
   - Fallback: Place in "core" or "architecture" domain

#### 3.3 Domain Description Generation

For each detected domain, generate a brief description:

```markdown
| Domain | Description | Basis |
|--------|-------------|-------|
| auth | Authentication and authorization layer | 4 docs with auth-* prefix, JWT/OAuth keywords |
| api | REST API and service contracts | 3 docs with api-* prefix, dedicated api/ subdirectory |
| database | Data persistence and schema management | database/ subdirectory, schema design docs |
| rag | RAG pipeline and knowledge bases | 5 docs with rag-* prefix, vector store keywords |
| frontend | User interface and web components | frontend/ subdirectory, React/UI keywords |
| infrastructure | Deployment and cloud infrastructure | infra-* files, AWS/Docker keywords |
```

#### 3.4 Anchor Document Selection

For each domain, identify anchor documents (primary and secondary):

**Primary Anchor Doc Selection**:
1. Prefer files named `{domain}-overview.md`, `{domain}-architecture.md`, `{domain}-design.md`
2. If not found, select the longest document with matching prefix
3. If still not found, select the most keyword-dense document

**Secondary Anchor Doc Selection** (optional):
1. Look for `{domain}-api.md`, `{domain}-implementation.md`, `{domain}-strategy.md`
2. Select complementary docs that add detail to primary anchor

#### 3.5 Handle No Clear Domains

**IF no clear domains detected** (e.g., single planning doc, unstructured docs):

Default to a **minimal domain structure**:

```markdown
| Domain | Description | Anchor Documents |
|--------|-------------|------------------|
| core | Core application functionality | {most comprehensive planning doc} |
```

**Present warning to user**:

```markdown
⚠️ **Domain Detection Result**: No clear domain structure detected

I found {count} planning documents but couldn't identify distinct domains.

This could mean:
- Planning docs are not organized by domain/module
- Project is a simple monolith with no clear boundaries
- Domain structure is implicit rather than explicit

**Proposed approach**: Start with single "core" domain. You can create additional domains later as implementation work reveals boundaries.

Would you like to:
A) Use single "core" domain (Recommended for simple projects)
B) Manually specify domain structure now
C) Abort initialization and reorganize planning docs first

[Answer]:
```

#### 3.6 Present Detected Domains for Review

**Present detected domains to user BEFORE Step 4**:

```markdown
**Auto-Detected Domains**

I analyzed {count} planning documents and identified these domains:

| Domain | Description | Basis | Anchor Documents |
|--------|-------------|-------|------------------|
| auth | Authentication and authorization | 4 docs (auth-strategy.md, auth-api.md, auth-testing.md, auth-security.md) | auth-strategy.md |
| api | REST API layer | 3 docs (api-design.md, api-contracts.md, api-error-handling.md) | api-design.md |
| database | Data persistence | database/ subdirectory (3 docs) | database-schema.md |
| rag | RAG pipeline | 5 docs (rag-architecture.md, rag-knowledge-bases.md, ...) | rag-architecture.md |
| frontend | User interface | frontend/ subdirectory (2 docs) | frontend-overview.md |
| infrastructure | Deployment | 2 docs (infra-aws.md, infra-docker.md) | infra-aws.md |

**Detection confidence**: High (6 domains, clear file naming and subdirectory structure)

Would you like to:

A) Use these detected domains (Recommended)
B) Customize domain structure (add/remove/rename domains)
C) Start over with manual domain specification

[Answer]:
```

**Answer Handling**:

| Answer | Behavior |
|--------|----------|
| **A) Use detected domains** | Proceed to Step 4 with detected domain structure |
| **B) Customize** | Present editable domain list, collect changes, then proceed to Step 4 |
| **C) Manual specification** | Ask user to specify domains one by one |

---

**After domain review approval**, proceed to Step 4: Present Configuration for Review.

### Step 4: Present Configuration for Review

**Never write anything without developer confirmation.**

```markdown
**Proposed Project Configuration**

### Knowledge Base
- **Location**: `{path}` (or "none")
- **Documents Found**: {count}

### Technical Guidelines
- **Status**: {Auto-generated from planning docs | User-provided at {path} | Template created | Skipped}
- **Location**: {path if created}
- **Key Constraints**: {brief summary if auto-generated, e.g., "Python 3.12+, FastAPI, PostgreSQL 18, SQLAlchemy 2.0"}

### Proposed Domain Structure

| Domain | Description | Anchor Documents |
|--------|-------------|------------------|
| auth | Authentication and authorization | auth-module-spec.md |
| api | REST API design | api-design.md |
| database | Data persistence layer | database-schema.md |

### Proposed Domain Anchor Map

| Domain | Primary Anchor Doc | Secondary Anchor Doc |
|--------|-------------------|---------------------|
| auth | docs/planning/auth-module-spec.md | — |
| api | docs/planning/api-design.md | — |
| database | docs/planning/database-schema.md | — |

**Review this configuration:**
- A) Approve and proceed with initialization
- B) Request changes (specify what to modify)

[Answer]:
```

### Step 5: Write Configuration

After developer approval:

1. Create `aidlc-docs/` directory structure:
   - `aidlc-docs/` (root)
   - `aidlc-docs/_shared/` (for cross-domain artifacts)
   - `aidlc-docs/audit-archive/` (for archived audit logs)
2. Write `aidlc-docs/anchor-map.md` with confirmed configuration
3. Initialize domain directories under `aidlc-docs/`
4. Create empty master backlog at `aidlc-docs/aidlc-backlog.md`
5. Create initial `aidlc-docs/aidlc-state.md`
6. Create initial `aidlc-docs/audit.md` with project header

### Step 6: Commit

Create a single initialization commit:

```
chore(aidlc): initialize project configuration
```

This commit includes all files created during initialization.

---

## Anchor Map Format

The `aidlc-docs/anchor-map.md` file stores the project configuration using a **table format**:

```markdown
# Anchor Map

## Knowledge Base

- **Location**: docs/planning
- **Initialized**: 2026-03-02
- **Docs Found**: 5

## Project-Wide Guidelines

- **Technical Guidelines**: docs/TECHNICAL_GUIDELINES.md
- **Last Updated**: 2026-03-02

## Domain Anchor Map

| Domain | Primary Anchor Doc | Secondary Anchor Doc |
|--------|-------------------|---------------------|
| auth | docs/planning/auth-module-spec.md | — |
| api | docs/planning/api-design.md | docs/planning/api-contracts.md |
| database | docs/planning/database-schema.md | — |

## Planning Documents

| Feature | Document | Created | Status |
|---------|----------|---------|--------|
| (none yet) | — | — | — |
```

**Note**: The `## Project-Wide Guidelines` section is optional. If user skipped Question 2 during initialization, this section is omitted.

**Note**: The `## Planning Documents` section tracks outputs from Planning Mode (see `common/planning-mode.md`).

**Important**: Always use the table format shown above. This format:
- Is consistent with the template in `aidlc-docs/anchor-map.md`
- Enables easy parsing by the workflow
- Allows quick visual scanning of all domain mappings
- Matches the format specified in Section 9 of the framework spec

---

## Post-Initialization

After initialization completes:

1. The project is ready for its first unit of work
2. The knowledge base path is saved permanently — **never asked again**
3. Every subsequent Workspace Detection stage reads the anchor map automatically
4. Domain backlogs are created as units are started in each domain

---

## Re-Scan Variant

To update the domain structure after initialization, use:

**Trigger phrase**: `Using AI-DLC, re-scan knowledge base`

### Re-Scan Behavior

1. **Preserves** the existing knowledge base path (does not ask again)
2. **Re-runs** document discovery at the stored path
3. **Re-derives** domain structure from current document contents
4. **Presents** proposed changes for review before applying
5. **Updates** anchor map with confirmed changes

### When to Use Re-Scan

- New planning documents were added to the knowledge base
- Documents were reorganized or renamed
- Domain structure needs to be adjusted based on new documentation

### Re-Scan Does NOT

- Change the knowledge base path (edit anchor-map.md directly for this)
- Delete existing domain directories or backlogs
- Affect in-progress units of work

---

## Changing Knowledge Base Path

To change the knowledge base location after initialization:

1. Edit `aidlc-docs/anchor-map.md` directly
2. Update the "Location" field under "Knowledge Base"
3. Run `Using AI-DLC, re-scan knowledge base` to re-derive domains

---

## Error Handling

### Already Initialized

If `aidlc-docs/anchor-map.md` exists when initialization is triggered:

```markdown
**This project is already initialized.**

An existing configuration was found at `aidlc-docs/anchor-map.md`.

Would you like to:
A) View the current configuration
B) Re-scan the knowledge base (preserves path, updates domains)
C) Start fresh (WARNING: this will overwrite existing configuration)

[Answer]:
```

### Missing Knowledge Base Path Post-Initialization

If a session starts and anchor-map.md exists but has no Knowledge Base Location:

```markdown
**Configuration incomplete**: Knowledge Base Location is missing.

Please run `Using AI-DLC, initialize project` to complete setup.
```

---

## Integration with Workflow

### Workspace Detection

Every Workspace Detection stage:
1. Checks for `aidlc-docs/anchor-map.md`
2. Loads Knowledge Base Location from anchor map
3. Loads domain anchors relevant to the current unit
4. Never asks for the knowledge base path

### Session Summary

Initialization does not create a session summary (it is not a unit of work).

### Backlog

Initialization does not create backlog entries (it is not a unit of work).

---

## Summary

| Aspect | Value |
|--------|-------|
| **Trigger** | "Using AI-DLC, initialize project" |
| **Questions Asked** | One mandatory (knowledge base path), plus conditional questions (technical guidelines, design guidelines if no planning docs OR auto-extraction approvals if planning docs found) |
| **Auto-Extraction** | Technical stack AND design specifications auto-extracted from planning docs if available |
| **Domain Detection** | Domains auto-detected from directory structure, file naming, and content analysis |
| **Figma Integration** | Optional Figma MCP integration for design token extraction (graceful degradation if not available) |
| **Confirmation Required** | Yes (before writing anything) |
| **Commit Message** | `chore(aidlc): initialize project configuration` |
| **Re-scan Trigger** | "Using AI-DLC, re-scan knowledge base" |
| **Guidelines Update Triggers** | Technical: "Using AI-DLC, update technical guidelines"<br>Design: "Using AI-DLC, update design guidelines" |
| **Path Stored At** | `aidlc-docs/anchor-map.md` |

---

## Related: Dynamic Domain Creation

Initialization creates domains from planning documents. However, new domains can also be created mid-project when a user requests work that doesn't fit any existing domain.

See `common/domain-management.md` for rules on:
- Domain fit assessment during Workspace Detection
- Creating new domains dynamically
- Domain naming conventions
- Anchor doc assignment for new domains
