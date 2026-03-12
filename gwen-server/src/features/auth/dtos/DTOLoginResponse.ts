export class DTOLoginResponse {
  public readonly token: string;
  public readonly username: string;
  public readonly email: string;
  public readonly userId: string;
  public readonly jwtExpiration: number;

  constructor(
    token: string,
    username: string,
    email: string,
    userId: string,
    jwtExpiration: number,
  ) {
    this.token = token;
    this.username = username;
    this.email = email;
    this.userId = userId;
    this.jwtExpiration = jwtExpiration;
  }
}
