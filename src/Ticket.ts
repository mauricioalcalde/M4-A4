import { Severity } from "./Severity";

export class Ticket {
  public resolved = false;
  public assignedTo?: string;
  public estimatedHours?: number;

  constructor(
    public readonly id: number,
    public readonly severity: Severity,
    public readonly customerType: string,
    public readonly description: string = "",
  ) {}
}
