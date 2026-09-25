# NOOR Personal Shopper — Project State

STATUS: VERIFIED — READY FOR DEMO IMPLEMENTATION
SOURCE OF TRUTH: GitHub `main`
LATEST VERIFIED ARCHITECTURE COMMIT: `e379635d3025a40c6915a5be7c3200281baaabd2`
LATEST ARCHITECTURE CHECKPOINT: `NOOR_FULL_ARCHITECTURE_AUDIT.md`

## Current Position

The full application architecture and structural foundation are complete and CI-verified.

Completed and not to be repeated:
- C1-C1 — Core Structure & Domain
- C1-C2 — Services & Providers
- C1-C3 — Persistence / State / Routing / Integration boundaries
- C1-C4 — Architecture hardening
- Full Architecture Completion

The next implementation phase is Demo Layout/UI. Runtime/browser QA is still a later gate and is not claimed by the architecture CI.

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

Do not recreate architecture that already exists in GitHub.

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

If a chat is interrupted, resume from this file and the latest verified GitHub commit. Do not restart completed architecture phases.

This document intentionally does not duplicate source code or the full implementation contract. The implementation contract remains the canonical detailed reference outside the application source.
