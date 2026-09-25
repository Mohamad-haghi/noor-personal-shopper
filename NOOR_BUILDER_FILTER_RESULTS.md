# NOOR Personal Shopper — Builder Market Filter Results

STATUS: RESEARCHED — FINAL SELECTION PENDING PRACTICAL VERIFICATION
DATE: 2026-09-26

## Mandatory filters

A Builder is eligible for the execution pool only if all of these are satisfied:

1. Usable Free tier — not merely a short trial.
2. Usable from iPhone/Safari for the required workflow.
3. No mandatory phone/SMS verification for signup/use.
4. GitHub connection.
5. Existing GitHub repository import/connection.
6. Can continue work on an existing codebase.
7. Relevant to the NOOR scope: web UI, React/TypeScript/Vite-compatible work, multi-page/routing, incremental implementation.
8. Can execute scoped phases rather than requiring a greenfield rebuild.
9. Free-tier limits are sufficient for the assigned phase.

Important: if a criterion cannot be verified from current reliable evidence, it is marked UNVERIFIED rather than assumed to pass.

## Current candidates

### PASS CANDIDATES — still require practical gate tests

#### v0
Evidence:
- Free tier exists.
- Current v0 can import existing GitHub repositories and work on the actual codebase.
- Existing-codebase workflow is a core current v0 capability.
- Suitable for React/TypeScript web UI work.

Current result:
- Free: PASS
- Existing GitHub repo: PASS
- Existing codebase: PASS
- Scope relevance: PASS
- iPhone/Safari: REQUIRES PRACTICAL TEST
- Phone verification: REQUIRES PRACTICAL TEST

Decision:
QUALIFIED CANDIDATE — do not execute until iPhone + signup/phone gates are practically verified.

#### Bolt.new
Evidence:
- Free to start with a daily token limit.
- Runs in the browser with no local setup.
- Official GitHub integration supports importing existing repositories and two-way sync.
- Supports common JavaScript frameworks including Vite/React-compatible projects.

Current result:
- Free: PASS
- Browser/iPhone potential: PASS at platform level; iPhone workflow REQUIRES PRACTICAL TEST
- GitHub: PASS
- Existing repo: PASS
- Existing codebase: PASS
- Scope relevance: PASS
- Phone verification: REQUIRES PRACTICAL TEST

Decision:
QUALIFIED CANDIDATE — do not execute until iPhone + signup/phone gates are practically verified.

#### Builder.io
Evidence:
- Free plan exists.
- Free plan includes GitHub connection.
- Builder Code Projects directly connect to existing Git repositories and allow AI-assisted editing of the actual codebase.
- React is supported.
- Free usage is limited to 15 daily / 60 monthly Agent Credits.

Current result:
- Free: PASS
- GitHub: PASS
- Existing repo: PASS
- Existing codebase: PASS
- Scope relevance: PASS
- iPhone/Safari: REQUIRES PRACTICAL TEST
- Phone verification: REQUIRES PRACTICAL TEST

Decision:
QUALIFIED CANDIDATE — do not execute until iPhone + signup/phone gates are practically verified.

## HOLD / RECHECK LATER

### Dualite
- Free availability: PASS
- Existing-project/GitHub capability: RELEVANT
- Desktop-first execution environment conflicts with current iPhone-only constraint.
- Phone verification status is not sufficiently verified.

Decision:
HOLD — recheck when laptop access is available or if mobile workflow changes.

### Shipd
- Free access exists.
- Existing-codebase workflow is relevant.
- Current Free tier does not provide the GitHub workflow required for this project at the level needed for execution; GitHub push/codebase-aware capabilities are tied to higher tiers.

Decision:
HOLD — retain for future recheck if Free GitHub capabilities change.

### Base44
- Free tier exists.
- GitHub integration exists, but current official pricing states GitHub integration is on paid Builder tier or higher.
- Current documentation also states GitHub import is not supported for existing repositories.

Decision:
HOLD/FAIL CURRENT FILTER — not eligible for the current NOOR existing-repository workflow on Free.

### Firebase Studio
- GitHub integration exists.
- However, official documentation states that as of June 22, 2026, importing existing projects to create a new Firebase Studio workspace is disabled.
- Google recommends moving existing codebases to Google Antigravity or Google AI Studio.

Decision:
FAIL CURRENT EXISTING-REPO FILTER.

### Dyad
- Free and open source.
- GitHub import and existing-codebase support are strong.
- However, Dyad is a local desktop application for macOS/Windows/Linux and is not an iPhone/Safari builder environment.

Decision:
FAIL CURRENT iPHONE FILTER — retain as desktop fallback only.

### Google Antigravity
- Public preview and no-cost for individuals.
- Strong agentic development capability.
- Desktop application / desktop development environment; not suitable for the current iPhone-only execution requirement.

Decision:
FAIL CURRENT iPHONE FILTER.

### GitHub Copilot
- Free tier exists.
- GitHub Mobile and GitHub integration are available.
- However, the Free plan does not include Copilot Cloud Agent, which is the GitHub-hosted autonomous implementation capability needed for this workflow.
- Therefore it does not currently satisfy the required free agentic implementation workflow.

Decision:
FAIL CURRENT FREE-AGENT FILTER.

### Lovable
- Free tier and GitHub sync exist.
- Current available documentation indicates existing GitHub repository import is not supported as the required starting workflow.

Decision:
FAIL CURRENT EXISTING-REPO FILTER.

## Explicit project exclusion

### Replit
Replit is NOT part of the NOOR Builder pool by project decision and must not be reintroduced during this selection cycle.

## Current execution-pool rule

Only a candidate that passes ALL mandatory filters may enter the execution pool.

The three current candidates requiring practical verification are:

1. v0
2. Bolt.new
3. Builder.io

No ranking or final Builder assignment is made in this research file.

## Practical verification gate

Before assigning any NOOR phase, test each candidate for:

1. Signup using the available account method.
2. Whether phone/SMS verification is required.
3. Login from iPhone Safari.
4. Connect GitHub.
5. Select/import the NOOR repository.
6. Confirm the actual existing source tree is visible.
7. Confirm the Builder can make a harmless read-only/inspection step without rebuilding the project.
8. Confirm the relevant free-tier allowance.
9. Confirm the workflow is usable on iPhone.
10. Do not modify NOOR until all gates pass.

## Scope compatibility

The target project is already architecturally complete and verified.

The selected Builder must work on the existing NOOR repository and implement only the assigned Demo phase.

The Builder must not:
- rebuild the architecture,
- create a parallel architecture,
- inject Builder-specific workflow files into application code,
- add unrelated dependencies,
- implement future phases,
- create real NOOR integrations,
- fabricate NOOR data,
- or modify locked project governance.

## Source notes

This document records the market-filter result only. It does not replace the canonical NOOR Implementation & Integration Contract or NOOR_PROJECT_STATE.md.
