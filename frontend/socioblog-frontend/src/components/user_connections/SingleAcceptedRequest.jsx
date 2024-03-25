import React from 'react'
import MessageIcon from '@mui/icons-material/Message';
import CircleIcon from '@mui/icons-material/Circle'
import { Link } from 'react-router-dom';

function SingleAcceptedRequest({username,user_id,firebaseId}) {
  return (
    <div className='w-screen bg-white p-5 flex items-center justify-between'>
    <div className='flex items-center'>
    <CircleIcon fontSize='small' className='text-reddish-orange'/>
    <p className='ml-3'><span className='font-md font-poppins'>{username} </span> 
    </p>
    </div>

    <div>
        <Link to={`/chat/${firebaseId}/${username}`}><MessageIcon className='text-reddish-orange'/></Link>
    </div>
    </div>
  )
}

export default SingleAcceptedRequest