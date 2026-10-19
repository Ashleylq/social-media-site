import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router"
import App from './App.jsx'
import "./index.css"
import Signup from './pages/auth/Signup.jsx'
import Login from './pages/auth/Login.jsx'
import Profile from './pages/profile/Profile.jsx'
import EditProfile from './pages/profile/EditProfile.jsx'

const Router = createBrowserRouter([{
  path : "/",
  element : <App/>,
  children : [
    {
      element : <Profile/>,
      index : true
    },{
      element : <Signup/>,
      path : "signup"
    },{
      element : <Login/>,
      path : "login"
    },{
      element : <EditProfile/>,
      path : "profile/edit"
    }
  ]
}])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={Router} />
)
