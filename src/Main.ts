import { HelpDesk } from "./HelpDesk";
import { Ticket } from "./Ticket";
import { Severity } from "./Severity";

import { SlaStrategyRegistry } from "./sla/SlaStrategyRegistry";
import { EnterpriseSlaStrategy, PremiumSlaStrategy, StandardSlaStrategy } from "./sla/ConcreteSlaStrategies";

import { BasicSupportHandler, AdvancedSupportHandler, ManagerSupportHandler } from "./support/ConcreteSupportHandlers";

import { EmailService } from "./services/EmailService";
import { SlackService } from "./services/SlackService";
import { BillingService } from "./services/BillingService";
import { AuditNotifier, BillingNotifier, EmailNotifier, SlackNotifier } from "./observer/ConcreteNotifiers";

function assertEq<T>(name: string, actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`[FAIL] ${name}: expected=${String(expected)} actual=${String(actual)}`);
  }
  console.log(`[OK] ${name}`);
}

const slaRegistry = new SlaStrategyRegistry()
  .register("Premium", new PremiumSlaStrategy())
  .register("Enterprise", new EnterpriseSlaStrategy())
  .setDefault(new StandardSlaStrategy());

const basic = new BasicSupportHandler();
const advanced = new AdvancedSupportHandler();
const manager = new ManagerSupportHandler();
basic.setNext(advanced).setNext(manager);

const helpDesk = new HelpDesk(slaRegistry, basic);

const emailObs = new EmailNotifier(new EmailService());
const slackObs = new SlackNotifier(new SlackService());
const billingObs = new BillingNotifier(new BillingService());

helpDesk.attach(emailObs);
helpDesk.attach(slackObs);
helpDesk.attach(billingObs);

const t1 = new Ticket(101, Severity.BASIC, "Standard", "Reset password");
const t2 = new Ticket(102, Severity.CRITICAL, "Enterprise", "System outage");
const t3 = new Ticket(103, Severity.MEDIUM, "Premium", "Intermittent error");

helpDesk.processTicket(t1);
helpDesk.processTicket(t2);
helpDesk.processTicket(t3);

console.log("\nConfig change: attach AuditNotifier");
helpDesk.attach(new AuditNotifier());

const t4 = new Ticket(104, Severity.CRITICAL, "Standard", "Payment page down");
helpDesk.processTicket(t4);

console.log("\nConfig change: detach SlackNotifier");
helpDesk.detach(slackObs);

const t5 = new Ticket(105, Severity.BASIC, "Enterprise", "VPN access");
helpDesk.processTicket(t5);

console.log("\nSelf-check");
assertEq("SLA Standard=24", slaRegistry.resolve("Standard").calculateEstimate(t1), 24);
assertEq("SLA Premium=2", slaRegistry.resolve("Premium").calculateEstimate(t3), 2);
assertEq("SLA Enterprise=1", slaRegistry.resolve("Enterprise").calculateEstimate(t2), 1);

assertEq(
  "Chain BASIC => L1",
  basic.handle(new Ticket(201, Severity.BASIC, "Standard")).assignedTo,
  "Support L1 (Basic)",
);
assertEq(
  "Chain MEDIUM => L2",
  basic.handle(new Ticket(202, Severity.MEDIUM, "Standard")).assignedTo,
  "Support L2 (Advanced)",
);
assertEq(
  "Chain CRITICAL => Manager",
  basic.handle(new Ticket(203, Severity.CRITICAL, "Standard")).assignedTo,
  "Support Manager",
);
