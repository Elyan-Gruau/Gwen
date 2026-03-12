export class IllegalEmailException extends Error {
  constructor(email: string) {
    super(`Illegal email: ${email}. Email must be a valid email address format.`);
    this.name = 'IllegalEmailException';
  }
}
