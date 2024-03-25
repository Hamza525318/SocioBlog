import React, { useEffect, useState } from 'react'
import ChatSection from './ChatSection'
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import LoginAlertMessage from "../alertMessages/LoginAlertMessage"
import { addUser,addSocketConnection } from '../../features/user/userSlice'
import {registerSocketEvent} from "../socketEvents"
import io from 'socket.io-client'

function MainChat() {
  
  const user = useSelector(state => state.users.user);
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
  const username = useSelector(state => state.users.user.username);
  let socket = useSelector(state => state.users.user.socket);
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  const [open,setOpen] = useState(false);
 
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
        user.user_id?(
          <section>
          <ChatSection/>
         </section> 
        ):(
          <LoginAlertMessage 
            open={true} setOpen={setOpen} 
            message={"To start chatting you need to Sign In!!"} 
            pageName={"ChatSection"}
          />
        )
      }
    </>
  )
}

export default MainChat