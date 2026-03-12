export class DuplicateUsernameException extends Error {
  constructor(username: string) {
    super(`Username '${username}' is already taken. Please choose a different username.`);
    this.name = 'DuplicateUsernameException';
  }
}
