GLOBAL AI BUILDER WORKFLOW

Permanent Law for Builder Selection, Work Split, Ownership & Prompt Execution

Version: 1.0
Date: 2026-09-25
Status: GLOBAL / LOCKED

⸻

1. PURPOSE

This document defines the permanent workflow for selecting, assigning, coordinating, prompting, reviewing, and handing off work between AI Builders/Agents.

It applies to all Builder-based projects unless explicitly overridden for a specific project.

The purpose is to prevent:

* duplicate work
* conflicting Builder changes
* uncontrolled architecture changes
* silent scope expansion
* repeated prompts
* loss of project continuity
* unnecessary consumption of Builder quotas
* unclear ownership
* premature integration
* implementation based only on Builder claims rather than verified results

⸻

2. MASTER WORKFLOW

The mandatory workflow is:

AI Tool / Builder Capability Check
↓
Builder Selection
↓
Work Split & Ownership
↓
Define Current Phase
↓
Prepare Phase Prompt
↓
Execute
↓
Review Actual Result
↓
Update Checkpoint
↓
Gap Analysis
↓
Define Next Phase
↓
Prepare Next Prompt

Master Principle

DO NOT PROMPT FIRST.
FIRST: SELECT → SPLIT → OWN → DEFINE → THEN PROMPT.

After execution:

EXECUTE → VERIFY → CHECKPOINT → GAP ANALYSIS → NEXT PROMPT

⸻

3. AI TOOL / BUILDER CAPABILITY CHECK

Before selecting a Builder, the project must be analyzed according to its actual complexity.

The assessment should consider:

* UI complexity
* number of pages
* routing
* application state
* business logic
* domain models
* service layer
* provider/adapter architecture
* authentication
* persistence
* API/integration requirements
* backend requirements
* animation
* interactions
* responsive behavior
* assets/media
* testing
* debugging
* repository access
* GitHub integration
* deployment
* autonomy
* context handling
* continuation/resume capability
* mobile workflow
* maintenance requirements

Builder selection must be based on actual capabilities, not popularity or convenience.

⸻

4. COST AND ACCESS ARE MANDATORY CRITERIA

Cost and accessibility must be considered during Builder selection.

Priority should be given to:

1. Free tools
2. Usable Free Tier
3. Tools capable of completing the required phase within Free Tier limits

If a paid tool is considered, verify:

* Free Tier limits
* message/token/usage limits
* project size limitations
* repository limitations
* whether the required phase can actually be completed on the free plan
* upgrade cost
* interruption risk caused by quota limits

A tool must not be selected merely because it appears technically capable if its access model makes the project impractical.

⸻

5. BUILDER SELECTION

For every project, explicitly determine:

* Which Builder(s) will be used
* Why each Builder was selected
* What each Builder is responsible for
* What each Builder is NOT responsible for
* Which Builder owns the current phase
* What capabilities justify that assignment

If multiple Builders are used, the Work Split must be defined before prompting.

⸻

6. WORK SPLIT & OWNERSHIP

When more than one Builder is used, define:

Primary Responsibility

What each Builder owns.

Owned Phases

Which phases each Builder may execute.

Allowed Files / Layers

Which files, folders, architectural layers, or design areas the Builder may modify.

Forbidden Files / Layers

Which files, folders, architectural layers, or systems the Builder must not modify.

Dependencies

What another Builder must provide before this Builder starts.

Handoff Point

The exact condition under which work is handed from one Builder to another.

Merge / Review Method

How the resulting work will be verified and accepted.

⸻

7. ONE PRIMARY OWNER FOR CORE ARCHITECTURE

At any given time, there must be one primary Owner for sensitive Core Architecture areas.

This includes:

* Core Architecture
* Domain Models
* Business Logic
* Service Layer
* Provider / Adapter Architecture
* Persistence Architecture
* Routing Foundation
* Data Contracts
* Integration Boundaries
* Authentication / Identity Architecture
* Commerce Architecture

Multiple Builders must not independently modify the same core architectural layer without explicit coordination and review.

⸻

8. CORE BUILDER VS UI BUILDER

Core Builder

The Core Builder owns:

