import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useNavigate } from 'react-router-dom';
import DialogTitle from '@mui/material/DialogTitle';

function SingleAlertMessage({open,setOpen,message,success}){

  const navigate = useNavigate();

  const handleClose = ()=>{

    setOpen(false);
    if(success === true){
       navigate("/",{replace: true});
    }
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
    <div className='w-full text-center'>
    <button onClick={handleClose} className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
    OK
    </button>
    </div>
    </DialogContent>
    </Dialog>
    </>
  )
}

export default SingleAlertMessage