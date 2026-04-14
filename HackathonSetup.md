# Hackathon Setup

We are using Orbit's AI-DLC version for this exercise.
Orbit's AI-DLC is Claude Code dependent.

## Clone AI-DLC process documents

Clone the repository.

```
git clone https://github.com/InnoSoft-Canada-Inc/AIDLC.git
```
 We will copy contents of this folder into another folder later.

## Setup folder structure

Since most ideas will include more than one project (front-end and back-end), here is an example setup that includes three projects.

Easiest way to do this will be to create a folder called `Code` (or something that makes sense based on underlying projects) and have required projects cloned/moved into it.

We will be working in `Code` folder during our Hackathon.

Once cloned, rename all project specific CLAUDE.md files to CLAUDE-{projectname}.md.

```
Code/                              # Open this folder in VSCode, Claude Code terminal
│
└── Fusion                         # Fusion Repo (includes Database folder)
|   |__ {Existing Code}            
|   |__ CLAUDE-Fusion.md           # Project-specific Claude file
└── FusionCore                     # FusionCoreAPI Repo
|   |__ {Existing Code}            
|   |__ CLAUDE-FusionCore.md       # Project-specific Claude file
└── FusionPortal                   # Angular Portal
|   |__ {Existing Code}            
|   |__ CLAUDE-FusionPortal.md     # Project-specific Claude file
```

## Copy AI-DLC process files

Open previously cloned AIDLC folder and copy all folders and files into `Code/`

After copying, your workspace should look like below.

```
Code/                              # Open this folder in VSCode or Claude Code terminal
│
└── Fusion                         # Fusion Repo (includes Database folder)
|   |__ {Existing Code}            
|   |__ CLAUDE-Fusion.md           # Project-specific Claude file
└── FusionCore                     # FusionCoreAPI Repo
|   |__ {Existing Code}            
|   |__ CLAUDE-FusionCore.md       # Project-specific Claude file
└── FusionPortal                   # Angular Portal
|   |__ {Existing Code}            
|   |__ CLAUDE-FusionPortal.md     # Project-specific Claude file
|
|   # AI-DLC process related files
|   
├── CLAUDE.md                      # Core workflow (loaded by AI)
├── CLAUDE-TEAMS.md                # Agent Teams workflow (optional)
├── GETTING_STARTED.md             # Quick setup guide
├── README.md                      
│
├── .aidlc-rule-details/           # Rule detail library
│   ├── common/                    # Shared rules
│   │   ├── process-overview.md
│   │   ├── session-summary.md
│   │   ├── rollback.md
│   │   ├── backlog.md
│   │   ├── tracks.md
│   │   ├── exit-conditions.md
│   │   ├── task-alignment.md
│   │   ├── self-improvement.md    # Lessons learned capture
│   │   ├── subagent-strategy.md   # Subagent delegation patterns
│   │   └── ...
│   ├── inception/                 # Phase 1 rules
│   ├── construction/              # Phase 2 rules
│   ├── operations/                # Phase 3 rules (placeholder)
│   ├── testing/                   # Phase 4 rules
│   ├── documentation/             # Phase 5 rules
│   └── extensions/
│       ├── security/              # Security extensions
│       ├── documentation/         # Doc creation/review rules
│       └── project/               # Your team's conventions
│
├── .aidlc-rule-details-teams/     # Agent Teams overrides (optional)
│   ├── common/                    # Team orchestration + approval routing
│   ├── construction/              # Approval gate addendums
│   ├── testing/                   # Approval gate addendums
│   └── documentation/             # Approval gate addendums
```

## Reference existing Claude files

Open CLAUDE.md file (the one that came from AI-DLC clone), and reference project specific CLAUDE-{projectname}.md file in it. 

Put it at the top of CLAUDE.md.

```
# Project specific references
- `{projectname}/CLAUDE-{projectname}.md`
- `Fusion/CLAUDE-Fusion.md`
- `FusionCore/CLAUDE-FusionCore.md`
- `FusionGoApp/CLAUDE-FusionGoApp.md`
- `FusionPortal/CLAUDE-FusionPortal.md`
```

It will provide benefits during the process by helping establish existing practices since bunch of our projects are brownfield in nature.

## Check readiness

Initialize Claude in terminal and run this statement

`using AI-DLC, check readiness`

Response will be something like this,
```
  AI-DLC is not initialized for this project.

  To get started, run:
  Using AI-DLC, initialize project

  Or to begin work directly:
  Using AI-DLC, [describe what you want to build]
```

## README.md

To understand this process in-depth, please read README.md file.
*Do not rush and understand how AIDLC process works*

## Initialize the project (Optional, can be done during hackathon as first step)

At this point, you can initialize the project. It will ask for any documentation that is available in the repo. You can link it if one is available, otherwise project specific CLAUDE file can have it referenced in there.
It will create a new folder `aidlc-docs/` under main folder and build knowledge base for future use.

## During Hackathon

### Initialize the project if you haven't already

Add a new file named, new-feature-spec.md file under main directory you are working in. for e.g `c:/Code/new-feature-spec.md`

Use this file to prepare you story or work item using below format,

```
Title: {Enter story title. for e.g As a member, I should be able to payoff an invoice that is unpaid on my profile}

Description:
....

Acceptance Criteria: 
....

Projects: (Mention exact name of folders you want to include code in including both frontend and backend)
- FusionCore
- FusionPortal
.....

```

### Inception Phase

From now onwards, you will be working with AI to implement the feature. 

Run this prompt to start,

```
Using AI-DLC, build @new-feature-spec.md
```