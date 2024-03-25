import { Avatar, Tooltip } from '@mui/material'
import "./SingleBlog.css"
import axios from 'axios';
import { styled } from '@mui/material/styles';
import LikePost from './LikePost';
import Loading from "../loadingpage/Loading"
import {useLocation, useNavigate} from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SingleBlogFooter from './SingleBlogFooter';
import SummarizeIcon from '@mui/icons-material/Summarize';
import React, { useEffect, useState,useRef } from 'react'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
   '& .MuiDialogContent-root': {
     padding: theme.spacing(2),
   },
   '& .MuiDialogActions-root': {
     padding: theme.spacing(1),
   },
 }));

function BlogDetails() {
  
  axios.defaults.withCredentials = true;
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const blogId = params.get("blog_id");
  const [blog,setBlog] = useState({});
  const[errorMessage,setErrorMessage] = useState("");
  const[summaryLoading,setSummaryLoading] = useState(false);
  const [loading,setLoading] = useState(true);
  const [userInfo,setUserInfo] = useState({});
  const [open, setOpen] = useState(false);
  const [latestBlogsByAuthor,setLatestBlogsByAuthor] = useState([]);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [blogsummary,setBlogSummary] = useState("");
  const [synthesis,setSynthesis] = useState(null);
  const [isPlayBtnClicked,setPlayBtnClicked] = useState(false);
  const scrollRef = useRef(null);

  useEffect(()=>{
     fetchSingleBlogDetails(blogId);
     if(window.speechSynthesis){
        window.speechSynthesis.cancel();
     }
  },[blogId]);

  
//   window.addEventListener("beforeunload",()=>{
      
//      if(blog._id){
//      const state = 
//      { 
//         blog_title: blog.title,
//         blog_id: blogId,
//         blog_author: userInfo.username
     
//      } 
      
//      localStorage.setItem('appState', JSON.stringify(state));
//      window.removeEventListener("beforeunload");
//      }
     
//    })

   const handleClickOpen = ()=>{
      setOpen(true);
   }

   const handleClose = ()=>{
      setOpen(false);
      navigate("/",{replace:true})
   }
  

  const fetchSingleBlogDetails = async(blog_id)=>{
           
     const url = `http://localhost:3000/blogs/single-blog/?blogId=${blog_id}`;
     console.log("fetch single blog details");
     //console.log(url);
     try {

      const blogDetails = (await axios.get(url));
      setBlog({...blogDetails.data.blog});
      setUserInfo({...blogDetails.data.user});
      setLatestBlogsByAuthor([...blogDetails.data.latestBlogs]);
      setLoading(false);
      
     } catch (error) {
      const response = error.response;
      const status = error.response.status;
      if(status === 404){
         setLoading(false);
         setErrorMessage("The blog you are trying find does not exists or is deleted by the author!!!");
      }
      else{
         setLoading(false);
         setErrorMessage(response.data.message)
      }
       handleClickOpen();
     }
  }

  const handleSummaryModalOpen = () => {
    setSummaryOpen(true);
  };
  const handleSummaryModalClose = () => {
    setSummaryOpen(false);
  };

  const fetchBlogSummary = async()=>{
      const url = "http://localhost:3000/blogs/generate-summary"
      handleSummaryModalOpen();
      setSummaryLoading(true);
      const blogData = convertFromHTMLtoText(blog.blog_content);

      const data = {blog_content: blogData};
      try {
          const summary = (await axios.post(url,data)).data.blog_summary;
          setBlogSummary(summary); 
          setSummaryLoading(false);
      } catch (error) {
         setSummaryLoading(false);
         handleSummaryModalClose();
         return;
      }
  }

  const convertFromHTMLtoText = (blog_content)=>{

      const textBox = document.createElement("div");
      textBox.innerHTML = blog_content;
      textBox.innerText.trim()
      return textBox.innerText;
  }

  const listenToBlog = ()=>{
     
  if (!synthesis) {
   const synth = new SpeechSynthesisUtterance();
   synth.text = convertFromHTMLtoText(blog.blog_content);
   synth.onerror = (error) => console.error('Speech synthesis error:', error);
   setSynthesis(synth);
   setPlayBtnClicked(true);
   window.speechSynthesis.speak(synth);
   scrollRef.current.scrollIntoView({behavior:'smooth'});
  }
   
  else if(window.speechSynthesis.paused){
    window.speechSynthesis.resume();
    setPlayBtnClicked(true);
  }
};

  const pauseBlog = ()=>{

  if(window.speechSynthesis.speaking){
    window.speechSynthesis.pause();
  }
  setPlayBtnClicked(false);
}

  const abortSpeech = ()=>{
     window.speechSynthesis.cancel();
     setSynthesis(null);
     setPlayBtnClicked(false)
  }
  
  return (
   <>
   {
      loading === true?(
         <Loading/>
      ):(
         <>
         <div className='w-screen min-h-screen flex justify-center'>
      <div className='mt-6 w-1/2'>
         <p className=' z-10 my-4 text-center text-40px font-poppins'>{blog.title}</p>
         <div className='w-full h-[1px] bg-gray-300 mt-1'></div>
         <div className='w-full p-2 flex justify-end items-center'>
            <Tooltip title='Summarize blog'>
             <SummarizeIcon className='cursor-pointer text-gray-800 mr-5' onClick={fetchBlogSummary}/>
           </Tooltip>
           {
              isPlayBtnClicked?(
               <>
              <Tooltip title='pause'>
               <PauseCircleFilledIcon  className='cursor-pointer text-gray-800 mr-4' onClick={pauseBlog} />
              </Tooltip>
              <Tooltip title='cancel'>
              <CancelIcon  className='cursor-pointer text-gray-800 mr-4' onClick={abortSpeech} />
              </Tooltip>
              </>
              ):(
              <Tooltip title='listen to blog'>
               <PlayCircleFilledIcon  className='cursor-pointer text-gray-800 mr-4' onClick={listenToBlog} />
              </Tooltip>
              )
           }
      
         </div>
         <div className='w-full h-[1px] bg-gray-300 mt-1'></div>
          {
             blog.blog_image && <img className='h-96 mx-auto mt-10' src={blog.blog_image}></img>
          }
          <div ref={scrollRef}  
          className='my-4 [&_p]:leading-9 font-poppins text-[20px] tracking-wide [&_h1]:font-bold [&_h2]:font-bold'
           
          dangerouslySetInnerHTML={{__html: blog.blog_content}}>
          {/*<p dangerouslySetInnerHTML={{__html: blog.blog_content}} className='leading-9 font-roboto text-twenty tracking-wide'>
          </p>*/}
         </div>
         
         <Dialog
             open={open}
             onClose={handleClose}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
             >
            <DialogTitle id="alert-dialog-title">
              <p className='text-center text-lg font-poppins py-3 font-semibold'>{errorMessage}</p>
            </DialogTitle>
             <DialogContent>
            <div className='w-full text-center'>
             <button onClick={handleClose} className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
              OK
             </button>
            </div>
             </DialogContent>
           </Dialog>
      
      <BootstrapDialog
        onClose={handleSummaryModalClose}
        aria-labelledby="customized-dialog-title"
        open={summaryOpen}

      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
         <h3 className='font-semibold font-poppins'>{blog.title}</h3>
        </DialogTitle>
         <DialogContent dividers>
          <Typography gutterBottom sx={{"width":"550px"}}>
            {
               summaryLoading === true?(
                  <h3 className='font-semibold font-poppins text-[18px] text-center'>Summary Loading....</h3>
               ):(
                <>
                  {blogsummary}
                </>
               )
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSummaryModalClose}>
            CLOSE
          </Button>
        </DialogActions>
      </BootstrapDialog>
      </div>
    </div>

    <LikePost blog={blog}/>
   <SingleBlogFooter blog_id={blog._id} latestBlogs={latestBlogsByAuthor} userInfo={userInfo}/>
   </>
   )
   }

    

  </>
  )
}

export default BlogDetails