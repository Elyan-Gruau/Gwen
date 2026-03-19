import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login-page/LoginPage';
import LogoutPage from './pages/logout-page/LogoutPage';
import SignInPage from './pages/sign-in-page/SignInPage';
import ProfilePage from './pages/profile-page/ProfilePage';
import GamePage from './pages/game-page/GamePage';
import MatchmakingPage from './pages/matchmaking-page/MatchmakingPage';
import HomePage from './pages/home-page/HomePage';
import StatusPage from './pages/status-page/StatusPage';
import DeckBuilder from './components/deck-builder/deck-builder/DeckBuilder';
import ProfileMePage from './pages/profile-page/ProfileMePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { ROUTES } from './constants/routes';

function LoginRequiredPage() {
  const { isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PLAY} replace />;
  }

  return (
    <div>
      <h1>Login required</h1>
      <p>You must be logged in to play.</p>
      <button type="button" onClick={() => (window.location.href = ROUTES.LOGIN)}>
        Go to login
      </button>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.HOME_ALT, element: <HomePage /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.LOGOUT, element: <LogoutPage /> },
  { path: ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: ROUTES.STATUS, element: <StatusPage /> },
  { path: ROUTES.PROFILE, element: <ProfilePage /> },
  { path: ROUTES.PROFILE_ME, element: <ProfileMePage /> },
  { path: ROUTES.PLAY_GAME, element: <LoginRequiredPage /> },
  { path: ROUTES.PLAY, element: <LoginRequiredPage /> },
  { path: ROUTES.DECK_BUILDER, element: <DeckBuilder /> },
  {
    path: ROUTES.PROFILE,
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PROFILE_ME,
    element: (
      <ProtectedRoute>
        <ProfileMePage />
      </ProtectedRoute>
    ),
  },
  // The actual playable routes, only accessible when authenticated
  {
    path: ROUTES.PLAY_GAME,
    element: (
      <ProtectedRoute>
        <GamePage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.PLAY,
    element: (
      <ProtectedRoute>
        <MatchmakingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.DECK_BUILDER,
    element: (
      <ProtectedRoute>
        <DeckBuilder />
      </ProtectedRoute>
    ),
  },
]);
