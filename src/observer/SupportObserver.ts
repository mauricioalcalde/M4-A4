import { Ticket } from "../Ticket";
import { SupportResolution } from "../support/SupportHandler";

export type TicketResolvedEvent = {
  ticket: Ticket;
  resolution: SupportResolution;
  estimatedHours: number;
};

export interface SupportObserver {
  update(event: TicketResolvedEvent): void;
}
