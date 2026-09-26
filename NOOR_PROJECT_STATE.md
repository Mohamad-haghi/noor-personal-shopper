# NOOR Personal Shopper — Project State

STATUS: VERIFIED — D6 READY
SOURCE OF TRUTH: GitHub `main`
LATEST VERIFIED ARCHITECTURE COMMIT: `e379635d3025a40c6915a5be7c3200281baaabd2`
LATEST VERIFIED D2 COMMIT: `e8adf1a6ef06f9f101404df03d2b6430a9b52dec`
LATEST D2 CHECKPOINT: `NOOR_D2_CHECKPOINT.md`
LATEST VERIFIED D3 COMMIT: `08d07442e00eb7578319dd44df1e64868c439589`
LATEST D3 CHECKPOINT: `NOOR_D3_CHECKPOINT.md`
LATEST VERIFIED D4 IMPLEMENTATION COMMIT: `ae21364edf369d199905217c3a5e1665f63909d1`
LATEST D4 CHECKPOINT: `NOOR_D4_CHECKPOINT.md`
LATEST VERIFIED D5 IMPLEMENTATION COMMIT: `7663c976146062dcac97ee47049a5111f46cbc8d`
LATEST D5 CHECKPOINT: `NOOR_D5_CHECKPOINT.md`

## Current Position

The full application architecture and structural foundation are complete and CI-verified.

Completed and verified:
- C1-C1 — Core Structure & Domain
- C1-C2 — Services & Providers
- C1-C3 — Persistence / State / Routing / Integration boundaries
- C1-C4 — Architecture hardening
- Full Architecture Completion
- D1 — Demo Foundation & Application Shell
- D2 — Hero & Demo Entry Experience
- D3 — Personal Shopper Journey
- D4 — Product Catalog & Recommendation Engine
- D5 — Choices / Favorites / Comparison

Current phase: D6 — Independent Shopper Account/Auth.

D2 GitHub Actions verification:
- Workflow: NOOR Build Verification
- Run: #76
- Run ID: 36222698488
- Commit: `e8adf1a6ef06f9f101404df03d2b6430a9b52dec`
- npm install: SUCCESS
- TypeScript strict type-check: SUCCESS
- Vite production build: SUCCESS

Runtime/browser QA remains a later gate and is not claimed until actually performed.

D4 verification:
- GitHub Actions Run #128 / Run ID 36259759181
- Behavioral tests: SUCCESS
- Type-check: SUCCESS
- Production build: SUCCESS

D5 verification:
- GitHub Actions Run #136 / Run ID 36259988464
- Behavioral tests: SUCCESS
- Type-check: SUCCESS
- Production build: SUCCESS

## Locked Demo Scope

The approved NOOR Personal Shopper Demo remains locked. Do not add, remove, or reinterpret features without explicit user approval.

The Demo includes:
- Minimal/cinematic Hero with Noor virtual salesperson
- Entry from «مشاور انتخاب عینک»
- Intro → type → use case → style → face shape
- Recommendation Engine
- 3 personalized recommendations with reasons
- Smart comparison
- «انتخاب‌های من»
- Purchase / in-person visit path
- Branch selection
- User selection profile
- Smart link to real NOOR inventory
- Independent Shopper Account/Auth
- Future-integration readiness without real NOOR production integration

No real NOOR API/CMS/auth/payment/booking integration is implemented unless explicitly assigned in a later phase.

## D3 Boundary

D3 implements only the Personal Shopper journey:
Entry → Intro → Product Type → Use Case → Style → Face Shape → Selection Profile → Recommendation.

D3 must:
- capture the user's selections into a structured Selection Profile
- support direct/guided face-shape selection
- use the existing ShopperFlowState boundary
- provide forward/back navigation and recovery
- remain Persian RTL and responsive
- preserve loading/error states
- connect through the existing service/application architecture

D3 must NOT:
- implement AI/LLM
- implement biometric or face recognition
- connect to real NOOR inventory
- implement real account synchronization
- introduce new routes unless explicitly required by the existing route contract
- introduce direct LocalStorage/database access
- replace or create a parallel architecture
- add unrelated dependencies, refactors, or features

## Architecture Rules

- GitHub is the canonical product source of truth.
- Extend the verified architecture; do not replace it or create a parallel architecture.
- UI/Feature → Domain → Service → Provider Interface → Demo Provider / Future Provider.
- External NOOR systems must remain behind explicit integration/adapter boundaries.
- UI must not directly call persistence, providers, or future external APIs.
- No invented NOOR data or production credentials.
- No unrelated refactors, dependency changes, or feature additions.
- A major architectural change requires STOP + report before implementation.
- Every valid implementation change must update project state/checkpoint documentation and be verified before the next phase is accepted.

## Builder Isolation — Permanent Rule

Builder instructions are execution rules, NOT product architecture.

Any Builder connected to this repository — including Dualite, v0, Builder.io, or Shipd — MUST follow these boundaries:

1. Builder-specific prompts, workflow rules, governance text, overlays, metadata, or tool conventions must NOT be copied into application source code.
2. Do NOT create Builder workflow files, Builder overlays, or Builder-specific runtime/configuration code inside `src/` or product configuration.
3. Do NOT create a parallel architecture merely to satisfy a Builder.
4. Do NOT add Builder-specific dependencies unless they are explicitly part of the approved product scope.
5. Project governance/checkpoint files are documentation only. They must never be imported, executed, bundled, or referenced by application code.
6. If a Builder needs instructions, those instructions must be supplied in its external execution prompt/context, while this file provides the repository-level boundary.
7. Before accepting Builder work, inspect the GitHub diff and remove/reject any Builder artifact that has entered the product repository.
8. A Builder must never rewrite or extend this rule into application code.
9. If the Builder cannot execute the assigned scope without violating these rules, it must STOP and report the conflict instead of changing the architecture.
10. The Builder chain is fixed for this project: Dualite → v0 → Builder.io → Shipd. Do not introduce another Builder without explicit user approval.

### Important distinction

This file is a project governance/checkpoint document. It is NOT part of the application runtime and must never be imported by the application.

## Do Not Repeat

Do not re-run or rebuild:
- C1-C1
- C1-C2
- C1-C3
- C1-C4
- Full Architecture Completion
- D1
- D2
- D3
- D4
- D5

Do not recreate architecture or completed implementation phases that already exist in GitHub.

## Required Builder Handoff Pattern

Before any Builder implementation:
1. Read this file and `NOOR_FULL_ARCHITECTURE_AUDIT.md`.
2. Inspect the actual current GitHub tree and diff from the verified baseline.
3. Identify the exact assigned phase and its boundaries.
4. Implement only that phase.
5. Verify the actual result.
6. Inspect the final diff for Builder artifacts/overlays before acceptance.
7. Update this project state/checkpoint only with factual results.

## Recovery

If a chat is interrupted, resume from this file and the latest verified GitHub commit. Do not restart completed phases.

This document intentionally does not duplicate source code or the full implementation contract. The implementation contract remains the canonical detailed reference outside the application source.
