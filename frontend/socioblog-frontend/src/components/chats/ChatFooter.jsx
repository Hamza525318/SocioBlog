import React,{useState} from 'react'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { useParams } from 'react-router-dom';
import db from '../../firebase';
import './chatBg.css'
import { useSelector } from 'react-redux';
import {doc,updateDoc,arrayUnion} from 'firebase/firestore'

function ChatFooter() {
  
  const [message,setMessage] = useState("");
  const user = useSelector(state=> state.users.user);
  const {chatId} = useParams();

  const sendMessage = async(e)=>{
      e.preventDefault();
      const messageObj = {
        userId: user.user_id,
        username: user.username,
        content: message,
        timestamp: Date.now(),
      }
      
     const chatDoc = doc(db,"chats",chatId);
     await updateDoc(chatDoc,{
      "messages": arrayUnion(messageObj)
     })
     .then(()=>{
        setMessage("");
     })
     .catch((err)=>alert(err.message));
  }
  
  return (
    <div className='fixed bottom-3 left-[25%] w-[600px] h-12 bg-slate-100 shadow-md flex items-center rounded-md'>
        <textarea value={message} 
        onChange={(e)=>setMessage(e.target.value)} 
        rows="4"cols="30" type='text' 
        className='h-10 w-[560px] bg-slate-100 outline-none chat-message'
        />
        <PlayCircleFilledIcon 
        onClick={sendMessage} 
        fontSize='large' 
        className='text-reddish-orange mx-2 cursor-pointer'/>
    </div>
  )
}

export default ChatFooter