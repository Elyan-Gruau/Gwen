import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants/routes';

const ProfileMePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div>
        <h1>My Profile</h1>
        <p>No user is currently logged in.</p>
        <button type="button" onClick={() => navigate(ROUTES.LOGIN)}>
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>
        <strong>ID:</strong> {user._id}
      </p>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Elo:</strong> {user.elo}
      </p>
    </div>
  );
};

export default ProfileMePage;