* application architecture
* domain models
* business logic
* services
* providers
* adapters
* persistence
* application state
* routing foundation
* integration boundaries
* API contracts
* authentication architecture
* functional implementation

UI Builder

The UI Builder owns:

* visual UI
* layout
* typography
* spacing
* responsive presentation
* styling
* visual hierarchy
* Hero visual implementation
* micro-interactions
* animation
* visual polish

The UI Builder must not independently change:

* Domain Models
* Service Contracts
* Provider Architecture
* Persistence Architecture
* Authentication
* Business Logic
* Backend/API architecture

unless explicitly approved as part of the assigned phase.

⸻

9. SOURCE OF TRUTH

Every project must have an explicitly defined Source of Truth.

For projects using GitHub as the canonical repository:

GitHub = Canonical Source of Truth

Builder previews, local states, screenshots, generated summaries, and Builder claims do not override the canonical repository.

For the NOOR Personal Shopper project:

GitHub repository = Canonical Source of Truth

⸻

10. ONE PHASE → ONE CONTROLLED PROMPT

The standard execution model is:

One Phase → One Controlled Prompt

Do not send a huge all-project prompt unless the Capability Check explicitly justifies it.

Each prompt should target one clearly defined phase or atomic group of work.

The purpose is to:

* reduce unintended changes
* preserve completed work
* simplify verification
* control quotas
* make failures recoverable
* maintain clear ownership

⸻

11. REQUIRED STRUCTURE OF EVERY BUILDER PROMPT

Every Builder prompt should contain:

A. Current State

What currently exists.

B. Completed Work

What is already complete and must be preserved.

C. Assigned Scope

Exactly what this Builder must implement.

D. Explicit Out of Scope

What the Builder must not implement or modify.

E. Architecture Rules

The architectural constraints and ownership rules.

F. Preservation Rules

What must remain unchanged.

G. Acceptance Criteria

Objective conditions for considering the phase complete.

H. Verification

What the Builder must check before reporting completion.

I. Stop Condition

Where the Builder must stop after completing the assigned phase.

⸻

12. GAP-ONLY PROMPTING

The next prompt must be based on the actual remaining gaps.

Required inputs:

1. Master / Scope
2. Architecture / Contract
3. Previous Prompt
4. Actual Current Code
5. Actual Preview / Test Result

Then:

Completed Items − Current Gaps = Next Prompt Scope

Do not resend completed requirements merely because they appeared in an earlier Master Prompt.

⸻

13. VERIFY THE ACTUAL RESULT

After every Builder execution:

Do not immediately write the next prompt.

First verify:

* actual code changes
* completeness
* broken functionality
* scope compliance
* architecture compliance
* ownership boundaries
* routing
* runtime behavior
* preview
* responsive behavior where relevant
* build/test status
* unintended changes
* regressions

A Builder saying “Done” is not sufficient evidence of completion.

The actual result must be reviewed independently.

⸻

14. CHECKPOINT UPDATE

After verification, update the project checkpoint.

The checkpoint must identify:

* current version/commit
* completed phase
* verified functionality
* remaining gaps
* known issues
* current Builder ownership
* next eligible phase
* required dependencies
* relevant architectural decisions

The checkpoint is the continuity bridge between sessions.

⸻

15. NO DUPLICATE WORK

The permanent rule is:

INSPECT FIRST → PRESERVE WHAT WORKS → CHANGE ONLY WHAT IS NEEDED

Before making changes:

1. Inspect the current implementation.
2. Identify what is already complete.
3. Identify actual gaps.
4. Modify only the required areas.
5. Preserve working functionality.

Do not rebuild existing functionality simply because rebuilding appears easier.

⸻

16. NO SILENT SCOPE EXPANSION

Builders must not silently introduce:

* new features
* new product requirements
* major architecture changes
* premature real integrations
* unnecessary services
* unnecessary dependencies
* unrelated refactors
* additional functionality outside the assigned phase

A necessary bug fix or architecture correction required to complete the current scope is permitted, but it must be reported.

⸻

17. ARCHITECTURE PROTECTION RULE

The existing project architecture and application skeleton are protected.

Builders must preserve and extend the existing architecture, not replace or redesign it.

