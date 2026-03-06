import {createBrowserRouter} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import LogoutPage from './pages/LogoutPage'
import SignInPage from './pages/SignInPage'
import ProfilePage from './pages/ProfilePage'
import GamePage from './pages/GamePage'
import MatchmakingPage from './pages/MatchmakingPage'
import HomePage from './pages/HomePage'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage/>,
    },
    {
        path: '/home',
        element: <HomePage/>,
    },
    {
        path: '/login',
        element: <LoginPage/>,
    },
    {
        path: '/logout',
        element: <LogoutPage/>,
    },
    {
        path: '/sign-in',
        element: <SignInPage/>,
    },
    {
        path: '/profile/:userId',
        element: <ProfilePage/>,
    },
    {
        path: '/play/:gameId',
        element: <GamePage/>,
    },
    {
        path: '/play',
        element: <MatchmakingPage/>,
    },
])

