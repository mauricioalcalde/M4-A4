import { Ticket } from "../Ticket";

export type SupportResolution = {
  resolved: boolean;
  assignedTo: string;
  notes: string;
};

export interface SupportHandler {
  setNext(handler: SupportHandler): SupportHandler;
  handle(ticket: Ticket): SupportResolution;
}
