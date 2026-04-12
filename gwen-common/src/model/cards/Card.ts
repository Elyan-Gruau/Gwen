export abstract class Card {
  protected readonly id: string;
  protected readonly name: string;
  protected readonly description: string;
  protected readonly imageUrl: string;

  protected constructor(id: string, name: string, description: string, imageUrl: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  public getId(): string {
    return this.id;
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
