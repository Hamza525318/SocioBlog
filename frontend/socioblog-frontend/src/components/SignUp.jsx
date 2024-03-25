import React,{useState,useEffect} from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useDispatch, useSelector} from "react-redux"
import  io  from 'socket.io-client';
import { addSocketConnection, addUser } from '../features/user/userSlice';
import axios from "axios";
import { Link,useNavigate } from 'react-router-dom'

function SignUp() {
  
  axios.defaults.withCredentials = true;
  const[username,setUsername] = useState("");
  const [open, setOpen] = useState(false);
  const [user,setUser] = useState(false);
  const[displayMessage,setDisplayMessage] = useState("");
  const socket = useSelector(state => state.users.user.socket);
  const dispatch = useDispatch();
  const[email,setEmail] = useState("");
  const[password,setPassword] = useState("");
  const[confirmPassword,setConfirmPassword] = useState("");
  const url = "http://localhost:3000/user/signup"
  const navigate = useNavigate();

    
   useEffect(()=>{
    const token = document.cookie.split(";").find(row => row.startsWith("token"));
    if(token){
      navigate("/",{replace:true});
    }
   },[])
  
  const validateSignUp = (e)=>{

      e.preventDefault();
       if(!username || !email || !password || !confirmPassword){
           setDisplayMessage("OOPS some fields are missing... Please fill out all the fields!!!");
           handleClickOpen();
           return;
       }
       if(password != confirmPassword){
            setDisplayMessage("password and confirm password fields does not match...check once again!!!");
            handleClickOpen();
            return;
       }
       sendSignUpDetails();
    }

    const sendSignUpDetails = async()=>{
       
        const data = {
          "username": username,
          "email":email,
          "password": password,
        }

        try {
           
          const user = (await axios.post(url,data)).data.user
          dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":[]}));
          // if(user.username && Object.keys(socket).length == 0){
          //   socket = io.connect(`http://localhost:3000?userId=${user._id.toString()}&username=${user.username}`);
          //   dispatch(addSocketConnection({"socket": socket}));
          //   registerSocketEvent();
          // }
          setDisplayMessage("Account created successfully 😄");
          setUser(true);
          handleClickOpen();
          setEmail("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");

        } catch (error) {
           const response = error.response;
           console.log(error);
           setDisplayMessage(response.data.message);
           handleClickOpen();
           setEmail("");
           setUsername("");
           setPassword("");
           setConfirmPassword("");
           return;
        }
    }

    const handleClickOpen = ()=>{
      setOpen(true);
    }
  
    const handleClose = ()=>{
      if(user){
        navigate("/getting-started/topics",{replace:true});
      }
      setOpen(false);
    }


  return (
    <section className='bg-slate-200 w-screen h-screen flex justify-center items-center'>
        <div className='bg-white rounded-lg w-350'>
            <h1 className='p-4 font-bold text-2xl text-center text-reddish-orange'>SocioBlog</h1>
            <h5 className='font-bold p-2 text-md text-center'>Sign Up</h5>
            <p className='text-center text-xs text-slate-400 mb-5'>Please fill the details for Sign up</p>

            <form>
                <h5 className='px-4 text-sm font-bold'>Username</h5>

                <input 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                type='text' 
                className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'
                />

                <h5 className='px-4 text-sm font-bold'>Email</h5>

                <input type='text'
                value={email}
                onChange={(e)=>setEmail(e.target.value)} 
                className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'
                />

                <h5 className='px-4 text-sm font-bold'>Password</h5>
                <input type='password' 
                value={password}
                onChange={(e)=>setPassword(e.target.value)} 
                className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'
                />

                <h5 className='px-4 text-sm font-bold'>Confirm Password</h5>
                <input type='password'
                value={confirmPassword} 
                onChange={(e)=>setConfirmPassword(e.target.value)}  
                className='bg-slate-100 outline-none rounded-md w-60 mx-4 my-2'/>
                <br/>

                <div className='w-300 flex justify-center'>
                <button type='submit' onClick={validateSignUp} className='px-12 py-1 bg-lightish-pink my-3 text-white rounded-xl'>Sign Up
                </button>
                </div>
                <p className='text-center text-xs text-slate-400 mb-5'>Aldready have an account?<Link to="/user/login" className='underline'>Login</Link></p>
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

export default SignUp