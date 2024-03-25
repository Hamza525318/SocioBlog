import { useEffect,useState } from 'react'
import Navbar from '../Navbar'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoginAlertMessage from "../alertMessages/LoginAlertMessage"
import {addUser,addSocketConnection,incrementRealTimeLike,addNewRealtimeLike,addNotifications} from '../../features/user/userSlice'; 
import {registerSocketEvent} from "../socketEvents"
import { useSelector,useDispatch } from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import io from 'socket.io-client'
import BlogDetails from './BlogDetails'

function WriteBlog() {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  axios.defaults.withCredentials = true;
  let socket = useSelector(state => state.users.user.socket);
  const userObj = useSelector(state => state.users.user);
  const user = useSelector(state => state.users.user.username);
  const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
  const [open, setOpen] = useState(false);

  console.log(open)

  useEffect(()=>{

    // if(firstVisitVerify && Object.keys(socket).length == 0){
    //   socket = io.connect(`http://localhost:3000?userId=${userObj.user_id}&username=${userObj.username}`);
    //   dispatch(addSocketConnection({"socket": socket}));
    //   registerSocketEvent();
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
        console.log("I came");
        const url = "http://localhost:3000/user/first-visit-verify";
        const user = (await axios.get(url)).data.user
        if(!user){
          handleClickOpen();
        }
         dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics,"chatBgImage":user.userChatBg}));
         if(user.username && Object.keys(socket).length == 0){
         socket = io.connect(`http://localhost:3000?userId=${user._id.toString()}&username=${user.username}`);
         dispatch(addSocketConnection({"socket": socket}));
         //registerSocketEvent();
         registerSocketEvent(socket,dispatch);
        }
        
    } catch (error) {
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
    <div className='w-screen overflow-y-visible'>
    
         { open === true &&
          <LoginAlertMessage 
          open={open} 
          setOpen={setOpen} 
          message={"To start sharing your stories you need to sign in"}
          pageName={"writeBlog"}
          />
        }
          <>
          <Navbar/>
          <BlogDetails/>
          </>
    </div>
  )
}

export default WriteBlog