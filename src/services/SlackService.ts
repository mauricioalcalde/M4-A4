export class SlackService {
  notifyResolved(ticketId: number): void {
    console.log(`Slack: Ticket resolved #${ticketId}`);
  }
}
