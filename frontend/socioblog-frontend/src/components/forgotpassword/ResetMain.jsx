import React,{useEffect, useState} from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SingleAlertMessage from '../alertMessages/SingleAlertMessage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ResetMain() {

  const navigate = useNavigate();
  const [userCredential,setUserCredentials] = useState("");
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState("");
  axios.defaults.withCredentials = true;

  useEffect(()=>{
        
   //split the string into substrings based on a seprator
   const token = document.cookie.split(";").find(row => row.startsWith("token"));
   if(token){
    navigate("/",{replace: true});
   }

  },[])
  
  const verifyUserCredentials = async()=>{

    if(!userCredential){
      setMessage("Please specify username or email to verify!!!");
      setOpen(true);
      return;
    }

    const url = "http://localhost:3000/user/reset-password";
    const data = {"userCredential": userCredential};

    try {
      const response = await axios.post(url,data);
      setMessage(response.data.message);
      setOpen(true);
      setUserCredentials(" ");
    } catch (error) {
      const response = error.response;
      setMessage(response.data.message);
      setOpen(true);
      setUserCredentials(" ");
    }

  }

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center bg-reddish-orange'>
      {/* <div>
        <h1 className='text-white font-bold text-[36px] font-roboto my-3'>SocioBlog</h1>
      </div> */}

      <div className='w-[500px] h-[270px] bg-white p-5 rounded-lg'>
         <h4 className='text-base font-bold text-center font-poppins'>Forgot your password?</h4>
         <div className='my-2'>
         <p className='text-[12px] text-center text-slate-500'>Enter your email below to receive your password</p>
         <p className='text-[12px] text-center text-slate-500'>reset instructions</p>
         </div>
        <div className='mt-4 w-full text-center'> 
         <input 
         type='text' 
         value={userCredential}
         placeholder='username or email Id...' 
         className='w-[350px] h-10 border-gray-400 text-gray-600 border-2 outline-none rounded-md p-2 font-poppins text-sm'
         onChange={(e)=>setUserCredentials(e.target.value)}
         />
        </div>
         <div className='w-full flex justify-center mt-2'>
         <button className='px-14 py-1 bg-lightish-pink mt-4 mb-2 text-white rounded-xl' onClick={verifyUserCredentials}>Send</button>
         </div>

        <div className='w-full flex items-center justify-center mt-2'>
          <ArrowBackIcon fontSize='small' className='text-slate-600'/>
          <p className='text-[12px] text-slate-500'><Link to={"http://localhost:5173/user/login"}>back to login page</Link></p>
        </div>
        </div>

      {open === true && <SingleAlertMessage open={open} setOpen={setOpen} message={message}/>}
    </section>
  )
}

export default ResetMain