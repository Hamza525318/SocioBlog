import React, { useEffect, useState } from 'react'
import MyBlogSingleBlog from './MyBlogSingleBlog';
import Dialog from '@mui/material/Dialog';
import {registerSocketEvent} from "../socketEvents"
import { addUser,addSocketConnection } from '../../features/user/userSlice';
import { updateDeletedBlog } from '../../features/blogs/blogSlice';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector,useDispatch } from 'react-redux';
import Loading from "../loadingpage/Loading"
import axios from "axios"
import Navbar from '../Navbar'
import UserProfile from './UserProfile';
import NoBlogs from './NoBlogs';
import { Link, useNavigate } from 'react-router-dom';
import io from "socket.io-client";


function MyBlogs() {

  const [blogs,setBlogs] = useState([]);
  const [isBlogPresent,setIsBlogPresent] = useState(true);
  const[loading,setLoading] = useState(true);
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;
  const username = useSelector(state => state.users.user.username);
  const deleteBlogStatus = useSelector(state=>state.blogs.deletedBlog);
  let socket = useSelector(state => state.users.user.socket);

  useEffect(()=>{
      
    if(deleteBlogStatus === true){

      fetchAllBlogs();
      dispatch(updateDeletedBlog());
      return;
    }

    const token = document.cookie.split(";").find(row => (row.startsWith("token") || row.startsWith(" token")));
    if(firstVisitVerify && token){
      fetchAllBlogs();
    }
    if(!token){
      handleClickOpen();
    }
    if(!firstVisitVerify && token){
      verifyUserOnFirstVisit();
    }

  },[username,deleteBlogStatus])

  const verifyUserOnFirstVisit = async()=>{
    try {
        const url = "http://localhost:3000/user/first-visit-verify";
        const user = (await axios.get(url)).data.user;
        if(!user){
          handleClickOpen();
        }
        dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics,"chatBgImage":user.userChatBg}));
        if(user.username && Object.keys(socket).length == 0){
          socket = io.connect(`http://localhost:3000?userId=${user._id.toString()}&username=${user.username}`);
          dispatch(addSocketConnection({"socket": socket}));
          //registerSocketEvent();
          registerSocketEvent(socket,dispatch)
        }
        fetchAllBlogs();
        
    } catch (error) {
         alert(error);
         return;
    }
  }

  const fetchAllBlogs = async()=>{
    const url = "http://localhost:3000/user/myblogs"
    try{
      const userBlogs = (await axios.get(url)).data.blogs;
      setLoading(false)
      if(userBlogs.length <= 0){
        setIsBlogPresent(false);
      }
      setBlogs([...userBlogs])
      
    }catch(error){
      alert(error);
      return;
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate("/user/login",{replace:true});
  };

  // const registerSocketEvent = ()=>{
  //   console.log("register event");
  //   socket.on('likedPost',({username,title})=>{
  //     console.log("likePost event");
  //     dispatch(incrementRealTimeLike());
  //     dispatch(addNewRealtimeLike({"username":username,"title":title}));
  //   })

  //   socket.on("unreadNotifications",({read,unread,count})=>{
  //     console.log("unreadnotifications event");
  //     console.log(read);
  //     console.log(unread);
  //     dispatch(addNotifications({"read_notifications":read,"unread_notifications":unread,"unread_likes_count":count}));
  //   })
  // }

  return (
     <>
     <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
               <p className='text-center text-lg font-poppins py-3 font-semibold'>To view your stories you need to sign</p>
            </DialogTitle>
            <DialogContent>
                <div className='w-full text-center'>
                 <button className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
                  <Link to='/user/login'>sign in</Link>
                 </button>
                </div>
            </DialogContent>
               <p className='text-center font-poppins my-2'>Don't have an account? <Link className='font-poppins underline' to='/user/signup'>create now</Link></p>
      </Dialog>
      {
        loading === true?(
           <Loading/>
        ):(
           isBlogPresent === true?(
            <section className='w-screen bg-white'>
            <Navbar/>
      
            <div className='w-screen flex'>
            { blogs &&
            <div className='w-2/3 ml-20 border-r border-slate-700'>
    
    
             {
                blogs.map((blog,index)=>{
                           
                return(
                  <div key={index}>
                    <MyBlogSingleBlog 
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
             }
    
             <div>
               <UserProfile username={username}/>
            </div>
             {  isBlogPresent === false &&
                  <div className="mt-15%">
                     <h3 className='text-center'>YOU HAVE NOT WRITTEN ANY BLOG STILL NOW!</h3>
                     <h1 className='text-center text-xl font-bold font-mono my-4'>Unleash Your Creativity: Share Your Story with the World!</h1>
                     <div className='w-screen flex justify-center'>
                     <button className='px-6 py-2 bg-reddish-orange text-white mx-4 rounded-xl'><Link to="http://localhost:5173/write-a-blog">START WRITING NOW</Link></button>
                     </div>
                  </div>
             }
    
           </div>
           </section>
           ):(
              <NoBlogs/>
           )
        )
      }
     
     </>
    
  )
}

export default MyBlogs