import { Ticket } from "../Ticket";
import { SlaStrategy } from "./SlaStrategy";

export class PremiumSlaStrategy implements SlaStrategy {
  calculateEstimate(_ticket: Ticket): number {
    return 2;
  }
}

export class EnterpriseSlaStrategy implements SlaStrategy {
  calculateEstimate(_ticket: Ticket): number {
    return 1;
  }
}

export class StandardSlaStrategy implements SlaStrategy {
  calculateEstimate(_ticket: Ticket): number {
    return 24;
  }
}
