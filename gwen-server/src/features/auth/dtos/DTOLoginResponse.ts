export interface DTOUser {
  id: string;
  username: string;
  email: string;
  bio: string;
  profilePictureUrl?: string | null;
  elo: number;
  favorite_deck?: string | null;
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
      id: userId,
      username,
      email,
      bio,
      elo,
      profilePictureUrl,
    };
  }
}
