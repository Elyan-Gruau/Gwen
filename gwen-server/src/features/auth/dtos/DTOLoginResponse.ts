export interface DTOUser {
  _id: string;
  username: string;
  email: string;
  bio: string;
  profilePictureUrl?: string | null;
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
    profilePictureUrl?: string | null,
  ) {
    this.token = token;
    this.user = {
      _id: userId,
      username,
      email,
      bio,
      profilePictureUrl,
    };
  }
}
