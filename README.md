# QuickFix — Behavioral Patterns Refactor (TypeScript)

The QuickFix ticket flow was refactored to remove the “monster method” from `HelpDesk` and apply behavioral patterns.

## Scope
- Decouple SLA estimation (Strategy)
- Decouple escalation / ticket handling (Chain of Responsibility)
- Decouple notifications (Observer)

## Structure
- `src/sla/*`: SLA strategies + registry
- `src/support/*`: support handlers (chain)
- `src/observer/*`: observers / notifiers
- `src/services/*`: concrete services (Email/Slack/Billing)
- `src/HelpDesk.ts`: orchestration without concrete dependencies
- `src/Main.ts`: execution scenario + minimal self-check

## Evidence
Build/run evidence and the criteria mapping are recorded in `SUBMISSION.md`.
