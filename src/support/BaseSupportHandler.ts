import { Ticket } from "../Ticket";
import { SupportHandler, SupportResolution } from "./SupportHandler";

export abstract class BaseSupportHandler implements SupportHandler {
  private next?: SupportHandler;

  setNext(handler: SupportHandler): SupportHandler {
    this.next = handler;
    return handler;
  }

  handle(ticket: Ticket): SupportResolution {
    if (this.canHandle(ticket)) {
      return this.doHandle(ticket);
    }

    if (this.next) {
      return this.next.handle(ticket);
    }

    return {
      resolved: false,
      assignedTo: "UNASSIGNED",
      notes: "No handler resolved the ticket.",
    };
  }

  protected abstract canHandle(ticket: Ticket): boolean;
  protected abstract doHandle(ticket: Ticket): SupportResolution;
}
