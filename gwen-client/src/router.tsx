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
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ROUTES } from './constants/routes';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.HOME_ALT, element: <HomePage /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.LOGOUT, element: <LogoutPage /> },
  { path: ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: ROUTES.STATUS, element: <StatusPage /> },
  { path: ROUTES.PROFILE, element: <ProfilePage /> },
  { path: ROUTES.PLAY_GAME, element: <GamePage /> },
  { path: ROUTES.PLAY, element: <MatchmakingPage /> },
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
