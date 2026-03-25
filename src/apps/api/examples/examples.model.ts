export class Example {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Example>) {
    Object.assign(this, partial);
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
