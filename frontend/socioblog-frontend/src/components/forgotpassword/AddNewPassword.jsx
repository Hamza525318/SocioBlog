import React,{useEffect,useState} from 'react'
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../../features/user/userSlice';
import SingleAlertMessage from '../alertMessages/SingleAlertMessage';
import axios from 'axios';


function AddNewPassword() {
 
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  axios.defaults.withCredentials = true;
  //return an obj of key-value pair of dynamic pairs that were matched by the route path
  const {passToken} = useParams();
  console.log(passToken);
  const[open,setOpen] = useState(false);
  const[success,setSuccess]= useState(false);
  const[message,setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(()=>{
    
    const token = document.cookie.split(";").find(row => row.startsWith("token"));
    if(token){
        navigate("/",{replace: true});
    }
  },[])

  const sendUpdatePasswordInfo = async(e)=>{
    
    e.preventDefault();
    
    if(!password){
      setMessage("Please provide password!!");
      setOpen(true);
      return;
    }
    else if(!confirmPassword){
      setMessage("Please provide confirm password!!");
      setOpen(true);
      return;
    }
    else if(password.localeCompare(confirmPassword) !== 0){
      setMessage("Password and confirm password does not match!!");
      setOpen(true);
      return;
    }

    const url = `http://localhost:3000/user/update-password/${passToken}`
    const data = {"password":confirmPassword};

    try {
      const response = await axios.put(url,data);
      setMessage("Password updated successfully");
      setSuccess(true);
      setOpen(true);
      const user = response.data.user;
      dispatch(addUser({"username":user.username,"email":user.email,"user_id":user._id,"favTopics":user.favTopics}));
      setConfirmPassword("");
      setPassword("");
    } catch (error) {
      const response = error.response;
      setMessage(response.data.message);
      setOpen(true);
      setConfirmPassword("");
      setPassword("")
    }
  }

  return (
    <section className='w-screen h-screen flex flex-col items-center justify-center bg-reddish-orange'>
         <div className='w-[500px] h-[280px] bg-white p-5 rounded-lg'>
        <h4 className='text-base font-bold text-center font-poppins'>Reset your password?</h4>
         <div className='my-2'>
         <p className='text-[12px] text-center text-slate-500'>Enter your new password below. we're just being</p>
         <p className='text-[12px] text-center text-slate-500'>extra safe here</p>
         <div className='mt-1 w-full text-center'>
          <input type='password' 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder='new password' 
          className='w-[350px] mb-3 h-10 border-gray-400 text-gray-600 border-b-2 outline-none p-2 font-poppins text-sm'
          />
          <input type='password' 
          placeholder='confirm password' 
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className='w-[350px] h-10 border-gray-400 text-gray-600 border-b-2 outline-none p-2 font-poppins text-sm'
          />
         </div>

         <div className='w-full my-2 flex justify-center'>
           <button onClick={sendUpdatePasswordInfo} className='w-48 py-1 mt-4  bg-lightish-pink text-white rounded-lg'>Reset password</button>
         </div>
         </div>
         </div>

         {open === true && <SingleAlertMessage open={open} setOpen={setOpen} message={message} success={success}/>}
    </section>
  )
}

export default AddNewPassword