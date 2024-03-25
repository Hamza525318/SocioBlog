import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import React from 'react'

function SingleBlog({key,blog_id,title,content,image,createdAt,category}) {

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const words = textContent.split(/\s+/);
  const first40Words = words.slice(0, 40).join(' ');

  return (
    <>
    <div className='h-[1px] w-[700px] bg-gray-300'></div>
    <div className='w-[700px] py-4 cursor-pointer'>
        <div className='w-full flex items-center py-2'>
            <Avatar sx={{width: 20,height:20}}>H</Avatar>
            <p className='text-xs px-1'>Hamza Mustafa</p>
            <p className='text-gray-500 text-xs'>Nov 3.</p>
        </div>
        <div className='w-full flex justify-between items-center'>
            <div className='w-[500px] my-3'>
            <Link to={`/single-blog/?blog_id=${blog_id}`}><h2 className='text-xl font-bold font-poppins'>{title}</h2></Link>
             <p dangerouslySetInnerHTML={{__html:first40Words+`....`}} className='my-1 font-serif text-slate-600 text-base'></p>
            </div>

            <div className='w-[150px]'>
              {
                image && <img src={image} style={{"width":"110px","objectFit":"cover"}}></img>
              }
  
            </div>

        </div>
        <div className='flex items-center my-2'>
           <p className='bg-gray-200 text-sm px-2 rounded-xl'>{category}</p>
        </div>
      </div>
    </>
  )
}

export default SingleBlog