# SUBMISSION — QuickFix Behavioral Patterns Refactor

## 1) Approval criteria (from the assignment)

1. Correct **Strategy** implementation for SLA estimation (Premium/Standard/Enterprise).
2. Correct **Chain of Responsibility** implementation for ticket handling/escalation (Basic/Advanced/Manager).
3. Correct **Observer** implementation for notifications (Email/Slack/Billing) with `HelpDesk` not depending on concrete services.
4. The “monster method” is removed: `HelpDesk` does not hardcode business rules with conditionals by customer type / severity and does not call concrete services directly.
5. The solution compiles and runs, showing: SLA varies by customer type, handling follows the chain, observers receive notifications.
6. Brief explanation of how each pattern improves OCP (Open/Closed) and decouples the design.

## 2) Design notes (brief)

- **Strategy (SLA)**: `SlaStrategyRegistry` resolves an `SlaStrategy` by `customerType`. `HelpDesk` only executes the selected strategy.
- **Chain of Responsibility (Handling)**: `BasicSupportHandler -> AdvancedSupportHandler -> ManagerSupportHandler`. Each handler resolves or delegates.
- **Observer (Notifications)**: `HelpDesk` manages subscribers (attach/detach) and notifies on ticket completion. Notifiers encapsulate Email/Slack/Billing integrations.

## 3) Mapping: criteria → evidence in files

1. Strategy (SLA)
   - Code: `src/sla/SlaStrategy.ts`, `src/sla/ConcreteSlaStrategies.ts`, `src/sla/SlaStrategyRegistry.ts`
   - Integration: `src/HelpDesk.ts` (registry resolution, no if/else by customer type)

2. Chain of Responsibility (Handling)
   - Code: `src/support/SupportHandler.ts`, `src/support/BaseSupportHandler.ts`, `src/support/ConcreteSupportHandlers.ts`
   - Integration: `src/Main.ts` (chain creation), `src/HelpDesk.ts` (invokes first handler)

3. Observer (Notifications)
   - Code: `src/observer/SupportObserver.ts`, `src/observer/ConcreteNotifiers.ts`
   - Integration: `src/HelpDesk.ts` (attach/detach/notify), `src/Main.ts` (observer registration)

4. HelpDesk decoupling
   - `src/HelpDesk.ts` does not reference `EmailService`, `SlackService`, `BillingService`.
   - `src/HelpDesk.ts` does not compare `customerType` or `severity`; it delegates to Strategy + Chain.

## 4) Validation evidence (record)

Validation executed: `tsc -p tsconfig.json` → OK  
Validation executed: `node dist/Main.js` → OK  

Decoupling check in `HelpDesk.ts` (observed results):
- Search `EmailService|SlackService|BillingService` → no matches
- Search `customerType ===` / `severity ===` → no matches

Observed console output:

```text
Processing Ticket #101 (Standard - Basic)
SLA estimate: 24h
Handled by: Support L1 (Basic). Resolved.
Notifying observers...
Email: Sending customer confirmation.
Slack: Ticket resolved #101
Billing: (skipped) Standard customer.

Processing Ticket #102 (Enterprise - Critical)
SLA estimate: 1h
Handled by: Support Manager. Resolved.
Notifying observers...
Email: Sending customer confirmation.
Slack: Ticket resolved #102
Billing: Recording support charge.

Processing Ticket #103 (Premium - Medium)
SLA estimate: 2h
Handled by: Support L2 (Advanced). Resolved.
Notifying observers...
Email: Sending customer confirmation.
Slack: Ticket resolved #103
Billing: Recording support charge.

Config change: attach AuditNotifier

Processing Ticket #104 (Standard - Critical)
SLA estimate: 24h
Handled by: Support Manager. Resolved.
Notifying observers...
Email: Sending customer confirmation.
Slack: Ticket resolved #104
Billing: (skipped) Standard customer.
Audit: ticket=104 assignedTo='Support Manager' sla=24h

Config change: detach SlackNotifier

Processing Ticket #105 (Enterprise - Basic)
SLA estimate: 1h
Handled by: Support L1 (Basic). Resolved.
Notifying observers...
Email: Sending customer confirmation.
Billing: Recording support charge.
Audit: ticket=105 assignedTo='Support L1 (Basic)' sla=1h

Self-check
[OK] SLA Standard=24
[OK] SLA Premium=2
[OK] SLA Enterprise=1
[OK] Chain BASIC => L1
[OK] Chain MEDIUM => L2
[OK] Chain CRITICAL => Manager
```
