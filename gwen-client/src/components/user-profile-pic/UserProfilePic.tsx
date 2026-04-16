import Spinner from '../spinner/Spinner';
import { useGetUser } from 'gwen-generated-api';
import { getProfilePictureUrl } from '../../utils/URLProvider';
import styles from './UserProfilePic.module.scss';

export type UserProfilePicSize = 'small' | 'medium' | 'large';

export type UserProfilePicProps = {
  userId: string;
  size?: UserProfilePicSize;
};

const sizeClassMap: Record<UserProfilePicSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
};

const UserProfilePic = ({ userId, size = 'medium' }: UserProfilePicProps) => {
  const { data: user, isLoading, isError } = useGetUser(userId);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !user) {
    return <div>Error loading user</div>;
  }

  const url = user.profilePictureUrl ?? getProfilePictureUrl();
  return (
    <div className={`${styles.wrapper} ${sizeClassMap[size]}`}>
      <img
        className={styles.image}
        draggable={false}
        src={url}
        alt={`${user.username}-profile-picture`}
      />
    </div>
  );
};

export default UserProfilePic;
