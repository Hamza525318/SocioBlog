import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import SingleUserBlog from '../userprofile/SingleUserBlog';
import axios from 'axios';
import SingleUser from './SingleUser';

function SearchBlogs() {
  
    const{topic} = useParams();
    axios.defaults.withCredentials = true;
    const[search,setSearch] = useState('blogs');
    const[blogs,setBlogs] = useState([]);
    const[users,setUsers] = useState([]);
    const[blogs_found,setBlogFound] = useState(true);

    useEffect(()=>{
       
       setBlogs([]);
       setUsers([]);
       if(search === 'blogs'){
        fetchBlogs();
       }
       else{
        fetchUsers();
       }
    },[topic])

    const changeTopic = (category)=>{
        if(search === category){
            return;
        }
        setSearch(category);

        if(category === "blogs"){
            fetchBlogs();
        }
        else{
            fetchUsers();
        }
    }

    const fetchBlogs = async()=>{
        const url = `http://localhost:3000/blogs/search-blogs?search_word=${topic}`;
        console.log(url);
        try {
             
            const blogResults = (await axios.get(url)).data.blogs;
            console.log(blogResults);
            if(blogResults.length == 0){
               setBlogFound(false);
            }
            else{
                setBlogFound(true);
            }
            setBlogs([...blogResults]);
            
        } catch (error) {
            alert(error);
            return;
        }
    }

    const fetchUsers = async()=>{
        const url = `http://localhost:3000/user/search-users?search_user=${topic}`;
        try {
             
            const res = (await axios.get(url)).data.users;
            if(res.length == 0){
               setBlogFound(false);
            }
            else{
                setBlogFound(true);
            }
            setUsers([...res]);
            
        } catch (error) {
            alert(error);
            return;
        }
    }

  return (
    <section className='w-[65%] pt-10 px-16'>

        <div>
            <h1 className='font-poppins text-[32px] font-bold text-gray-500'>Results for 
            <span className='text-[32px] text-black font-bold'> {topic}</span>
            </h1>
        </div>
        <div className='w-full flex items-center mt-6'>
        <div className='cursor-pointer'>
         <h3 className={`font-poppins font-semibold text-lg ${search==="blogs"?'text-black':"text-gray-400"}`} onClick={()=>changeTopic("blogs")}>blogs</h3>
         </div>
         <div className='ml-5 cursor-pointer'>
         <h3 className={`font-poppins font-semibold text-lg  ${search==="people"?'text-black':"text-gray-400"}`} onClick={()=>changeTopic("people")}>people</h3>
         </div>
        </div>

        <div className='w-full h-[1px] bg-gray-400 my-1'></div>

        <div className='w-full'>
        {
            blogs_found === false?(
            <div className='p-5'>
                <p>Make sure all words are spelled correctly.</p>
                <p>Try more general keywords.</p>
                <p>Try different keywords.</p>
            </div>
            ):(
                    search === "blogs"?(
                    blogs.map((blog,index)=>{
                       return(
                         <div key={index}>
                         <SingleUserBlog
                           blog_id = {blog._id} 
                           createdAt={blog.createdAt} 
                           title={blog.title} 
                           content={blog.blog_content}
                           category = {blog.category}
                           blog_image = {blog.blog_image}
                         />
                         </div> 
                       )
                    })
                    ):(
                     users.map((user,index)=>{
                         return(
                             <div key={index} className='w-full'>
                                <SingleUser user_id={user.user_id} username={user.username}/>
                             </div>
                         )
                     })
                    )
                )
            }
       
        </div>
      </section>
  )
}

export default SearchBlogs