export class InvalidCredentialException extends Error {
  constructor(email: string) {
    super(InvalidCredentialException.buildMessage(email));
    this.name = 'InvalidCredentialException';
  }

  private static buildMessage(email: string): string {
    return 'Invalid username or password for username ' + email;
  }
}
