import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router"
import App from './App.jsx'
import Signup from './pages/auth/Signup.jsx'
import Login from './pages/auth/Login.jsx'
import Profile from './pages/profile/Profile.jsx'
import EditProfile from './pages/profile/EditProfile.jsx'
import loadProfile from './loaders/profile/profileLoader.jsx'
import editProfile from './actions/profile/editProfileAction.jsx'
import signup from './actions/auth/signupAction.jsx'
import loginAction from './actions/auth/loginAction.jsx'
import SearchProfile from './pages/profile/SearchProfile.jsx'
import searchProfile from './loaders/profile/searchProfileLoader.jsx'
import follow from './actions/profile/followAction.jsx'
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.jsx'
import Posts from './pages/posts/Posts.jsx'
import CreatePost from './pages/posts/CreatePost.jsx'
import createPost from './actions/posts/createPost.jsx'
import GlobalPosts from './pages/posts/GlobalPosts.jsx'
import loadPosts from './loaders/posts/postLoader.jsx'

const Router = createBrowserRouter([{
  path : "/",
  element : <App/>,
  errorElement : <ErrorBoundary/>,
  children : [
    {
      element : <Profile/>,
      index : true,
      loader : loadProfile
    },{
      element : <Signup/>,
      path : "signup",
      action : signup
    },{
      element : <Login/>,
      path : "login",
      action : loginAction
    },{
      element : <EditProfile/>,
      path : "profile/edit",
      loader : loadProfile,
      action : editProfile
    }, {
      element : <SearchProfile/>,
      path : "profile/search",
      loader : searchProfile
    }, {
      element : <Profile/>,
      path : "profile/:id",
      loader : loadProfile,
      action : follow
    }, {
      element : <Posts/>,
      path : "posts/",
      children : [
        {
          element : <GlobalPosts/>,
          index : true,
          loader : loadPosts
        },{
          element : <CreatePost/>,
          path : "create",
          action : createPost
        }
      ]
    }, {
      path : "*",
      element : <ErrorBoundary/>,
      loader : () => { throw new Response("Page doesn't exist", {status : 404}) }
    }
  ]
}])
createRoot(document.getElementById('root')).render(
  <RouterProvider router={Router} />
)
