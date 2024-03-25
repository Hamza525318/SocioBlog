import * as React from 'react';
import {Link} from 'react-router-dom'
import Button from '@mui/material/Button';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ContinueReadingBlog({blog_title,author,blog_id,isPresent}) {
  const [open, setOpen] = useState(isPresent);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.removeItem('appState');
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <h2 className='p-3 text-lg font-bold text-center'>BLOG TITLE</h2>
        <h2 className='p-3 text-lg font-bold text-center'>{blog_title}</h2>
          <p className='text-sm my-1 text-center'>written by: {author}</p>
          <div className='w-full flex justify-center'>
          <button className='bg-blue-500 py-2 w-36 m-3 text-white' onClick={handleClose}><Link to={`/single-blog/?blog_id=${blog_id}`}>Continue Reading</Link></button>
          <button className='bg-red-400 py-2 w-36 m-3 text-white' onClick={handleClose}>Cancel</button>
          </div>
      </Dialog>
    </div>
  );
}