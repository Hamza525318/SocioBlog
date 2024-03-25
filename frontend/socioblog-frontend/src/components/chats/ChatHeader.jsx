import { Avatar, Tooltip } from '@mui/material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate, useParams } from 'react-router-dom';
import React,{useRef, useState} from 'react';
import { updateBgImageForChat,removeChatBg } from '../../features/user/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import HideImageIcon from '@mui/icons-material/HideImage';


function ChatHeader() {
 
  const{username} = useParams();
  const[open,setOpen] = useState(false);
  const[bgImageName,setBgImageName] = useState("");
  const userId = useSelector(state => state.users.user.user_id);
  console.log(userId)
  const chatBg = useSelector(state => state.users.user.bgImage_chat);
  const ImageRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openImageUpload = ()=>{
    ImageRef.current.click();
  }

  const handleClose = ()=>{
    setOpen(false);
  }

  const removeImageUpload = ()=>{
    if(ImageRef != null){
      ImageRef.current.value = null;
      setBgImageName("");
      handleClose();
    }
  }

  const updateImageName = ()=>{
    setBgImageName(ImageRef.current.files[0].name);
    setOpen(true);
  }

  const uploadImageToDB = async()=>{
    
    handleClose();
    const url = `http://localhost:3000/user/upload-chat-bg-image?userId=${userId}`;
    const formData = new FormData();

    formData.append("file",ImageRef.current.files[0]);

    const response = (await axios.post(url,formData)).data;
    dispatch(updateBgImageForChat(response.chat_background));

  }

  const removeBgImage = async()=>{

     const url = `http://localhost:3000/user/remove-chat-bg-image?userId=${userId}`
     await axios.put(url).then(()=>{
        dispatch(removeChatBg());
     }).catch((err)=>{
      alert(err);
      return
     })

  }

  return (
    <div className='h-18 w-screen bg-slate-50 flex items-center justify-between'>
      <div className='p-3 h-full flex items-center'>
        <Avatar src='s' alt={username.charAt(0).toUpperCase()}/>
        <h4 className='text-lg font-roboto font-semibold mx-3'>{username}</h4>
      </div>
      <div className='mr-10 flex items-center'>
      <ExitToAppIcon fontSize='medium' className='mr-8 cursor-pointer' onClick={()=> navigate("/",{replace: true})}/>
      {
        chatBg?(
          <Tooltip title="remove background Image">
          <HideImageIcon fontSize='large' onClick={removeBgImage}/>
          </Tooltip>
        ):(
          <Tooltip title="add background Image">
          <input type='file' className='hidden' ref={ImageRef} onChange={updateImageName}/>
          <AddPhotoAlternateIcon fontSize='large' onClick={openImageUpload}/>
          </Tooltip>
        )
      }
      </div>
    {
      ImageRef != null && 
      <Dialog
      open={open}
      onClose={removeImageUpload}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title">
      <p className='text-center text-lg font-poppins py-3 font-semibold'>Do you want to upload {bgImageName}  as your background image for chat</p>
      </DialogTitle>
      <DialogContent>
      <div className='w-full text-center flex items-center'>
      <button onClick={uploadImageToDB} className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
      upload Image
      </button>
      <button className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins' onClick={removeImageUpload}>
        No
      </button>
      </div>
      </DialogContent>
      </Dialog>
    }
      </div>
  )
}

export default ChatHeader