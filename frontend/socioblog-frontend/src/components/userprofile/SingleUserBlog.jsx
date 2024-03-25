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
import CustomMenu from './CustomMenu';

function SingleUserBlog({createdAt,title,content,blog_id,category,blog_image}) {
    
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

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    
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
                <div className='flex'>
                <button className='px-2 py-1 mx-2 text-xs bg-gray-200 rounded-2xl'>{category}</button>
                </div>
                <MoreHorizIcon
                  
                  id="demo-positioned-button"
                  aria-controls={open ? 'demo-positioned-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                  sx={{"marginLeft":"10px"}}
                />
                <CustomMenu anchorEl={anchorEl} open={open} setAnchorEl={setAnchorEl} message={"copy blog url"} blogId={blog_id}/>
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
        <div className='h-one w-[90%] ml-4  bg-slate-300'></div>

    </div>
  )
}

export default SingleUserBlog