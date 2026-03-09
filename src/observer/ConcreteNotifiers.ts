import { SupportObserver, TicketResolvedEvent } from "./SupportObserver";
import { EmailService } from "../services/EmailService";
import { SlackService } from "../services/SlackService";
import { BillingService } from "../services/BillingService";

export class EmailNotifier implements SupportObserver {
  constructor(private readonly email: EmailService) {}

  update(_event: TicketResolvedEvent): void {
    this.email.sendConfirmation();
  }
}

export class SlackNotifier implements SupportObserver {
  constructor(private readonly slack: SlackService) {}

  update(event: TicketResolvedEvent): void {
    this.slack.notifyResolved(event.ticket.id);
  }
}

export class BillingNotifier implements SupportObserver {
  constructor(private readonly billing: BillingService) {}

  update(event: TicketResolvedEvent): void {
    if (event.ticket.customerType === "Premium" || event.ticket.customerType === "Enterprise") {
      this.billing.registerCharge();
    } else {
      console.log("Billing: (skipped) Standard customer.");
    }
  }
}

export class AuditNotifier implements SupportObserver {
  update(event: TicketResolvedEvent): void {
    console.log(
      `Audit: ticket=${event.ticket.id} assignedTo='${event.resolution.assignedTo}' sla=${event.estimatedHours}h`,
    );
  }
}
