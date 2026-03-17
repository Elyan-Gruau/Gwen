import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div>
      <h1>Profile</h1>
      <p>Profile page — /profile/{userId}</p>
    </div>
  );
};

export default ProfilePage;
