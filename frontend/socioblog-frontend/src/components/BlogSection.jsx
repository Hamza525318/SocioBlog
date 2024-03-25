import AllBlogs from "./AllBlogs"
import "./AllBlogs.css"
import axios from 'axios';
import {Link} from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {registerSocketEvent} from "./socketEvents"
import { addNewConnectionRequest, addNewRealtimeLike, addNotifications, addUser, incrementRealTimeLike, updateAcceptedConnectionRequests } from "../features/user/userSlice";
import * as React from 'react';
import Sidebar from "./Sidebar"
import { useEffect, useState } from "react";
import {useSelector,useDispatch} from 'react-redux'
import {addSocketConnection} from "../features/user/userSlice"
import io from 'socket.io-client'
import SideBlogs from "./latestAndTopReadBlogs/SideBlogs";
// const socket = io.connect('http://localhost:3000');

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BlogSection(){
    
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();
    const [isprevReadBlogPresent,setIsprevReadBlogPresent] = useState(false);
    const userObj = useSelector(state=>state.users.user);
    const [prevReadBlog,setPrevReadBlog] = useState({});
    const [open, setOpen] = useState(false);
    const user = useSelector(state => state.users.user.username);
    let socket = useSelector(state => state.users.user.socket);
    const firstVisitVerify = useSelector(state => state.users.user.verifyUser);  
    //console.log(firstVisitVerify);

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

    //   socket.on("connRequestFromUser",(connObj)=>{
    //     dispatch(addNewConnectionRequest({"connObj":connObj}));
    //   })

    //   socket.on("acceptedRequestNotification",(connObj)=>{
    //     dispatch(updateAcceptedConnectionRequests({"connObj":connObj}));
    //   })
    // }

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      localStorage.removeItem('appState');
    };

    console.log(socket);

      useEffect(()=>{

       if(firstVisitVerify && Object.keys(socket).length == 0){
          socket = io.connect(`http://localhost:3000?userId=${userObj.user_id}&username=${userObj.username}`);
          dispatch(addSocketConnection({"socket": socket}));
          //registerSocketEvent();
          registerSocketEvent(socket,dispatch);
       }
        
        // const prevBlog = localStorage.getItem('appState');

        // if(prevBlog != null){

        //     setIsprevReadBlogPresent(!isprevReadBlogPresent);
        //     setPrevReadBlog({...JSON.parse(prevBlog)});
        //     setOpen(true);
        // }
       const token = document.cookie.split(";").find(row => (row.startsWith(" token") || row.startsWith("token")));
       if(!token){
        handleClickOpen();
      }
      if(!firstVisitVerify && token){
        verifyUserOnFirstVisit();
      }
        

    },[user])
  
    const verifyUserOnFirstVisit = async()=>{
      try {
          const url = "http://localhost:3000/user/first-visit-verify";
          console.log("sent url");
          const user = (await axios.get(url)).data.user;
          if(!user){
            handleClickOpen();
          }
          dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics,"chatBgImage":user.userChatBg}));
          if(user.username && Object.keys(socket).length == 0){
            socket = io.connect(`http://localhost:3000?userId=${user._id.toString()}&username=${user.username}`);
            dispatch(addSocketConnection({"socket": socket}));
            registerSocketEvent(socket,dispatch);
          }
        } catch (error) {
           alert(error);
           return;
      }
    }

     
    return(
        <section className="w-full flex bg-white my-5">
        <AllBlogs/>
        <SideBlogs/>
       </section>
    )

}

//<div>
{/* <Dialog
open={open}
TransitionComponent={Transition}
keepMounted
onClose={handleClose}
aria-describedby="alert-dialog-slide-description"
>
<h2 className='p-3 text-lg font-bold text-center'>BLOG TITLE</h2>
<h2 className='p-3 text-lg font-bold text-center'>{prevReadBlog.blog_title}</h2>
<p className='text-sm my-1 text-center'>written by: {prevReadBlog.blog_author}</p>
<div className='w-full flex justify-center'>
<button className='bg-blue-500 py-2 w-36 m-3 text-white' onClick={handleClose}><Link to={`/single-blog/?blog_id=${prevReadBlog.blog_id}`}>Continue Reading</Link></button>
<button className='bg-red-400 py-2 w-36 m-3 text-white' onClick={handleClose}>Cancel</button>
</div>
</Dialog> */}
//</div>

export default BlogSection