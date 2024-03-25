import React from 'react'
import FooterBlog from './FooterBlog'
import Avatar  from '@mui/material/Avatar'

function SingleBlogFooter({blog_id,latestBlogs,userInfo}) {
  return (
  <div className='bg-slate-100'>
  <div className='mt-5 w-screen flex flex-col justify-center items-center'>
    <div className='mt-4 w-1/2 p-8'>
       <Avatar size={40} alt='Hamza'/>
       <h5 className='my-5 text-2xl font-bold'>Written by:{userInfo.username}</h5>
       <p>Undergraduate Student | CS and Math Teacher | Android Developer | Oracle Certified Java Programmer | Musician | https://cybercoder-naj.github.io</p>
    </div>
    <div className='h-one w-3/4 mb-6 bg-slate-500'></div>

    </div>
    
    {/*Display latest Blogs By author*/}
    { latestBlogs.length >= 2 &&
    <div className='w-screen flex flex-col my-7 items-center'>
    <div className='w-[750px]'>
        <h3 className='font-poppins font-bold'>More from {userInfo.username}</h3>
    </div>
    <div className='w-[750px] flex flex-wrap items-center'>
      {
        latestBlogs.map((blog)=>{
            if(blog._id !== blog_id){
                return(
                    <FooterBlog
                    blog_id = {blog._id}
                    title={blog.title} 
                    content={blog.blog_content} 
                    image={blog.blog_image} 
                    curr_blogId={blog_id}
                    username={userInfo.username}
                    />
                )
            }
        })
      }
    
    </div>
    </div>
}
  </div>
  )
}

export default SingleBlogFooter