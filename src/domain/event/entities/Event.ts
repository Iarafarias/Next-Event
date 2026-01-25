import crypto from 'node:crypto';
export class Event {
  public readonly id: string;
  public name: string;
  public description: string;
  public date: Date;
  public location: string;

  constructor(props: Omit<Event, 'id'>, id?: string) {
    this.name = props.name;
    this.description = props.description;
    this.date = props.date;
    this.location = props.location;
    this.id = id ?? crypto.randomUUID();
  }
}
