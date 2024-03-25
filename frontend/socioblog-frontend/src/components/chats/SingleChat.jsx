import { Avatar } from '@mui/material'
import { useSelector } from 'react-redux'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import React,{useState} from 'react'
import { useParams } from 'react-router-dom';
import db from '../../firebase';
import {doc,updateDoc,arrayRemove} from 'firebase/firestore'

function SingleChat({messageObj}) {
  
  const user = useSelector(state => state.users.user);
  const time = new Date(messageObj.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const [anchorEl, setAnchorEl] = useState(null);
  const{chatId} = useParams();
  const open = Boolean(anchorEl);
    const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
    setAnchorEl(null);
  };
  
  const deleteChat = async()=>{

    const docRef = doc(db,"chats",chatId);
    await updateDoc(docRef,{
      "messages": arrayRemove(messageObj),
    })
    .catch((err)=>{
      alert("error");
      return;
    })

  }
  return (
    // <div className={`w-full flex items-center my-2 `}>
    //     <Avatar alt='S' sx={{width:30,height:30}}/>
    //   <div className='w-[300px] p-2 bg-white rounded-md'>
    //     <p className='font-poppins text-sm'>{messageObj.content}</p>
    //   </div>
    // </div>
    <>
      {
          user.user_id === messageObj.userId?(
          <div className="w-full flex items-center my-2 justify-end">
             <div className='w-[300px] mr-2 p-1 bg-[#DCF8C6] rounded-md relative'>
             <p className='font-poppins text-[14px] mb-2'>{messageObj.content}</p>
            <span className='absolute bottom-1 right-3 text-[10px]'>{time}
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
               <h3 className='text-red-500 p-3 cursor-pointer' onClick={deleteChat}>delete chat</h3>
              </Menu>
            </span>
            </div>

             <Avatar src={messageObj.username[0]} alt={messageObj.username[0]} sx={{width:30,height:30,bgcolor:"#FF7871"}}/>
         </div>
          ):(
            <div className="w-full flex items-center my-2">
              <Avatar src={messageObj.username[0]} alt={messageObj.username[0]} sx={{width:30,height:30,bgcolor:"#FF7871"}}/>
                <div className='w-[300px] ml-2 p-1 bg-white rounded-md relative'>
                <p className='font-poppins text-[14px] pb-2'>{messageObj.content}</p>
                <span className='absolute bottom-1 right-3 text-[10px]'>{time}</span>
                </div>
            </div>
          )
      }
    </>
  
  )
}

export default SingleChat