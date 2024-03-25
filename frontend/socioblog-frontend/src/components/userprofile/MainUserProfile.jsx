import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import io from 'socket.io-client'
import { useParams } from 'react-router-dom';
import { addUser,addSocketConnection } from '../../features/user/userSlice';
import { registerSocketEvent } from '../socketEvents';
import Navbar from '../Navbar';
import UserBlogs from './UserBlogs';
import UserDetails from './UserDetails';
import axios from 'axios';

function MainUserProfile() {
   
  const{userInfo} = useParams();
  const[userProfile,setUserProfile] = useState(null);
  axios.defaults.withCredentials = true;
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
  let socket = useSelector(state => state.users.user.socket);
  const dispatch = useDispatch();
 
  
  useEffect(()=>{

    const token = document.cookie.split(";").find(row => (row.startsWith("token") || row.startsWith(" token")));
    if(!firstVisitVerify && token){
      verifyUserOnFirstVisit();
    }
    fetchUserDetails();
  },[])

  const fetchUserDetails = async()=>{
      
    const url = `http://localhost:3000/user/fetch-details?username=${userInfo}`
    try {

      const data = (await axios.get(url)).data;
      setUserProfile({...data.user});
      console.log(data);
    } catch (error) {
        alert(error);
        return;
    }
      
  }

  const verifyUserOnFirstVisit = async()=>{
    try {
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


  return (
    <section className='w-screen h-screen'>
     <Navbar/>
     { userProfile !== null &&
     <section className='w-full flex m-5'>
        <UserBlogs userBlogs={userProfile.user_blogs} username={userProfile.username}/>
      <UserDetails 
      author_id = {userProfile.user_id}
      username={userProfile.username} 
      email={userProfile.user_email} 
      followers_count={userProfile.total_connections}
      />
     </section>
    }
    </section>
  )
}

export default MainUserProfile