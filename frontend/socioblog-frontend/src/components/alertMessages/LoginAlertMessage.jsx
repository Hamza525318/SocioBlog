import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from 'react-router-dom'

function AlertMessage({open,setOpen,message,pageName}) {

  const navigate = useNavigate();
  const navigateSignInPage = ()=>{
       setOpen(false);
       navigate("/user/login",{replace: true});
  }

  const handleClose = ()=>{
     if(pageName === 'likeNotifications' || pageName=='favTopics' || pageName==='ChatSection' ||pageName==="Connections" || pageName==="writeBlog"){
        setOpen(false);
        navigate("/",{replace: true});
     }

     setOpen(false);
  }

  return (
    <>
    <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
           <DialogTitle id="alert-dialog-title">
             <p className='text-center text-lg font-poppins py-3 font-semibold'>{message}</p>
           </DialogTitle>
            <DialogContent>
           <div className='w-full flex justify-center'>
            <button onClick={navigateSignInPage} className='px-12 py-2 bg-red-500 rounded-full text-white text-base font-poppins'>
            sign in now
            </button>
            <button onClick={handleClose} className='px-12 py-2 ml-2 bg-cyan-600 rounded-full text-white text-base font-poppins'>
              later
            </button>
           </div>
            </DialogContent>
          </Dialog>

    </>
  )
}

export default AlertMessage