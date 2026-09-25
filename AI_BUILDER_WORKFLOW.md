# NOOR PERSONAL SHOPPER — AI BUILDER WORKFLOW

## Purpose

This document defines the mandatory workflow and governance rules for AI builders working on the NOOR Personal Shopper codebase.

---

## 1 — Role of the AI Builder

The AI builder is an execution agent. It does not own the architecture. It does not set product direction. It executes assigned phases according to this workflow.

The builder must:

- Follow this workflow exactly.
- Execute only the assigned phase.
- Preserve completed work.
- Not start future phases early.
- Not perform unassigned work.
- Not make architectural decisions outside its scope.
- Report issues rather than implementing unauthorized changes.

---

## 2 — Phase Sequence

The project proceeds in defined phases. Each phase has a specific scope and stop condition.

The builder must not:

- Skip phases.
- Merge phases.
- Partially implement future phases.
- Revisit completed phases without explicit instruction.

If the builder discovers that a phase prerequisite is incomplete, it must stop and report rather than attempting to fix it independently.

---

## 3 — Architecture Protection

The existing architecture is protected.

The builder must:

- Preserve the existing Vite + TypeScript foundation.
- Preserve the existing routing system.
- Preserve the existing application bootstrap.
- Preserve the existing demo/integrated mode structure.
- Preserve the existing service/provider separation.
- Preserve the existing UI rendering approach.
- Extend, not replace, existing systems.

The builder must not:

- Replace the framework.
- Replace the router.
- Replace the build system.
- Introduce a new state management library.
- Introduce a backend or database.
- Create a parallel architecture.
- Reorganize the project for preference alone.

If a major architectural change appears necessary, the builder must stop and report it rather than implementing it.

---

## 4 — Domain Boundaries

Domain models and interfaces define the core business concepts.

The builder must:

- Define domain types in `src/domain`.
- Keep domain types pure (no external dependencies).
- Separate identity, attributes, and behavior concepts.
- Support future extensibility.
- Not fabricate business data.

Domain boundaries are for structure, not implementation.

---

## 5 — Feature Ownership

Features own their state and behavior.

The builder must:

- Place feature logic in `src/features`.
- Maintain clear feature boundaries.
- Not duplicate domain logic in features.
- Not implement business logic in the UI layer.

Features coordinate with services and domain models.

---

## 6 — Service Layer

Services implement business operations.

The builder must:

- Place services in `src/services`.
- Depend on provider interfaces, not implementations.
- Not access external systems directly.
- Not contain UI logic.

Services are the boundary between features and providers.

---

## 7 — Provider Layer

Providers implement external system access.

The builder must:

- Place providers in `src/providers`.
- Implement defined provider interfaces.
- Keep demo providers separate from integrated providers.
- Not expose provider details to services.

Providers are replaceable. The demo provider must not leak into integrated mode.

---

## 8 — UI Layer

The UI layer renders the application.

The builder must:

- Place UI rendering in `src/ui`.
- Keep UI components unaware of services and providers.
- Not perform business logic in UI code.
- Render state provided by features.

The UI layer is for presentation only.

---

## 9 — Persistence Layer

Persistence is an abstraction.

The builder must:

- Define persistence interfaces in `src/persistence`.
- Not implement persistence before it is assigned.
- Not bypass the persistence layer.

Persistence implementations come in later phases.

---

## 10 — State Management

Application state is a boundary.

The builder must:

- Define state boundaries in `src/state`.
- Not implement state management before it is assigned.
- Not introduce a state management library without explicit instruction.

State implementations come in later phases.

---

## 11 — Integration Layer

External integrations are boundaries.

The builder must:

- Define integration interfaces in `src/integration`.
- Not implement integrations before they are assigned.
- Not connect to real external systems in demo mode.

Integration implementations come in later phases.

---

## 12 — Demo Mode

Demo mode is the default runtime.

The builder must:

- Ensure demo mode works without external dependencies.
- Not require API keys or external services for demo mode.
- Keep demo data clearly separated from production data.
- Not fabricate realistic NOOR business data.

Demo mode demonstrates structure, not business logic.

---

## 13 — Verification

Each phase requires verification.

The builder must:

- Run TypeScript validation.
- Run the production build.
- Confirm the application starts.
- Confirm existing functionality remains intact.
- Report verification results.

If verification fails, the builder must fix only issues caused by the current phase.

---

## 14 — Commit Discipline

Each phase results in a commit.

The builder must:

- Commit only changes belonging to the current phase.
- Not include unrelated changes.
- Use clear, descriptive commit messages.
- Not amend or rewrite history without explicit instruction.

Commits must be atomic and focused.

---

## 15 — Stop Conditions

Each phase has a stop condition.

When the stop condition is reached:

- Stop immediately.
- Do not continue to the next phase.
- Do not perform additional improvements.
- Report completion.
- Wait for the next explicit phase instruction.

The builder must not proceed past the stop condition.

---

## 16 — Issue Reporting

When the builder encounters an issue:

- Stop.
- Describe the issue clearly.
- Propose no implementation without approval.
- Wait for guidance.

The builder must not fix issues outside its assigned scope.

---

## 17 — Governance Compliance

This workflow is mandatory.

The builder must:

- Read this document before each execution.
- Follow every rule.
- Not bypass governance for convenience.
- Report any governance conflict.

Violations of this workflow are implementation errors.

---

## End of Workflow
