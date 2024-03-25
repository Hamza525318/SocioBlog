import React,{useState} from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import axios from 'axios';
import MyBlogSingleBlog from '../myblogs/MyBlogSingleBlog';
import CustomMenu from './CustomMenu';
import SingleUserBlog from './SingleUserBlog';


function UserBlogs({userBlogs,username}) {
  
  const[anchorEl,setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  axios.defaults.withCredentials = true;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  return (
    <section className='w-[65%] mx-auto p-8 border-r-2 border-slate-300'>
    <div className='w-full flex justify-between items-center ml-2'>
      <h1 className='text-[32px] font-bold font-poppins'>{username}</h1>
      <MoreHorizIcon
      id="demo-positioned-button"
      aria-controls={open ? 'demo-positioned-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick}
      sx={{"marginLeft":"10px"}}
      />
    </div>

    <div className='w-full my-5'>
      {
        userBlogs.map((blog,index)=>{
          return(
          <div key={index}>
          <SingleUserBlog
            blog_id = {blog._id} 
            createdAt={blog.createdAt} 
            title={blog.title} 
            content={blog.blog_content}
            category = {blog.category}
            blog_image = {blog.blog_image}
          />
          </div>
          )
        })
      }
    </div>

    <CustomMenu anchorEl={anchorEl} open={open} setAnchorEl={setAnchorEl} message={"copy user profile URL"}/>
    </section>

  )
}

export default UserBlogs