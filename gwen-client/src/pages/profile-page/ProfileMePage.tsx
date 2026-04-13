import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';
import { useGetCurrentUser } from 'gwen-generated-api';
import Spinner from '../../components/spinner/Spinner';

const ProfileMePage = () => {
  const { user } = useAuthContext();
  if (!user) {
    return <UserNotLoggedInProfile />;
  }

  return <UserProfile userId={user.id!} />;
};

const UserNotLoggedInProfile = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>My Profile</h1>
      <p>No user is currently logged in.</p>
      <button type="button" onClick={() => navigate(ROUTES.LOGIN)}>
        Go to login
      </button>
    </div>
  );
};

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const { data: currentUser, isLoading } = useGetCurrentUser();

  if (isLoading) {
    return <Spinner />;
  }

  if (!currentUser) {
    return <div> Current user not found.</div>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>
        <strong>ID:</strong> {currentUser.id}
      </p>
      <p>
        <strong>Username:</strong> {currentUser.username}
      </p>
      <p>
        <strong>Email:</strong> {currentUser.email}
      </p>
      <p>
        <strong>Bio:</strong> {currentUser.bio || 'No bio'}
      </p>
      <p>
        <strong>Elo:</strong> {currentUser.elo}
      </p>
      <p>
        <strong>Favorite Deck:</strong>{' '}
        {currentUser.favorite_deck ? currentUser.favorite_deck : 'Not set'}
      </p>
      <p>
        <em>You can set your favorite deck from the deck builder.</em>
      </p>
    </div>
  );
};

export default ProfileMePage;
