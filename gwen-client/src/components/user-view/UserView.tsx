import UserProfilePic from '../user-profile-pic/UserProfilePic';

import Spinner from '../spinner/Spinner';
import { useGetUser } from 'gwen-generated-api';

export type UserViewProps = {
  userId: string;
};

const UserView = ({ userId }: UserViewProps) => {
  const { data: user, isLoading } = useGetUser(userId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <UserProfilePic userId={userId} />
      {user?.username ?? 'Unknown User'}
    </div>
  );
};

export default UserView;
