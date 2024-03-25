import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

function FooterBlog({blog_id,title,content,image,curr_blogId,username}) {

 const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  const textContent = tempDiv.textContent || tempDiv.innerText;
  const words = textContent.split(/\s+/);
  const first20Words = words.slice(0, 20).join(' ');
  const navigate = useNavigate();

  const redirectToBlog = ()=>{

    navigate(`/single-blog/?blog_id=${blog_id}`,{replace: true});
    window.scrollTo({top:0,behavior:'instant'})
  }

  return (
    <div className='w-[350px] h-[400px] ml-5 bg-white my-3'>
       {
         image?(<img src={image} className='w-full h-[250px]'/>):(<img src='https://res.cloudinary.com/dduzbqxt7/image/upload/v1707828845/gpphbasarp6jsiqldb41.png' className='w-full h-[250px]'/>)
       }
      
      <p className='my-2 font-poppins fon-bold'>{username}</p>

      <h3 className='text-lg font-bold font-poppins' onClick={redirectToBlog}>{title}</h3>
      <p dangerouslySetInnerHTML={{__html:first20Words+`....`}} className='my-1 font-serif text-black text-sm'></p>
    </div>
  )
}

export default FooterBlog