import { randomUUID } from 'crypto';

export class Subscription {
  public readonly id: string;
  public userId: string;
  public eventId: string;
  public subscribedAt: Date;

  constructor(props: Omit<Subscription, 'id' | 'subscribedAt'>, id?: string) {
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.subscribedAt = new Date();
    this.id = id ?? randomUUID();
  }
}
