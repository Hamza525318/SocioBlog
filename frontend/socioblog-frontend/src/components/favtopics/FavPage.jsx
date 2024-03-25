import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../loadingpage/Loading'
import FavHeader from './FavHeader'
import {useSelector,useDispatch} from 'react-redux'
import io from 'socket.io-client'
import {registerSocketEvent} from "../socketEvents"
import { addUser,addSocketConnection } from '../../features/user/userSlice'
import LoginAlertMessage from "../alertMessages/LoginAlertMessage"
import FavTopics from './FavTopics'

function FavPage() {
  
const firstVisitVerify = useSelector(state => state.users.user.verifyUser);  
let socket = useSelector(state => state.users.user.socket);
const user = useSelector(state => state.users.user);
const dispatch = useDispatch();
const [open,setOpen] = useState(false);
const[loading,setLoading] = useState(true);
axios.defaults.withCredentials = true;

  useEffect(()=>{
    const token = document.cookie.split(";").find(row => row.startsWith("token"));
    if(!token){
      setOpen(true);
      return;
    }
     
    if(!firstVisitVerify && token){
        verifyUserOnFirstVisit();
    }
    else{
      setLoading(false);
    }

  },[])

  const verifyUserOnFirstVisit = async()=>{
    try {
        const url = "http://localhost:3000/user/first-visit-verify";
        const user = (await axios.get(url)).data.user;
        // if(!user){
        //   handleClickOpen();
        // }
        dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics}));
        setLoading(false);
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
    <section className='w-screen m-0 p-0'>
      {
        loading === true?(
          <Loading/>
        ):(
          <>
          <FavHeader/>
          <FavTopics/>
          </>
        )
      }
      {
        open === true && <LoginAlertMessage open={open} setOpen={setOpen} message={"Login or Signup to choose your favourite topics"} pageName={"favTopics"}/>
      }
    </section>
  )
}

export default FavPage