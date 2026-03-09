import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SignInPage from './pages/SignInPage';
import ProfilePage from './pages/ProfilePage';
import GamePage from './pages/GamePage';
import MatchmakingPage from './pages/MatchmakingPage';
import HomePage from './pages/HomePage';
import DeckBuilder from './components/deck-builder/DeckBuilder';
import { ROUTES } from './constants/routes';

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <HomePage /> },
  { path: ROUTES.HOME_ALT, element: <HomePage /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.LOGOUT, element: <LogoutPage /> },
  { path: ROUTES.SIGN_IN, element: <SignInPage /> },
  { path: ROUTES.PROFILE, element: <ProfilePage /> },
  { path: ROUTES.PLAY_GAME, element: <GamePage /> },
  { path: ROUTES.PLAY, element: <MatchmakingPage /> },
  { path: ROUTES.DECK_BUILDER, element: <DeckBuilder /> },
]);
