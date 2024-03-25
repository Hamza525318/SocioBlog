import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SingleAlertMessage from '../alertMessages/SingleAlertMessage';
import SingleLike from './SingleLike';
import { updateReadNotifications, updateUnreadtoReadnots } from '../../features/user/userSlice';
import axios from 'axios';

function LikeNotifications() {

    const read_notifications = useSelector(state => state.users.user.read_notifications);
    const unread_notifications = useSelector(state => state.users.user.unread_notifications);
    const [isNotificationsPresent,setIsNotificationPresent] = useState(false);
    const user = useSelector(state=> state.users.user);
    const[open,setOpen] = useState(false);
    const[message,setMessage] = useState("");
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();

   useEffect(()=>{
    
    if(user.user_id){
      fetchReadNotifications();
    }
    updateUnreadtoReadNotifications();

      return ()=>{
          if(unread_notifications.length > 0){
            updateUnreadNotificationsinDB();
          }
      }
   },[])
     
    const updateUnreadtoReadNotifications = ()=>{
      if(unread_notifications.length > 0){
          dispatch(updateUnreadtoReadnots());
      }
    }

    const updateUnreadNotificationsinDB = async()=>{
        console.log("function fired");
        const url = `http://localhost:3000/user/update-notifications?userId=${user.user_id}`;
         try {
          await axios.put(url)
        } catch (error) {
          console.log(error);
        }
    }

    const fetchReadNotifications = async()=>{
        const url =  `http://localhost:3000/user/fetch-read-notifications?user_id=${user.user_id}`
        try {
          const read_notifications = (await axios.get(url)).data.read_notifications;
          dispatch(updateReadNotifications({"read_notifications": read_notifications}));
          if(read_notifications.length == 0 && unread_notifications.length == 0){
            setIsNotificationPresent(true);
          }
        } catch (error) {
          setMessage(error.message);
          setOpen(true);
          return;
        }
    }

  return (
    <>
    {
      isNotificationsPresent === true?(
      <div className='w-screen h-screen bg-white'>
          <h2 className='text-center font-poppins text-lg font-bold mt-[15%]'>You have no new notifications at the moment! Enjoy your uninterrupted time</h2>
      </div>
      ):(
        <div className='w-screen h-screen bg-gray-200'>

        {
          unread_notifications.length >0 &&  unread_notifications.map((ele,i)=>{
                return(
                 <div key={i}>
                <SingleLike username={ele.username} title={ele.title}/>
                </div>
                )
            })
        }
        {
          read_notifications.length >0 &&  read_notifications.map((ele,i)=>{
                return(
                <div key={i}>
                <SingleLike username={ele.username} title={ele.title}/>
                </div>
                )
            })
        }
 
        </div>
      )
      
    }
  {
    open === true && <SingleAlertMessage open={open} setOpen={open} message={message}/>
  }
  </>
  )
}

export default LikeNotifications