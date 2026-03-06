import {createBrowserRouter} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import LogoutPage from './pages/LogoutPage'
import SignInPage from './pages/SignInPage'
import ProfilePage from './pages/ProfilePage'

export const router = createBrowserRouter([
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
])

