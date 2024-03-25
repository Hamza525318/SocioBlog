import React from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {  updateDeletedBlog } from "../../features/blogs/blogSlice"
import axios from 'axios';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

function MyBlogSingleBlog({createdAt,title,content,blog_id,category,blog_image}) {
    

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText;
    const words = textContent.split(/\s+/);
    const first40Words = words.slice(0, 40).join(' ');
    const date = new Date(parseInt(createdAt));
    const  month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const[confirmDeleteBlog,setConfirmDeleteBlog] = useState(false);
    const[afterDeletionModal,setafterDeletionModal] = useState(false);
    const[error,setError] = useState("");
    const[success,setSuccess] = useState("");

    const handleCloseafterDeletion = ()=>{
       if(success.length > 0){
        dispatch(updateDeletedBlog());
       }
       setafterDeletionModal(false);
    }

    const handleOpenConfirmDelete = ()=>{
      setConfirmDeleteBlog(true);
    }
  
    const handleCloseConfirmDelete = ()=>{
       setConfirmDeleteBlog(false);
    }

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
    };

    const deleteBlogFunc = async()=>{
        
        handleCloseConfirmDelete();
        const url = `http://localhost:3000/blogs/deleteblog/?blogid=${blog_id}`
        try {
          const response = await axios.delete(url);
          setSuccess("Blog deleted successfully");
          setafterDeletionModal(true);
          
        } catch (error) {
           setError("There was some error deleting the blog please try again later");
           setafterDeletionModal(true);
        }
    }

  return (
    
    <div className='bg-white w-full mt-5'>
        <div className='p-4 w-full flex justify-around items-center'>
          <div className='w-3/4'> {/*LEFT BOX*/}
           <p className='text-base font-serif text-slate-500 my-1'>{month[date.getMonth()]+" "+date.getDay()}</p>
            <h3 className='text-lg font-black'>{title}</h3>
             <div className='w-full'>
             <div className='font-serif text-base text-slate-600' dangerouslySetInnerHTML={{__html: first40Words+`....`}}></div>
             </div>
             <div className='my-6 flex items-center'>
                {/* <div className='flex items-center'>
                   {
                      category.map((c)=>{
                        return(
                        <button className='px-2 py-1 mx-2 text-xs bg-gray-200 rounded-2xl'>{category[0]}</button>
                        )
                      })
                   }
                </div> */}
                <button className='px-2 py-1 mx-2 text-xs bg-gray-200 rounded-2xl'>{category}</button>
                <MoreHorizIcon
                  
                  id="demo-positioned-button"
                  aria-controls={open ? 'demo-positioned-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{"marginLeft":"10px"}}
                />
                <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
                transformOrigin={{
                 vertical: 'top',
                 horizontal: 'left',
                }}
                >
               <h3 className='text-red-500 p-3' onClick={handleOpenConfirmDelete}>delete Blog</h3>
               <h3 className='p-3'>view stats</h3>
              </Menu>
             </div>
            </div>
             <div className='w-1/4 ml-3'> {/*RIGHT BOX*/}
            { blog_image &&
             <div>
              <img src={blog_image} className='w-[120px]  object-cover'></img>
             </div>
             } 
            </div>
            </div>
        <div className='h-one w-1/2 ml-4  bg-slate-300'></div>

          <Dialog
            open={confirmDeleteBlog}
            onClose={handleCloseConfirmDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
           <DialogTitle id="alert-dialog-title">
             <p className='text-center text-lg font-poppins py-3 font-semibold'>Are you sure you want to delete the blog</p>
           </DialogTitle>
            <DialogContent>
           <div className='w-full flex justify-center'>
            <button onClick={deleteBlogFunc} className='px-12 py-2 bg-red-500 rounded-full text-white text-base font-poppins'>
            YES
            </button>
            <button onClick={handleCloseConfirmDelete} className='px-12 py-2 ml-2 bg-cyan-600 rounded-full text-white text-base font-poppins'>
              NO
            </button>
           </div>
            </DialogContent>
          </Dialog>

          <Dialog
            open={afterDeletionModal}
            onClose={handleCloseafterDeletion}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
           <DialogTitle id="alert-dialog-title">
             <p className='text-center text-lg font-poppins py-3 font-semibold'>{error?error:success}</p>
           </DialogTitle>
            <DialogContent>
           <div className='w-full flex justify-center'>
            <button onClick={handleCloseafterDeletion} className='px-12 py-2 bg-red-500 rounded-full text-white text-base font-poppins'>
             OK
            </button>
           </div>
            </DialogContent>
          </Dialog>
    </div>
  )
}

export default MyBlogSingleBlog