import UserProfilePic from '../user-profile-pic/UserProfilePic';

const UserView = () => {
  const userId = 'toot';
  const nickname = 'TOTO';
  return (
    <div>
      <UserProfilePic userId={userId} />
      {nickname}
    </div>
  );
};

export default UserView;
