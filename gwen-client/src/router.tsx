import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/login-page/LoginPage';
import LogoutPage from './pages/logout-page/LogoutPage';
import SignInPage from './pages/sign-in-page/SignInPage';
import ProfilePage from './pages/profile-page/ProfilePage';
import GamePage from './pages/game-page/GamePage';
import MatchmakingPage from './pages/matchmaking-page/MatchmakingPage';
import DeckSelectionPage from './pages/deck-selection-page/DeckSelectionPage';
import HomePage from './pages/home-page/HomePage';
import StatusPage from './pages/status-page/StatusPage';
import DeckBuilder from './components/deck-builder/deck-builder/DeckBuilder';
import ProfileMePage from './pages/profile-page/ProfileMePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NavbarLayout from './components/layouts/navbar-layout/NavbarLayout';
import { ROUTES } from './constants/routes';

export const router = createBrowserRouter([
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.LOGOUT, element: <LogoutPage /> },
  { path: ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: ROUTES.STATUS, element: <StatusPage /> },
  {
    path: '/',
    element: <NavbarLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.HOME_ALT, element: <HomePage /> },
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
      {
        path: ROUTES.PLAY,
        element: (
          <ProtectedRoute>
            <DeckSelectionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.MATCHMAKING,
        element: (
          <ProtectedRoute>
            <MatchmakingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.GAME,
        element: <GamePage />,
      },
      {
        path: ROUTES.DECK_BUILDER,
        element: <DeckBuilder />,
      },
    ],
  },
]);
