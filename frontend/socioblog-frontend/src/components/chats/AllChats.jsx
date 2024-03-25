import React, { useEffect, useState } from 'react'
import SingleChat from './SingleChat'
import { useLocation,useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import db from '../../firebase';
import {doc,onSnapshot} from 'firebase/firestore'

function AllChats() {
  
  const{chatId} = useParams();
  const user = useSelector(state => state.users.user);
  const [messages,setMessages] = useState([]);

  useEffect(()=>{
   
   console.log("I fetched chats")
   const unsubscribe = onSnapshot(doc(db,"chats",chatId),(doc)=>{
     const chats = doc.data().messages;
     console.log(chats);
     setMessages([...messages,...chats]);
   }) 

   return () => unsubscribe();

  },[user.username])

  return (
    <section className='w-[650px] mt-3 mx-auto h-[470px] overflow-auto'>
     {
        messages.map((msg)=>{
          return (<SingleChat messageObj={msg}/>)
        })
     }
    </section>
  )
}

export default AllChats