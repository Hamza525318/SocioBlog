import React,{useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import IosShareIcon from '@mui/icons-material/IosShare';
import { useLocation } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Dialog from '@mui/material/Dialog';
import "./SingleBlog.css"
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AlertMessage from '../alertMessages/LoginAlertMessage';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ChatIcon from '@mui/icons-material/Chat';
import io from 'socket.io-client'
import { addSocketConnection } from '../../features/user/userSlice';

function LikePost({blog}) {

    const [likePost,setLikePost] = useState(false);
    const [likes,setLikes] = useState(blog.no_of_likes);
    const [isConnectedToAuthor,setIsConnectedToAuthor] = useState(false);
    const [connObj,setConnObj] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[open,setOpen] = useState(false);
    axios.defaults.withCredentials = true;
    const user = useSelector(state => state.users.user);
    let socket = useSelector(state => state.users.user.socket);
    const location = useLocation(); 
    const [copyModalOpen,setCopyModalOpen] = useState(false);
    const[loginMessage,setLoginMessage] = useState("");
    const[connMessage,setConnMessage] = useState("");
    console.log(blog);
    

    useEffect(()=>{
      
      checkIfPostIsAldreadyLiked();
      if(user.user_id){
        checkUserConnectionRequest();
      }

    },[])

    const checkUserConnectionRequest = async()=>{
      console.log(blog.user_id)
      const url = `http://localhost:3000/conn-request/check-connection?userId=${user.user_id}&authorId=${blog.user_id}`
      const response = (await axios.get(url)).data.conn_info;
      console.log(response);
      if(response){
        setIsConnectedToAuthor(true);
        setConnObj({...response});
      }
    }

    const handleChangeInLike = async()=>{
       
      if(!user.username){
        setLoginMessage("To like the blog post you need to sign in")
        setOpen(true);
        return;
      }

     if(likePost === false){
            const url = "http://localhost:3000/blogs/like-post/"
            const data = {
                user_id: user.user_id,
                blog_id: blog._id,
            }

            const response = (await axios.post(url,data)).data
            setLikes(response.no_of_likes);
            setLikePost(true);
            socket.emit('receiveLike',{authorId:blog.user_id,username: user.username,title: blog.title,blog_id:blog._id.toString()});
        }
        else{
            dislikePost();
        }
    }

    const checkIfPostIsAldreadyLiked = async ()=>{
        
      const url = `http://localhost:3000/blogs/hasLikedPost?user_id=${user.user_id}&blog_id=${blog._id}`

      try {

        const response = (await axios.get(url)).data.isPostLiked;

       if(response === true){
         setLikePost(true);
       }
        
      } catch (error) {
          alert(error);
          return;
      }
    }

    const dislikePost = async()=>{
       const url = `http://localhost:3000/blogs/unlike-post?user_id=${user.user_id}&blog_id=${blog._id}`
       try {

        const no_of_likes = (await axios.get(url)).data.no_of_likes;
        setLikes(no_of_likes);
        setLikePost(false);
        
       } catch (error) {
          
          alert(error);
          return;
       }
    }

    const navigateSignInPage = ()=>{
       setOpen(false);
       navigate("/user/login",{replace: true});
    }

    const handleCopyModalClose = ()=>{
      setCopyModalOpen(false);
      setConnMessage(" ");
    }

    const handleCopyToClipboard = ()=>{
         navigator.clipboard.writeText("http://localhost:5173"+location.pathname+location.search).
         then(()=>{setConnMessage("Link Copied to clipboard successfully");setCopyModalOpen(true)})
         .catch((err)=>alert(err));
    }

    const addConnectionRequest = async()=>{

      if(!user.username){
        setLoginMessage("To send connection request you need to login!!");
        setOpen(true);
        return;
      }
          
      const url = "http://localhost:3000/conn-request/add-request";
      const data = {
        sender: user.user_id,
        receiver: blog.user_id
      }

      try {
        await axios.post(url,data);
        setConnMessage("Connection request sent successfully!!");
        setCopyModalOpen(true);
        socket.emit('addConnectionRequest',data);
      } catch (error) {
        const response = error.response;
        setConnMessage(response.data.message);
        setCopyModalOpen(true);
      }
    }


  return (
    <div className='w-screen flex justify-center my-4'>
       <div className='flex w-1/2 justify-between items-center'>
         {
            likePost === true?(
                
            <div className='flex items-center'>

               <FavoriteIcon className='text-reddish-orange heart' onClick={handleChangeInLike} fontSize='large'/>
               <p>{likes}</p>

            </div>
                
            ):(
                
            <div className='flex items-center'>
               <FavoriteBorderIcon className='text-gray-500' onClick={handleChangeInLike} fontSize='large'/>
               <p>{likes}</p>
             </div>
            )
         }
          <div className='flex items-center'>
        {
           isConnectedToAuthor === true?(
            <Link to={`http://localhost:5173/chat/${connObj.firebaseId}`}><ChatIcon fontSize='medium' className='mx-3 top1'/></Link>
           ):(
            <>
            {  blog.user_id !== user.user_id &&
              <PersonAddAlt1Icon fontSize='medium' className='mx-3 top-1' onClick={addConnectionRequest}/>
            }
            </>
           )
        } 
          <IosShareIcon fontSize='medium' onClick={handleCopyToClipboard}/>
          </div>
       </div>
       {/* <Dialog
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
           <DialogTitle id="alert-dialog-title">
             <p className='text-center text-lg font-poppins py-3 font-semibold'>{loginMessage}</p>
           </DialogTitle>
            <DialogContent>
           <div className='w-full flex justify-center'>
            <button onClick={navigateSignInPage} className='px-12 py-2 bg-red-500 rounded-full text-white text-base font-poppins'>
            sign in now
            </button>
            <button onClick={()=>setOpen(false)} className='px-12 py-2 ml-2 bg-cyan-600 rounded-full text-white text-base font-poppins'>
              later
            </button>
           </div>
            </DialogContent>
          </Dialog> */}
          {
            open === true && <AlertMessage open={open} setOpen={setOpen} message={loginMessage}/>
          }

          <Dialog
            open={copyModalOpen}
            onClose={handleCopyModalClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
           <DialogTitle id="alert-dialog-title">
             <p className='text-center text-lg font-poppins py-3 font-semibold'>{connMessage}</p>
           </DialogTitle>
          </Dialog>
    </div>
  )
}

export default LikePost