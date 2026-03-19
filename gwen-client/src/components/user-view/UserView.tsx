import UserProfilePic from '../user-profile-pic/UserProfilePic';
import { useGetUser } from '../../hooks/apis/UserAPI';
import Spinner from '../spinner/Spinner';

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
