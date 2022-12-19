export class QueueNotFoundError extends Error {
  constructor(private readonly key: string) {
    super('Queue not found');
    this.name = this.constructor.name;
  }

  public toString(): string {
    return `${this.message} : ${this.key}`;
  }
}
