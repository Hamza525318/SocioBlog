import React from 'react'
import ChatHeader from './ChatHeader'
import ChatFooter from './ChatFooter'
import AllChats from './AllChats'
import { useSelector } from 'react-redux'
import "./chatBg.css"

function ChatSection() {
  
  const bgChatImg = useSelector(state=> state.users.user.bgImage_chat)
  
  return (
    <>
     {
       bgChatImg?(
        <section className={'h-screen w-screen bg-no-repeat bg-center bg-cover'} style={{backgroundImage: `url(${bgChatImg})`}}>
      <ChatHeader/>
      <AllChats/>
      <ChatFooter/>
      </section>
       ):(
        <section className='h-screen w-screen bg-chat'>
          <ChatHeader/>
          <AllChats/>
          <ChatFooter/>
        </section>
       )
     }
    
    </>
  )
}

export default ChatSection