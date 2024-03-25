import React,{useState,useEffect} from 'react'
import Navbar from '../Navbar'
import LikeNotifications from './LikeNotifications'
import { useSelector } from 'react-redux'
import LoginAlertMessage from "../alertMessages/LoginAlertMessage"
import axios from "axios"
import {registerSocketEvent} from "../socketEvents"
import { addUser,addSocketConnection } from '../../features/user/userSlice'
import { useDispatch } from 'react-redux'
import io from 'socket.io-client'

function Notifications() {
   
  axios.defaults.withCredentials = true;
  const user = useSelector(state=> state.users.user);
  const read_notifications = useSelector(state => state.users.user.read_notifications);
  const unread_notifications = useSelector(state => state.users.user.unread_notifications);
  let socket = useSelector(state => state.users.user.socket);
  const username = useSelector(state => state.users.user.username);
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);  
  const[open,setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(()=>{
    const token = document.cookie.split(";").find(row => row.startsWith("token"));
    if(!firstVisitVerify && token){
      verifyUserOnFirstVisit();
    }

  },[username])

  const verifyUserOnFirstVisit = async()=>{
    try {
        const url = "http://localhost:3000/user/first-visit-verify";
        console.log("sent url");
        const user = (await axios.get(url)).data.user;
        if(!user){
          setOpen(true);
        }
        dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics,"chatBgImage":user.userChatBg}));
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

  return (
    <>
    {
      user.user_id.length > 0?(
      
      <div className='w-screen'>
        <Navbar/>
        <LikeNotifications/>
      </div>

      ):(
        <div className='w-screen h-screen bg-slate-200'>
        <LoginAlertMessage open={true} 
          setOpen={setOpen} 
          message={"Sign In to view your notifications"} 
          pageName={"likeNotifications"}
        />
        </div>
      )  
    }
   
    </>
  )
}

export default Notifications