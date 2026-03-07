import UserProfilePic from '../user-profile-pic/UserProfilePic';

export type UserViewProps = {
  userId: string;
  nickname: string;
};

const UserView = ({ userId, nickname }: UserViewProps) => {
  return (
    <div>
      <UserProfilePic userId={userId} />
      {nickname}
    </div>
  );
};

export default UserView;
