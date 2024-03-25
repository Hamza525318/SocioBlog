import React,{useState} from 'react'
import PendingRequests from './PendingRequests'
import { useSelector } from 'react-redux'
import LoginAlertMessage from "../alertMessages/LoginAlertMessage"
import Navbar from "../Navbar"

function Main() {
  
  const[open,setOpen] = useState(false);
  const user = useSelector(state=> state.users.user);

  return (
    <>
      {
        user.user_id?(
          <section className='h-screen w-screen bg-gray-100'>
          <Navbar />
          <PendingRequests/>
         </section>
        ):(
          <LoginAlertMessage 
          open={true} setOpen={setOpen} 
          message={"To view your connections you need to Sign In!!"} 
          pageName={"Connections"}
        />
        )
      }
    </>
   
  )
}

export default Main