Implement only the assigned phase and its required architectural work.

Structures may be created, refined, or adjusted when necessary to complete that phase, provided the existing architectural direction, boundaries, routing, and completed work remain intact.

Do not introduce:

* a parallel architecture
* duplicate existing systems
* unnecessary abstractions
* major architectural changes for convenience
* architecture replacement based on personal technical preference

If a major architectural change appears genuinely necessary:

STOP BEFORE MAKING IT.

Report:

1. The architectural problem
2. Why the current architecture cannot satisfy the requirement
3. The proposed change
4. The expected impact
5. What existing work would be affected

Implementation must wait for review and approval.

Principle

Complete and strengthen the existing architecture — do not replace it.

⸻

18. BUILDER HANDOFF

Every Builder handoff must define:

A. Delivered

What was completed and verified.

B. Next Builder May Change

The exact areas the next Builder is allowed to modify.

C. Next Builder Must Not Change

Protected areas and completed work.

D. Ready State

The exact condition in which the project is ready for the next Builder/phase.

No handoff is considered valid merely because a Builder reports completion.

⸻

19. ARCHITECTURE CHANGE CONTROL

Any major architecture change follows:

Architecture Gap
↓
Review
↓
Decision
↓
Approved Change
↓
Implementation

Do not allow:

Architecture Gap → Builder decides independently → Architecture replacement

⸻

20. MULTI-BUILDER PARALLEL WORK

Parallel Builder work is permitted only when:

* ownership is explicitly defined
* file/layer boundaries are clear
* Builders do not modify the same sensitive core layer
* dependencies are understood
* merge/review is defined

Preferred model:

One Owner per Layer
One Owner per Phase

⸻

21. BUILDER SELECTION CRITERIA

Builder selection should evaluate:

* UI capability
* coding capability
* architecture capability
* autonomy
* repository access
* GitHub integration
* context handling
* testing
* debugging
* mobile workflow
* deployment
* project limits
* Free Tier
* cost
* continuation/resume capability

The strongest Builder is not necessarily the best Builder for every phase.

Select the Builder according to the requirements of the current phase.

⸻

22. QUOTA AND INTERRUPTION MANAGEMENT

When Builder quota is limited:

1. Inspect the current state.
2. Inspect the latest checkpoint.
3. Identify the actual remaining gap.
4. Use a Resume/Continuation mechanism if it genuinely preserves context.
5. Otherwise create a short continuation prompt containing only the required context.

Never resend a large previous prompt without first reviewing the current state.

Quota must be treated as a project resource.

⸻

23. PROMPT OWNERSHIP

Every Builder prompt must identify:

* Builder
* Current phase
* Builder responsibility
* Why this Builder owns the task
* Allowed scope
* Protected scope

This prevents ambiguous responsibility and conflicting implementation.

⸻

24. REVIEW BEFORE NEXT PROMPT

Before preparing the next prompt, verify:

* Builder capability
* Builder selection
* Work split
* Ownership
* Current checkpoint
* Current phase
* Scope separation
* Architecture boundaries
* Actual implementation
* Actual runtime/preview
* Remaining gaps
* No conflicting core ownership
* No silent scope expansion

Only then prepare the next prompt.

⸻

25. GLOBAL EXECUTION LAW

For every Builder-based project:

FIRST WORK SPLIT.
THEN PHASE.
THEN PROMPT.

Never reverse this order.

The permanent execution cycle is:

SELECT → SPLIT → OWN → DEFINE → PROMPT → EXECUTE → VERIFY → CHECKPOINT → GAP ANALYSIS → NEXT PHASE

⸻

26. MASTER PRINCIPLE

AI Builders are executors, not autonomous project owners.

The project must remain governed by:

* defined scope
* defined architecture
* explicit ownership
* controlled phases
* verified results
* checkpoint continuity
* gap-only prompting
* human approval for major changes

The objective is not to maximize the amount of code produced.

The objective is to produce the correct result with controlled changes, preserved architecture, clear ownership, and verified progress.

⸻

STATUS

GLOBAL / LOCKED

This workflow applies permanently to Builder-based projects unless the user explicitly overrides it for a specific project.
