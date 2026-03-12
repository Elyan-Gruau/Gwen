export class IllegalUsernameException extends Error {
  constructor(username: string) {
    super(
      `Illegal username: ${username}. Username must be alphanumeric and can contain underscores.`,
    );
    this.name = 'IllegalUsernameException';
  }
}
