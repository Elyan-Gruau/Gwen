export interface DTOUser {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePictureUrl?: string | null;
  elo: number;
}

export class DTOLoginResponse {
  public readonly token: string;
  public readonly user: DTOUser;

  constructor(
    token: string,
    userId: string,
    username: string,
    email: string,
    bio: string = '',
    elo: number = 1200,
    profilePictureUrl?: string | null,
  ) {
    this.token = token;
    this.user = {
      _id: userId,
      username,
      email,
      bio,
      elo,
      profilePictureUrl,
    };
  }
}
