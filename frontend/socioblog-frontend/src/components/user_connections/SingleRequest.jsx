import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addAcceptedConnectionRequest } from '../../features/user/userSlice';

function SingleRequest({conn_id,username,index}) {
 
  axios.defaults.withCredentials = true;
  const user = useSelector(state => state.users.user);
  const pending_requests = useSelector(state=>state.users.user.pending_requests);
  const accepted_requests = useSelector(state => state.users.user.accepted_requests);
  const socket = useSelector(state => state.users.user.socket);
  const dispatch = useDispatch();

  const acceptConnectionRequest = async(conn_id)=>{
    const url =  `http://localhost:3000/conn-request/accept-request?connection_id=${conn_id}`;
     
    try {
      
      const acceptedObj = (await axios.put(url)).data.connObj
      dispatch(addAcceptedConnectionRequest({connObj:acceptedObj,index:index}));
      socket.emit("acceptedConnectionRequest",{
      "sender_id": acceptedObj.user_id,
      "username":user.username,
      "user_id":user.user_id,
      "firebaseId":acceptedObj.firebaseId
      })

    } catch (error) {
      alert(error)
      return;
    }
  }

  return (
    <div className='w-screen bg-white p-5 flex items-center justify-between'>
        <div className='flex items-center'>
        <CircleIcon fontSize='small' className='text-reddish-orange'/>
        <p className='ml-3'><span className='font-md font-poppins'>{username} </span> 
           has requested to connect with you
        </p>
        </div>

        <div>
            <button className='bg-reddish-orange px-5 rounded-lg py-1 text-white mr-16' 
            onClick={()=>acceptConnectionRequest(conn_id)}>
            accept
          </button>
        </div>
    </div>
  )
}

export default SingleRequest