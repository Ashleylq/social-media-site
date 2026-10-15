import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router"
import App from './App.jsx'
import "./index.css"
import Signup from './pages/auth/Signup.jsx'
import Login from './pages/auth/Login.jsx'

const Router = createBrowserRouter([{
  path : "/",
  element : <App/>,
  children : [
    {
      element : <Signup/>,
      path : "signup"
    },{
      element : <Login/>,
      path : "login"
    }
  ]
}])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
