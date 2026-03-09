import { Ticket } from "../Ticket";
import { Severity } from "../Severity";
import { BaseSupportHandler } from "./BaseSupportHandler";
import { SupportResolution } from "./SupportHandler";

export class BasicSupportHandler extends BaseSupportHandler {
  protected canHandle(ticket: Ticket): boolean {
    return ticket.severity === Severity.BASIC;
  }

  protected doHandle(ticket: Ticket): SupportResolution {
    ticket.resolved = true;
    ticket.assignedTo = "Support L1 (Basic)";
    return {
      resolved: true,
      assignedTo: ticket.assignedTo,
      notes: "Resolved.",
    };
  }
}

export class AdvancedSupportHandler extends BaseSupportHandler {
  protected canHandle(ticket: Ticket): boolean {
    return ticket.severity === Severity.MEDIUM;
  }

  protected doHandle(ticket: Ticket): SupportResolution {
    ticket.resolved = true;
    ticket.assignedTo = "Support L2 (Advanced)";
    return {
      resolved: true,
      assignedTo: ticket.assignedTo,
      notes: "Resolved.",
    };
  }
}

export class ManagerSupportHandler extends BaseSupportHandler {
  protected canHandle(ticket: Ticket): boolean {
    return ticket.severity === Severity.CRITICAL;
  }

  protected doHandle(ticket: Ticket): SupportResolution {
    ticket.resolved = true;
    ticket.assignedTo = "Support Manager";
    return {
      resolved: true,
      assignedTo: ticket.assignedTo,
      notes: "Resolved.",
    };
  }
}
