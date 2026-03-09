import { Ticket } from "./Ticket";
import { SlaStrategyRegistry } from "./sla/SlaStrategyRegistry";
import { SupportHandler } from "./support/SupportHandler";
import { SupportObserver, TicketResolvedEvent } from "./observer/SupportObserver";

export class HelpDesk {
  private readonly observers = new Set<SupportObserver>();

  constructor(
    private readonly slaRegistry: SlaStrategyRegistry,
    private readonly firstHandler: SupportHandler,
  ) {}

  attach(observer: SupportObserver): void {
    this.observers.add(observer);
  }

  detach(observer: SupportObserver): void {
    this.observers.delete(observer);
  }

  private notify(event: TicketResolvedEvent): void {
    for (const obs of this.observers) obs.update(event);
  }

  processTicket(ticket: Ticket): void {
    console.log(`\nProcessing Ticket #${ticket.id} (${ticket.customerType} - ${ticket.severity})`);

    const estimatedHours = this.slaRegistry.resolve(ticket.customerType).calculateEstimate(ticket);
    ticket.estimatedHours = estimatedHours;
    console.log(`SLA estimate: ${estimatedHours}h`);

    const resolution = this.firstHandler.handle(ticket);

    if (resolution.resolved) {
      console.log(`Handled by: ${resolution.assignedTo}. ${resolution.notes}`);
      console.log("Notifying observers...");

      this.notify({ ticket, resolution, estimatedHours });
    } else {
      console.log(resolution.notes);
    }
  }
}
