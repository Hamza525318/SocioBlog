import React from 'react'
import { Link } from 'react-router-dom';
const month = ["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"]

function SingleSideBlog({blog_id,title,image,createdAt}) {
 
  const date = new Date(Number(createdAt));

  return (
    <div className='w-[300px] flex justify-around items-center'>
        <div className='w-[25%]'>
           <img src={image?image:"./dummyBg.png"} className='w-full'/>
        </div>

        <div className='w-[60%]'>
            <h4 className='font-poppins font-semibold text-[16px]'><Link to={`/single-blog/?blog_id=${blog_id}`}>
             {title}
            </Link></h4>
            <p className='text-[12px] text-gray-600'>{date.getDate()+" "+month[date.getMonth()] + " "+date.getFullYear()}</p>
        </div>
    </div>
  )
}

export default SingleSideBlog