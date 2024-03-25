import React from 'react'
import { Link } from 'react-router-dom'

function SingleCategory({iconName,title}) {
  return (
    <div className='flex items-center w-full p-3 border-b border-white'>
        <Link to={`?category=${title}`} className='flex items-center'>
        {iconName}
        <h5 className='text-white font-medium text-base mx-1'>{title}</h5>
        </Link>
    </div>
  )
}

export default SingleCategory