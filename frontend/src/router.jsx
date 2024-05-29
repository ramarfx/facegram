import { createBrowserRouter } from "react-router-dom"
import App from "./App"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Home from "./pages/Home"
import Post from "./pages/Post"

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/post',
                element: <Post />
            }
        ]
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/login',
        element: <Login />
    }
])