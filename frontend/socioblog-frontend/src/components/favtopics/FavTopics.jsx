import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { updateFavouriteTopics } from '../../features/user/userSlice';
import {useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';

function FavTopics() {
    

    axios.defaults.withCredentials = true;
    const user = useSelector(state => state.users.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const[open,setOpen] = useState(false);
    const[displayMessage,setDisplayMessage] = useState("");
    const [favtopics,setFavTopics] = useState([...user.favTopics]);
    const topics = ["Programming","Data science","Technology","Self Improvement","Writing","Relationships","Machine Learning","Productivity","Politics","Cryptocurrency","Psychology","Money","Business","Python","Health","Science","Mental Health","Life","Software Development","Startup","Design","Javascript","Artificial Intelligence","Culture","Software Engineering","Blockchain","Coding","Entrepreneurship","React","UX","Education","History","Work","Lifestyle","Android","Apple","Woman","Mindfullness"];
    const[clickedButtons,setClickedButtons] = useState(new Array(topics.length).fill(false));

    useEffect(()=>{
       updateInitialSelectedTopics();
    },[])

    const handleClickOpen = ()=>{
        setOpen(true);
    }
    
    const handleClose = ()=>{
        setOpen(false);
        navigate("http://localhost:5173/",{replace: true});
    }
    
    const addUserFavouriteTopics = async()=>{

        const url = "http://localhost:3000/user/add-fav-topics"
        const data = {"topics":favtopics,"userId":user.user_id};
        try {
            await axios.post(url,data);
            dispatch(updateFavouriteTopics({favTopics: [...favtopics]}))
            setDisplayMessage("Favourite topics updated successfully 🤭");
            handleClickOpen();
        } catch (error) {
            alert(error);
            return;
        }
    }

    const addFavItem = (e,i)=>{
        setFavTopics([...favtopics,e.target.value]);
        clickedButtons[i] = true;
        setClickedButtons([...clickedButtons]);
        //console.log(favtopics);
    }

    const removeFavItem = (e,i)=>{

        for(let i=0;i<favtopics.length;i++){
            if(favtopics[i] === e.target.value){
                console.log(favtopics[i]);
                favtopics.splice(i,1);
            }
        }

        setFavTopics([...favtopics]);
        clickedButtons[i] = false;
        setClickedButtons([...clickedButtons]);
    }

    const updateInitialSelectedTopics = ()=>{
        
        topics.forEach((ele,i)=>{
            if(favtopics.includes(ele)){
                clickedButtons[i] = true;
                setClickedButtons([...clickedButtons]);
            }
        })
    }

    return (
    <div className='my-4 w-full flex justify-center'>
        <div className='w-[650px] p-3'>
            <div className='flex flex-wrap'>
                {   
                    topics.map((topic,i)=>{
                        return(
                            clickedButtons[i] === true?(
                                <button value={topic} key={i} className='py-1 px-2 mx-1 my-2 bg-white rounded-2xl text-green-500 border border-green-500' onClick={(e)=>removeFavItem(e,i)}>{topic}</button>
                            ):(
                                <button value={topic} key={i} onClick={(e)=>addFavItem(e,i)} className='py-1 px-2 mx-1 my-2 bg-gray-200 rounded-2xl text-black'>{topic}+</button>
                            )
                        )
                    })
                }
            </div>
            <div className='w-[550px] flex justify-center'>
                {
                    favtopics.length >= 3?(
                        <button onClick={addUserFavouriteTopics}  className='w-[200px] py-2 my-6  rounded-2xl bg-green-500 text-white' >Continue</button>
                    ):(
                        <button  className='w-[200px] py-2 my-6 border-[1px] border-black rounded-2xl bg-white text-black' disabled >Continue</button>
                    )
                }
                <button className='w-[200px] py-2 ml-3 my-6 rounded-2xl bg-slate-600 text-white'>Back to home</button>
            </div>
        </div>

        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
           <p className='text-center text-lg font-poppins py-3 font-semibold'>{displayMessage}</p>
        </DialogTitle>
        <DialogContent>
            <div className='w-full text-center'>
             <button className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
              <Link to='/user/login'>OK</Link>
             </button>
            </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default FavTopics