import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import SingleBlog from './components/singleblog/SingleBlog.jsx'
import WriteBlog from './components/newblogpost/WriteBlog.jsx'
import SignUp from './components/SignUp.jsx'
import Notifications from './components/likeposts/Notifications.jsx'
import Login from './components/Login.jsx'
import {Provider} from "react-redux"
import {store} from "./store.js"
import MyBlogs from './components/myblogs/MyBlogs.jsx'
import PageNotFound from './components/pagenotfound/PageNotFound.jsx'
import FavPage from './components/favtopics/FavPage.jsx'
import NoBlogs from './components/myblogs/NoBlogs.jsx'
import Main from './components/user_connections/Main.jsx'
import MainChat from './components/chats/MainChat.jsx'
import ResetMain from './components/forgotpassword/ResetMain.jsx'
import AddNewPassword from './components/forgotpassword/AddNewPassword.jsx'
import MainUserProfile from './components/userprofile/MainUserProfile.jsx'
import SearchResult from './components/search_results/SearchResult.jsx'


const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
  },
  {
    path:"/write-a-blog",
    element: <WriteBlog/>
  },
  {
    path:"/user/signup",
    element: <SignUp/>
  },
  {
    path:"/user/login",
    element: <Login/>
  },
  {
    path:'/single-blog/',
    element: <SingleBlog/>
  },
  {
    path:"/myblogs",
    element:<MyBlogs/>
  },
  {
      path: "/getting-started/topics",
      element: <FavPage/>
  },
  {
     path: "/like-notifications",
     element: <Notifications/>
  },
  {
    path: "/my-people",
    element: <Main/>
  },
  {
    path: "/chat/:chatId/:username",
    element: <MainChat/>
  },
  {
    path: '*',
    element: <PageNotFound/>
  },
  {
    path: '/reset-password',
    element: <ResetMain/>
  },
  {
     path: '/reset-password/token/:passToken',
     element: <AddNewPassword/>
  },
  {
    path: '/user/fetch-details/:userInfo',
    element: <MainUserProfile/>
  },
  {
    path: '/search/:topic',
    element: <SearchResult/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
)
