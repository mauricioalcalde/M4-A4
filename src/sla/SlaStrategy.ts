import { Ticket } from "../Ticket";

export interface SlaStrategy {
  calculateEstimate(ticket: Ticket): number;
}
