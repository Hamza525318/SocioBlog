import { Avatar } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function SingleUser({user_id,username}) {
  return (
    <div className='w-full'>
    <div className='w-full flex items-center p-6'>
       <Avatar alt={`${username.charAt(0)}`}/>
       <div className='ml-3'>
          <Link to={`/user/fetch-details/${username}`}><h3 className='font-bold font-poppins text-[18px]'>{username}</h3></Link>
          {/* <p className='text-[14px] font-poppins mt-1'>frontEnd Developer at Meta</p> */}
       </div>
    </div>
    <div className='w-full h-[1px] bg-gray-300'></div>
    </div>
  )
}

export default SingleUser