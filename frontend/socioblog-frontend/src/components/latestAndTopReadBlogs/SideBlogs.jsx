import React, { useEffect, useState } from 'react'
import axios from "axios";
import SingleSideBlog from './SingleSideBlog';

function SideBlogs() {
   
    axios.defaults.withCredentials = true;
    const[topic,setTopic] = useState('latest');
    const[blogs,setBlogs] = useState([]);

    useEffect(()=>{
        fetchBlogs("latest");
    },[]);

    const changeTopic = (topicName)=>{
        
        if(topic === topicName){
            return;
        }
        else if(topicName === "latest"){
            setTopic("latest");
            fetchBlogs("latest");
        }
        else{
            setTopic("Top Reads")
            fetchBlogs("topread");
        }
    }

    const fetchBlogs = async(name)=>{
        console.log(name);
        const url = `http://localhost:3000/blogs/${name}-blogs`;
        try {
             
            const latestBlogs = (await axios.get(url)).data.latestBlogs;
            setBlogs([...latestBlogs]);
            setTopic(name==="latest"?"latest":"Top Reads");
            
        } catch (error) {
            alert(error);
            return;
        }
    }

  return (
    <div className='w-[40%]'>
      <div className='flex items-center cursor-pointer'>
         <div>
         <h3 className={`font-poppins font-semibold text-lg `} onClick={()=>changeTopic("latest")}>Latest</h3>
          <div className={`w-14 h-1 ${topic==="latest"?'bg-gray-800':"bg-transparent"}`}></div>
         </div>
         <div className='ml-5 cursor-pointer'>
         <h3 className={`font-poppins font-semibold text-lg`} onClick={()=>changeTopic("Top Reads")}>Top Reads</h3>
         <div className={`w-24 h-1 ${topic==="Top Reads"?'bg-gray-800':"bg-transparent"}`}></div>
         </div>
      </div>
      <div className='p-6'>
        {
            blogs.map((blog)=>{
                return(
                <div key={blog.blog_id} className='my-4'>
                <SingleSideBlog 
                blog_id={blog.blog_id} 
                title={blog.title} 
                image={blog.image} 
                createdAt={blog.createdAt}/>
                </div>
                )
            })
        }
      </div>
    </div>
  )
}

export default SideBlogs