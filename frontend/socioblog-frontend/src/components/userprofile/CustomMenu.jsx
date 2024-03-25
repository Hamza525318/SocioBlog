import React,{useState} from 'react'
import Menu from '@mui/material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function CustomMenu({anchorEl,open,setAnchorEl,message,blogId}) {

    const[isClicked,setIsClicked] = useState(false);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const copyTextToClipboard = async(url_link)=>{

        if('clipboard' in navigator){
            await navigator.clipboard.writeText(url_link)
            .then(()=>{
                setIsClicked(true);
                setTimeout(()=>{
                   setIsClicked(false);
                },2000)
            })

        }
        else{
            document.execCommand('copy',true,url_link);
        }
    }

  return (
    <div>
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
        <div className='w-[220px]  flex items-center'>
        <h3 className='font-poppins px-2 cursor-pointer' onClick={()=>copyTextToClipboard(blogId?`http:localhost:5173/single-blog/?blog_id=${blogId}`:window.location.href)}>{message}</h3>
        {
            isClicked === true && 
            <CheckCircleIcon fontSize='small' className='text-green-400 ml-2'/>
        }
        </div>
        </Menu>
    </div>
  )
}

export default CustomMenu