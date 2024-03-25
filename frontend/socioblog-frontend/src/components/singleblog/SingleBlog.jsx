import React,{useEffect,useState} from 'react'
import Navbar from '../Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import io from 'socket.io-client'
import { addUser,addSocketConnection } from '../../features/user/userSlice'
import {registerSocketEvent} from '../socketEvents'
import { useSelector,useDispatch } from 'react-redux'
import SingleBlogDetails from './SingleBlogDetails'

function SingleBlog() {

  //returns the current location object;
  const location = useLocation();
  axios.defaults.withCredentials = true;
  console.log(location);
  const user = useSelector(state => state.users.user.username);
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
  let socket = useSelector(state => state.users.user.socket);
  const dispatch = useDispatch();
 
  //a url search string beginning with a ?
  const searchParams = new URLSearchParams(location.search)
  const blog_id = searchParams.get("blog_id");

  useEffect(()=>{

    // if(firstVisitVerify && Object.keys(socket).length == 0){
    //   socket = io.connect(`http://localhost:3000?userId=${userObj.user_id}&username=${userObj.username}`);
    //   dispatch(addSocketConnection({"socket": socket}));
    //   registerSocketEvent();
    // }
      
    const token = document.cookie.split(";").find(row => (row.startsWith("token") || row.startsWith(" token")));
    if(!firstVisitVerify && token){
      verifyUserOnFirstVisit();
    }

  },[user])

  const verifyUserOnFirstVisit = async()=>{
    try {
         console.log("verify user on first visit");
         const url = "http://localhost:3000/user/first-visit-verify";
         const user = (await axios.get(url)).data.user
         dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics}));
         if(user.username && Object.keys(socket).length == 0){
         socket = io.connect(`http://localhost:3000?userId=${user._id.toString()}&username=${user.username}`);
         dispatch(addSocketConnection({"socket": socket}));
         registerSocketEvent(socket,dispatch);
        }
        
    } catch (error) {
         alert(error);
         return;
    }
  }

  // const registerSocketEvent = ()=>{
  //   console.log("register event");
  //   socket.on('likedPost',({username,title})=>{
  //     console.log("likePost event");
  //     dispatch(incrementRealTimeLike());
  //     dispatch(addNewRealtimeLike({"username":username,"title":title}));
  //   })

  //   socket.on("unreadNotifications",({read,unread,count})=>{
  //     console.log("unreadnotifications event");
  //     console.log(read);
  //     console.log(unread);
  //     dispatch(addNotifications({"read_notifications":read,"unread_notifications":unread,"unread_likes_count":count}));
  //   })
  // }


  return ( 
    <div className='w-screen overflow-auto'>
        <Navbar/>
        <SingleBlogDetails/>
    </div>
  )
}

export default SingleBlog