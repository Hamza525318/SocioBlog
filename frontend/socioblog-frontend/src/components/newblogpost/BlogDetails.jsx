import React, { useEffect } from 'react'
import ReactQuill from 'react-quill';
import axios from 'axios'
import { useState,useRef } from 'react';
import {useSelector} from "react-redux"
import 'react-quill/dist/quill.snow.css';
import { nanoid } from '@reduxjs/toolkit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {BsFillPlusCircleFill} from "react-icons/bs"
import { json, useNavigate } from 'react-router-dom';
import { ImCross } from "react-icons/im";
import Tooltip from '@mui/material/Tooltip';
import CloseIcon from '@mui/icons-material/Close';
import SingleAlertMessage from '../alertMessages/SingleAlertMessage';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';
import module from './toolbar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function BlogDetails() {

  const [blogText, setBlogText] = useState('');
  const [isClicked,setisClicked] = useState(false);
  const [title,setTitle] = useState('');
  const [category,setCategory] = useState('');
  const [imagename,setImageName] = useState("");
  // const [modalOpen,setModalOpen] = useState("");
  // const [modalMessage,setModalMessage] = useState("");
  const [categoryTags,setCategoryTags] = useState([]);
  const [savedBlogs,setSavedBlogs] = useState([]);
  const [loading,setLoading] = useState(false);
  const [open,setOpen] = useState(false);
  const [message,setMessage] = useState("");
  const [dialogOpen,setDialogOpen] = useState(false);
  let fileInputRef = useRef(null);
  const user_id = useSelector(state => state.users.user.user_id);
  const username = useSelector(state => state.users.user.username);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  // const toolBarOptions = [

  //   ['bold', 'italic', 'underline', 'strike'],   
  //   ['blockquote', 'code-block'],
  //   ['link','image'],
  //   [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //   [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  // ]

  // const module = {
  //   toolbar: toolBarOptions,
  // }
  
  useEffect(()=>{
    if(user_id){
      fetchAldreadySavedBlogs();
    }
  },[user_id])
  
  const handleFileButtonClick = () => {
      fileInputRef.current.click();
  };
  
  const convertBase64 = (file)=>{
     
      return new Promise((resolve,reject)=>{
          const filereader = new FileReader();
          filereader.readAsDataURL(file);

          filereader.onload = ()=>{
            resolve(filereader.result)
          }

          filereader.onerror = (error)=>{
            setisClicked(false);
             reject(error);
          }
      })
  }

  const publishBlog = async(e)=>{
        
      e.preventDefault();
      setisClicked(true);
      if(blogText.length <= 0){

        setMessage("BLOG SECTION CANNOT BE EMPTY PLEASE FILL CONTENT");
        setOpen(true);
        setisClicked(false);
        return;
      }
      if(categoryTags.length == 0){
        setMessage("Please add atleast one category relevant to your blog");
        setOpen(true);
        setisClicked(false);
        return;
      }
      const files = fileInputRef.current.files;
      // console.log(fileInputRef.current.files);
      // let base64;
      // if(files[0]){

      //    base64 = await convertBase64(files[0]).catch((err)=>{
      //      setMessage(err);
      //    })

      // }
       
      const url = "http://localhost:3000/blogs/newblog";
      // const data = {
      //   "id": nanoid(),
      //   "category": categoryTags,
      //   "title": title,
      //   "blog_content": blogText,
      //   "blog_image": base64?base64:null,
      //   "user_id":user_id,
      // }
      const formData = new FormData();
      formData.append("title",title);
      formData.append("category",categoryTags);
      formData.append("blog_content",blogText);
      if(fileInputRef && fileInputRef.current.files && files[0]){
        console.log(files[0]);
        formData.append("file",files[0]);
      }
      else{
        formData.append("file",null)
      }
      formData.append("user_id",user_id);

      try{
        
        const respone = await axios.post(url,formData).
        then(()=>{
          setMessage("Blog posted successfully 😄")
          setOpen(true);
          setisClicked(false);
          setBlogText("");
          setCategory("");
          setTitle("");
          setCategoryTags([]);
        });
      }
      catch(err){
        const response = err.response;
        setMessage("There was some error while publishing..please try again later!!!");
        setOpen(true);
        setisClicked(false);
        return;
      }

  }
  
  const updateFileName = (e)=>{
    console.log(e.target.files);
    setImageName(e.target.files[0].name);
  }

  const removeFileName = ()=>{
      if(fileInputRef && fileInputRef.current.files && fileInputRef.current.files[0]){
        fileInputRef.current.value = null;
        setImageName("");
      }
  }

  const handleModalClose = ()=>{
       setModalOpen(false);
       navigate("/",{replace:true})
  }


  const addTopicTag = (e)=>{
      
    e.preventDefault();
      if(category){
         setCategoryTags([...categoryTags,category]);
         setCategory(" ");
      }
  }

  const removeTopicTag = (index)=>{
      categoryTags.splice(index,1);
      setCategoryTags([...categoryTags]);
  }

  //function to save blog for editing or writing it later

  const saveBlogForLaterUse = (e)=>{
    e.preventDefault();
     if(!title && categoryTags.length == 0 && !blogText){
        setMessage("Empty blog cannot be saved...Please provide the title atleast");
        setOpen(true);
        return;
      }

     else if(!title){
      setOpen(true);
      setMessage("please provide a title to save your blog")
     }
     console.log(JSON.stringify(fileInputRef.current.files[0]));
     const blogObj = {
      "title": title,
      "categoryTags": categoryTags,
      "blogText": blogText,
      "index": `${savedBlogs.length}`,
      // "fileObj": fileInputRef.current.files[0]?JSON.stringify(fileInputRef.current.files[0]):"",
      // "file_name": fileInputRef.current.files[0]?fileInputRef.current.files[0].name:"",
    }
    
    savedBlogs.push(JSON.stringify(blogObj));
    localStorage.setItem("saved_blogs",JSON.stringify(savedBlogs));
    setMessage("Saved Blog successfully...feel free to comeback and start again from where you left off");
    setOpen(true);
    setSavedBlogs([...savedBlogs]);
    removeFileName();
    updateSavedBlogToDB(blogObj);
  }

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const fetchAldreadySavedBlogs = ()=>{
     if(localStorage.getItem("saved_blogs")){
        const savedblogs = JSON.parse(localStorage.getItem("saved_blogs"));
        console.log(savedblogs);
        setSavedBlogs([...savedblogs]);
     }
     else{
      fetchSavedBlogsfromDB();
     }
  }

  const loadBlogContentBack = ({title,categoryTags,blogText,fileObj,file_name})=>{
    console.log(categoryTags);
    setCategoryTags([...categoryTags]);
    setTitle(title);
    setBlogText(blogText);
    setDialogOpen(false);
    // if(fileObj){
    //   fileInputRef.current.files[0] = fileObj
    // }
    // if(file_name){
    //   setImageName(fileObj.name);
    // }

  }

  const deleteSavedBlog = (index)=>{
      savedBlogs.splice(index,1);
      setSavedBlogs([...savedBlogs]);
      localStorage.setItem("saved_blogs",JSON.stringify(savedBlogs));
      deleteSavedBlogfromDB(index,user_id);
  }

  const fetchSavedBlogsfromDB = async()=>{

    if(user_id){
     const url = `http://localhost:3000/user/fetch-saved-blogs?userId=${user_id}`
     
     try {
      const data = (await axios.get(url)).data;
      setSavedBlogs([...data.saved_blogs]);
      localStorage.setItem("saved_blogs",JSON.stringify(data.saved_blogs))
     } catch (error) {
       alert("There was a problem fetching Saved blogs");
       return;
     }
    }
  }

  const updateSavedBlogToDB = async(blogObj)=>{
     const url = "http://localhost:3000/user/save-blog"
     const data = {"blogObj": blogObj,"userId":user_id};

     try {
       await axios.put(url,data)
     } catch (error) {
       alert('there was some problem saving the blog to database..please try again later');
       return;
     }
  }

  const deleteSavedBlogfromDB = async(index,user_id)=>{
     const url = `http://localhost:3000/user/delete-saved-blog?index=${index}&userId=${user_id}`
    try {
      await axios.delete(url);
    } catch (error) {
      alert(error);
      return;
    }
  }

  const generateBlogTags = async()=>{
       
    const tempElement = document.createElement('div');
    tempElement.innerHTML = blogText;
    const text = tempElement.innerText;
    text.trim();

    if(!text){
      alert("Cannot generate tags for empty content");
      return;
    }

    setLoading(true);
    const url = 'http://localhost:3000/blogs/suggest-tags'
    const data = {blog_content: text,username: username}

    try {
      const blog_tags = (await axios.post(url,data)).data.blog_tags;
      setLoading(false);
      setCategoryTags([...categoryTags,...blog_tags,]);
  

    } catch (error) {
      setLoading(false);
      alert(error);
      return;
    }
  }
   
  console.log(blogText);
  return (
    <section className='w-screen'>
      <div className='w-screen flex justify-end'>
        
         <Tooltip title="saved blogs">
          <div className='w-8 h-8 rounded-full bg-reddish-orange mr-8 mt-2 flex items-center justify-center'>
            <BookmarkIcon onClick={handleClickOpen} className='text-white'/>
          </div>
         </Tooltip>
      </div>
      <Dialog
        fullScreen
        open={dialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative',bgcolor:"#FF7871" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
             Saved Blogs
            </Typography>
          </Toolbar>
        </AppBar>
        <List>
          {/* <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItemButton> */}
          {
            savedBlogs.length > 0?(
             savedBlogs.map((savedBlog,index)=>{
               const blogObj = JSON.parse(savedBlog)
                return(
                  <>
                   <div className='w-screen flex justify-between items-center'>
                     <ListItemButton>
                      <ListItemText primary={`(${index+1}) ${blogObj.title}`}/>
                     </ListItemButton>
                     <div className='flex items-center w-[200px] mr-8'>
                     <button className='text-white bg-teal-500 py-1 px-5 rounded-lg' 
                     onClick={()=>loadBlogContentBack(blogObj)}>continue writing</button>
                     <Tooltip title="delete blog">
                     <DeleteIcon onClick={()=>deleteSavedBlog(index)} className='text-teal-500 ml-2' fontSize='medium'/>
                     </Tooltip>
                     </div>
                   </div>
                   <div className='w-screen mt-2'>
                      <Divider/>
                   </div>
                  </>
                )
             })
            ):(
              <h1 className='text-center text-lg mt-[10%] font-poppins font-bold'>You have not saved any blogs yet!!</h1>
            )
          }
         
        </List>
      </Dialog>
      <div>
          <h1 className='text-center text-2xl font-bold font-poppins mt-4 mb-8'>Unleash Your Creativity: Share Your Story with the World 🌏</h1>
          <div className='w-full flex justify-center'>

          <form> 
             
             <div className='flex flex-col my-2'>
                  <label className='text-lg font-medium font-poppins mt-3'>Title for your blog:</label>
                  <input type='text' required value={title}  onChange={(e)=>setTitle(e.target.value)}
                  className='border-2 border-gray-500 py-1 my-2 w-[500px]' 
                  placeholder='title should be atleast 5 characters long'/>
             </div>

             <div className='flex flex-col my-5'>
                  <label>
                    <span className='text-lg font-medium font-poppins mt-4'>Image (optional):</span>
                    <BsFillPlusCircleFill onClick={handleFileButtonClick} style={{"color":"#FF7871","marginTop":"4px"}} size={30}/>
                  </label>
                <input 
                     type='file' 
                     style={{"display":"none"}} 
                     ref={fileInputRef} 
                     name='file'
                     onChange={updateFileName}
                     accept=".jpeg, .jpg, .png, image/jpeg, image/png"
                />
                { imagename &&
                  <div className=' mt-2 p-1 flex items-center'>
                   <p>{imagename}</p>
                   <ImCross onClick={removeFileName} className='text-reddish-orange ml-2'/>
                  </div>
                }
             </div>
             <div className='flex items-center'>
             <div className='flex flex-col'>
                <label className='text-lg font-medium font-poppins mt-3'>Blog Category</label>
                <input type='text' 
                  className='border-2 border-gray-500 py-1 my-2 w-[500px]' 
                  placeholder='add topics relevant to your blog post ex food,tech etc'
                  required
                  value={category}
                   onChange={(e)=>setCategory(e.target.value)}
                />
             </div>

             <div>
              <button className='bg-reddish-orange text-white w-20 py-1 mt-9 ml-4 rounded-xl font-poppins'
              onClick={addTopicTag}>Add tag</button>
             </div>
             <div>
             <button className='bg-reddish-orange text-white w-40 py-1 mt-9 ml-4 rounded-xl font-poppins'
              onClick={generateBlogTags}>generate blog tags</button>
             </div>
             </div>
              
            {
              loading && <div><p className='text-lg font-semibold font-roboto'>Loading tags....</p></div>
            }
             {
                <div className='flex my-3'>
                  {
                     categoryTags.map((category,index)=>{
                        return(
                           <button className='py-1 px-3 mx-1 my-2 bg-slate-300 rounded-2xl text-black'>{category}
                           <CloseIcon onClick={()=>removeTopicTag(index)} fontSize='small'/>
                           </button>
                        )
                     })
                  }

                </div>
             }


              {/* Text editor*/}
              
              <ReactQuill modules={module}  theme="snow" value={blogText} onChange={setBlogText}  style={{"width":"70vw","height":"800px","marginTop":"48px","border":"2px solid gray","borderRadius":"16px" ,"scrollbarWidth":"none"}}/>
             <div className='w-full flex justify-center'>
               <button onClick={publishBlog} disabled={isClicked} className='bg-reddish-orange my-10 py-2 w-[200px] rounded-xl text-white font-medium'>Publish Blog</button>
              <button onClick={saveBlogForLaterUse} className='bg-reddish-orange my-10 py-2 w-[200px] rounded-xl text-white font-medium ml-4'>
                Save for later
              </button>
             </div>
             {/* {
                savedBlogs.map((savedBlog)=>{
                   return(
                     <h1>{savedBlog}</h1>
                   )
                })
             } */}
             </form>
          </div>
        </div>
        {/* Modal to show an error message if blog is not posted else to show success message when blog is posted successfully*/}
        {
          open === true && <SingleAlertMessage open={true} setOpen={setOpen} message={message}/>
        }
    </section>
  )
}

export default BlogDetails