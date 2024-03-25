import React, { useState,useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { Link } from 'react-router-dom'

function Login() {
  
  axios.defaults.withCredentials = true;
  const blog_user = useSelector(state => state.users.user);
  const[open,setOpen] = useState(false);
  const [username,setUsername] = useState("");
  const [user,setUser] = useState(false);
  const [password,setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[displayMessage,setDisplayMessage] = useState("");



  useEffect(()=>{
    const token = document.cookie.split(";").find(row => row.startsWith("token"));
    if(token){
      navigate("/",{replace:true});
    }
   },[])
   
  const validateLoginDetails = (e)=>{
      
      e.preventDefault();
    if(!username || !password){
        
      setDisplayMessage("OOPS some fields are missing... Please fill out all the fields!!!");
      handleClickOpen();
      return;
    
    }
      else{
        verifyLoginDetails();
      }
  }

  const verifyLoginDetails = async()=>{
        
       const data = {"username":username,"password":password};
       const url = "http://localhost:3000/user/login";

       try {
              const user = (await axios.post(url,data)).data.user;
              dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics,"chatBgImage":user.userChatBg}));
              setDisplayMessage("Login successfull!! 😄");
              setUser(true);
              setUsername("");
              setPassword("");
              handleClickOpen();
        } catch (error) {
          
           const response = error.response;
           setDisplayMessage(response.data.message);
           setUsername("");
           setPassword("");
           handleClickOpen();
           return;
       }
  }

  const handleClickOpen = ()=>{
    setOpen(true);
  }

  const handleClose = ()=>{
    if(user){
      navigate("/",{replace:true});
    }
    setOpen(false);
  }


  return (
      
    <section className='bg-slate-200 w-screen h-screen flex justify-center items-center'>
    <div className='bg-white rounded-lg w-350'>
        <h1 className='p-4 font-bold text-2xl text-center text-reddish-orange'>SocioBlog</h1>
        <h5 className='font-bold p-2 text-md text-center'>Login</h5>
        <p className='text-center text-xs text-slate-400 mb-5'>Please fill the details for Sign up</p>

        <form onSubmit={validateLoginDetails}>

            <h5 className='px-4 text-sm font-bold'>Username</h5>
            <input type='text' id='username' name='username' 
            value={username} 
            onChange={(e)=> setUsername(e.target.value)} 
            className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'/>

            <h5 className='px-4 text-sm font-bold'>Password</h5>
             <input 
               type='password' id='pass' name='password' value={password} 
               onChange={(e)=>setPassword(e.target.value)} 
               className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'
             />
            <br/>
            <div className='w-300 flex justify-center'>
            <button type='submit'
             className='px-12 py-1 bg-lightish-pink mt-4 mb-2 text-white rounded-xl'>Login
            </button>
            </div>
            <p className='text-center  text-slate-500 font-roboto text-[12px]  my-2'><Link to={"/reset-password"}>forgot-password?</Link></p>
            <p className='text-center text-xs text-slate-400 mb-5'>Dont have an account?<Link to='/user/signup' className='underline font-semibold'>SignUp here</Link></p>
        </form>
            <Dialog
             open={open}
             onClose={handleClose}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
             >
            <DialogTitle id="alert-dialog-title">
              <p className='text-center text-lg font-poppins py-3 font-semibold'>{displayMessage}</p>
            </DialogTitle>
             <DialogContent>
            <div className='w-full text-center'>
             <button onClick={handleClose} className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
              OK
             </button>
            </div>
             </DialogContent>
           </Dialog>
    </div>


</section>
  )
}

export default Login