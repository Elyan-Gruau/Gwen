export abstract class Card {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly description: string;
  protected readonly imageUrl: string;

  protected constructor(name: string, description: string, imageUrl: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getImageUrl(): string {
    return this.imageUrl;
  }
}
