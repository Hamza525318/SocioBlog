import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';

function SingleLike({username,title}) {
  return (
    <div className='w-screen bg-white p-5 flex items-center'>
        <CircleIcon fontSize='small' className='text-reddish-orange'/>
        <p className='ml-3'><span className='font-md font-poppins'>{username} </span> 
           has liked your blog post named: 
           <span className='font-semibold font-poppins'> {title}
           </span>
        </p>
    </div>
  )
}

export default SingleLike