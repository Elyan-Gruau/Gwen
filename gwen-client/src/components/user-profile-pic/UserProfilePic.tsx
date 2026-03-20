import Spinner from '../spinner/Spinner';
import { useGetUser } from 'gwen-generated-api';

export type UserProfilePicProps = {
  userId: string;
};

const UserProfilePic = ({ userId }: UserProfilePicProps) => {
  const { data: user, isLoading, isError } = useGetUser(userId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !user) {
    return <div>Error loading user</div>;
  }

  const url = user.profilePictureUrl ?? ''; // TODO add default
  return (
    <div>
      <img draggable={false} src={url} alt={`${user.username}-profile-picture`} />
    </div>
  );
};

export default UserProfilePic;
