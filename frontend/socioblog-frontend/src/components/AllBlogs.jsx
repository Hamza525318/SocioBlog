import React, { useEffect, useState } from 'react'
import { updateIsFetched,updateAllBlogs } from '../features/blogs/blogSlice';
import "./AllBlogs.css"
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { useSelector ,useDispatch} from 'react-redux'
import SingleBlogBox from './SingleBlogBox';
import SingleBlog from './SingleBlog';
import Loading from './loadingpage/Loading';
import { updateBlogClickCount } from "../features/blogs/blogSlice";

function AllBlogs(){
  
  const dispatch = useDispatch();
  const location = useLocation();
  const isBlogsFetched = useSelector(state => state.blogs.blogsFetched);
  let blogClickCount = useSelector(state => state.blogs.blogClickCount);
  const[clickCount,setClickCount] = useState(blogClickCount);
  const[isClicked,setIsClicked] = useState(false);
  const [blogPosts,setBlogPosts] = useState([]);
  let allBlogPosts = useSelector(state=> state.blogs.allBlogs);
  const[loading,setLoading] = useState(allBlogPosts.length>0?false:true);
  const user = useSelector(state=>state.users.user)
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  
   
  useEffect(()=>{
     
     if(!isBlogsFetched){
        fetchAllBlogs();
        dispatch(updateIsFetched());
     }
  },[])

  // useEffect(()=>{
  //   fetchAllBlogs();
  // },[])

  // useEffect(()=>{

  //   if(category != null){
  //     fetchBlogsByCategory(category);
  //   }

  // },[category])
   
  // const fetchAllBlogs = async ()=>{

  //   const url = "http://localhost:3000/blogs/";

  //   try{
           
  //     const blogs = (await axios.get(url)).data.blogPosts;
  //     allBlogPosts = blogs;
  //     dispatch(updateAllBlogs({"blogs":blogs}));
          
  //   }catch(error){
  //     alert(error);
  //     return;
  //   }
  // }

  const fetchAllBlogs = async()=>{
      const url = `http://localhost:3000/blogs/?pagecount=${blogClickCount}`
      try {

        const blogs = (await axios.get(url)).data.blogs;
        dispatch(updateAllBlogs({"blogs":blogs}));
        setLoading(false);

        
      } catch (error) {
        alert(error);

        return;
      }
  }

  const fetchAllBlogsOnClick = async()=>{
    dispatch(updateBlogClickCount())
    const url = `http://localhost:3000/blogs/?pagecount=${blogClickCount+1}`
    try {

      const blogs = (await axios.get(url)).data.blogs;
      dispatch(updateAllBlogs({"blogs":blogs}));
      setLoading(false);
      setIsClicked(false);
      
    } catch (error) {
      alert(error);
      return;
    }
}

  // const fetchBlogsByCategory = async (category)=>{
       
  //      try {

  //       const url = `http://localhost:3000/blogs/blogs-by-category/?category=${category}`;
  //       const blogs = (await axios.get(url)).data.blogs;
  //       console.log(blogs);
  //       allBlogPosts = blogs;
  //       dispatch(updateAllBlogs({"blogs":blogs}));
        
  //      } catch (error) {

  //          alert(error);
  //          return;
  //      }
  // }
  
  return (
    // <>
    // {
    //    loading === true?(
    //         <Loading/>
    //    ):(

    //     <div className='flex flex-col items-center'>
    //     {
  
    //     allBlogPosts.map((blog)=>{
    //       return(
    //         <div key={blog._id}>
    //         <SingleBlog
    //           blog_id = {blog._id}
    //           title={blog.title} 
    //           content={blog.blog_content} 
    //           image={blog.blog_image} 
    //           createdAt={blog.createdAt}
    //           category = {blog.category}
    //         />
    //         </div>
    //       )
    //      })
        
    //    }

    //   <div>
    //   <button className={isClicked?'bg-reddish-orange hidden text-white px-8 py-1':'bg-reddish-orange text-white px-8 py-1 block'} onClick={fetchAllBlogsOnClick}>Load More</button>
    //   </div>

    // </div>
    // }
    // </>
    <>
      {
         loading === true?(
            <Loading/>
         ):(
            <div className='w-[60%] flex flex-col items-center'>
               {
                  allBlogPosts.map((blog)=>{
                    return(
                  
                  <div key={blog._id}>
                  <SingleBlog
                  blog_id = {blog._id}
                  title={blog.title} 
                  content={blog.blog_content} 
                  image={blog.blog_image} 
                  createdAt={blog.createdAt}
                  category = {blog.category}
                  />
                  </div>
                  )
                    

                  })
               }
             <div>
             <button className={isClicked?'bg-reddish-orange hidden text-white px-8 py-1':'bg-reddish-orange text-white px-8 py-1 block'} onClick={fetchAllBlogsOnClick}>Load More</button>
             </div>
            </div>
         )
      }
    </>
  )
}

export default AllBlogs