import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PersonAdd from '@mui/icons-material/PersonAdd';

function UserDetails({author_id,username,email,followers_count}) {
  
  const [connObj,setConnObj] = useState(null);
  const [isConnectedToAuthor,setIsConnectedToAuthor] = useState(false);
  const [isRequestPending,setIsPendingRequest] = useState(false);
  const user = useSelector(state => state.users.user);
  axios.defaults.withCredentials = true;
  const socket = useSelector(state => state.users.user.socket);

  useEffect(()=>{

    if(user.user_id){
      console.log(author_id);
      checkUserConnectionRequest();
    }
     
  },[])

  const checkUserConnectionRequest = async()=>{
    const url = `http://localhost:3000/conn-request/check-connection?userId=${user.user_id}&authorId=${author_id}`
    const response = (await axios.get(url)).data.conn_info;
    console.log(response);
    if(response){
      setIsConnectedToAuthor(true);
      setConnObj({...response});
    }
    else{
       checkForPendingRequest();
    }
  }

  const checkForPendingRequest = async()=>{
     
    const url = `http://localhost:3000/conn-request/check-pending-request?senderId=${user.user_id}&receiverId=${author_id}`
    const isPending = (await axios.get(url)).data.success;
    if(isPending){
      setIsPendingRequest(true);
    }
  }

  const addConnectionRequest = async()=>{

    if(!user.username){
      setLoginMessage("To send connection request you need to login!!");
      setOpen(true);
      return;
    }
        
    const url = "http://localhost:3000/conn-request/add-request";
    const data = {
      sender: user.user_id,
      receiver: author_id
    }

    try {
      await axios.post(url,data);
      setConnMessage("Connection request sent successfully!!");
      setCopyModalOpen(true);
      socket.emit('addConnectionRequest',data);
      setIsPendingRequest(true);
    } catch (error) {
      setIsPendingRequest(true);
    }
  }

  return (
   <section className='w-[35%] p-8'>
    <div>
      <Avatar sx={{width:70,height:70,marginBottom:2}}/>
      <h3 className='p-1 text[28px] font-bold font-poppins'>{username}</h3>
      <p className='p-1 text-[14px] font-poppins mb-2'>{followers_count} followers</p>
      <p className='p-1 underline'>{email}</p>
      {
        isConnectedToAuthor?(
        <>
        <Link to={`http://localhost:5173/chat/${connObj.firebaseId}`}><ChatIcon fontSize='medium' className='m-2 text-reddish-orange'/></Link>
        <span className='text-[13px] font-poppins font-medium'>Message</span>
        </>
        ):(
          <>
          {
            isRequestPending === false?(
              <button className='px-5 py-1 my-2 bg-reddish-orange text-white font-poppins rounded-lg'
               onClick={addConnectionRequest}>Connect <PersonAdd/></button>
            ):(
              <button className='px-5 py-1 my-2 bg-reddish-orange text-white font-poppins rounded-lg'>pending</button>
            )
          }
          </>
        ) 
      }
    </div>
  </section>
  )
}

export default UserDetails