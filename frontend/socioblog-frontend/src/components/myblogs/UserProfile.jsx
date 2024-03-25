import React from 'react'
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';

function UserProfile({username}) {
  return (
    <div className='p-8'>
        <Avatar sx={{width: 70,height:70}}/>
        <h3 className='font-bold text-lg my-5'>{username}</h3>
        <Link className='text-sm  text-green-700'>Edit profile</Link>
    </div>
  )
}

export default UserProfile