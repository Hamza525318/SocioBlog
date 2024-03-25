import { MdAccountCircle } from "react-icons/md";
import { Link,NavLink, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import GroupsIcon from '@mui/icons-material/Groups';
import { IoCloseCircle } from "react-icons/io5";
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import  ListItemIcon  from "@mui/material/ListItemIcon";
import PersonAdd from '@mui/icons-material/PersonAdd';
import Logout from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useEffect, useState } from "react";
import { logOutUser} from "../features/user/userSlice";
import { useSelector,useDispatch } from "react-redux";
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExploreIcon from '@mui/icons-material/Explore';
import SearchIcon from '@mui/icons-material/Search';
import { incrementRealTimeLike } from "../features/user/userSlice";




function Navbar(){
    //dont use a tag while working with react becauses it causes page refresh instead work with react router dom
    axios.defaults.withCredentials = true;
    const dispatch = useDispatch();
    const [navOpen,setNavOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchInput,setSearchInput] = useState("");
    const[logoutMessage,setLogoutMessage] = useState("")
    const[modalOpen,setModalOpen] = useState(false);
    const navigate = useNavigate();
    const socket = useSelector(state => state.users.user.socket);
    //console.log(socket);
    const links = [{name:"Home",to:"/"},{name:"myblogs",to:"/myblogs"},{name:"write-a-blog",to:"/write-a-blog"}];
    const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    };
    const firstVisitVerify = useSelector(state => state.users.user.verifyUser);
    const username = useSelector(state => state.users.user.username);
    const user = useSelector(state => state.users.user);
    const rt_likes = useSelector(state=> state.users.user.realtime_likes);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleNavopen = ()=>{
       
      let isOpen = !navOpen;
      setNavOpen(isOpen);
    }

    // useEffect(()=>{
      
    //    if(Object.keys(socket).length >0){
    //        console.log("registering event");
    //        socket.on('likedPost',({message})=>{
    //         console.log(message);
    //         dispatch(incrementRealTimeLike());
    //      })
    //    }
      
    // },[Object.keys(socket).length]);

    const logoutUser = async()=>{

       handleClose()
       const url = "http://localhost:3000/user/logout"

       try {
          await axios.get(url);
          setLogoutMessage("Keep the stories coming. Log in for more blogging adventures!");
          setModalOpen(true);
          socket.emit('userLogOut',{user_id:user.user_id})
          dispatch(logOutUser());

       } catch (error) {
          setLogoutMessage("There is some error signing out...please try again later!!!");
          setModalOpen(true);
       }
    }

    const navigateToSearchPage = ()=>{
      navigate(`/search/${searchInput}`,{replace: true});
      setSearchInput("");
    }
    
    return (
        <nav className= "w-screen text-white bg-reddish-orange h-17 sm:h-12 overflow-y-hidden flex justify-between items-center border-b p-2  sm:p-8">
         <div className="flex items-center">
         <h1 className="p-1 text-md sm:p-3 font-bold text-3xl">SocioBlog</h1>
          <div className="w-[220px] h-8 flex items-center bg-white text-black ml-10 rounded-xl">
            <input className="w-[90%] h-8 outline-none" type="text" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)}/>
            {
              searchInput.length >= 3?(
                <Link to={`/search/${searchInput}`}>
                  <SearchIcon className="z-10" onClick={()=>setSearchInput("")}/>
                </Link>
              ):(
                <SearchIcon className="text-gray-400"/>
              )
            }
            
          </div>
         </div>
         <div className="flex items-center">
         <div className="hidden sm:flex mr-10 items-center">
            {links.map((item,index)=>(
              <NavLink 
              key = {index}
              to={item.to} 
              className="mx-4" 
              style= {({ isActive }) => ({
               textDecoration: isActive ? "underline" : "" ,
               fontWeight: isActive? "600":"",
              })}>{item.name}</NavLink>
            ))}
           </div>
           <Link to="http://localhost:5173/like-notifications" className="mr-3"><NotificationsIcon/></Link>
            <div className="w-[20px]">
             {
               rt_likes > 0 && <p className="text-[12px] absolute top-3 right-[75px] px-1 rounded-sm bg-white text-reddish-orange">{rt_likes}</p>
             }
           </div>
          <GiHamburgerMenu onClick={()=>setNavOpen(!navOpen)} className="sm:hidden"/>
          {
               
               navOpen && 
                <div className="absolute top-0 right-0 h-screen w-80 z-50 bg-white sm:hidden">
                   <IoCloseCircle  onClick={()=>setNavOpen(!navOpen)}  size={30} className="text-reddish-orange float-right m-4"/>
                   <div className="flex flex-col my-8">
                  {links.map((item,index)=>(
                   <NavLink 
                   key = {index}
                   to={item.to} 
                   className="mx-4 text-reddish-orange my-4 text-lg" 
                   style= {({ isActive }) => ({
                   textDecoration: isActive ? "underline" : "" ,
                   fontWeight: isActive? "600":"",
              })}>{item.name}</NavLink>
            ))}
           
          </div>
                </div>
                         
          }
          <div className="w-10 cursor-pointer">
          <MdAccountCircle  size={35} className="cursor-pointer" onClick={toggleMenu}/>
          </div>
          {
            menuOpen && 
            <div>
             {
               username ? (
                <div onClick={toggleMenu} className="p-2 absolute top-10 right-3 w-[200px] h-[180px] shadow-md bg-white text-black rounded-lg font-poppins mx-auto">
               <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <AccountCircleIcon fontSize="medium"/>
                </ListItemIcon>
                  {username}
                 </MenuItem>
                <MenuItem onClick={logoutUser}>
                <ListItemIcon>
                  <Logout fontSize="medium" />
                </ListItemIcon>
                Logout
                </MenuItem>
                <MenuItem>
                <ListItemIcon>
                  <ExploreIcon fontSize="medium" />
                </ListItemIcon>
                 <Link to="http://localhost:5173/getting-started/topics">explore topics</Link>
                </MenuItem>
                <MenuItem>
                 <ListItemIcon>
                  <GroupsIcon fontSize="medium"/>
                 </ListItemIcon>
                 <Link to="http://localhost:5173/my-people">Connections</Link>
                </MenuItem>
                
               </div>
              
               ):(
                <div onClick={toggleMenu} className="p-2 absolute top-10 right-3 w-[200px] h-[100px] shadow-md bg-white text-black rounded-lg font-poppins mx-auto">
                <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <PersonAdd fontSize="medium" />
                </ListItemIcon>
                <Link to="http://localhost:5173/user/signup">Create Account</Link> 
                 </MenuItem>
                 
                 <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LoginIcon fontSize="medium" />
                </ListItemIcon>
                  <Link to="http://localhost:5173/user/login">Login</Link> 
                 </MenuItem>
                </div>
               )
             }
            </div>
          }
          
          </div>
          <Dialog
             open={modalOpen}
             onClose={()=>setModalOpen(false)}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
             sx={{zIndex:99999}}
             >
            <DialogTitle id="alert-dialog-title">
              <p className='text-center text-lg font-poppins py-3 font-semibold'>{logoutMessage}</p>
            </DialogTitle>
             <DialogContent>
            <div className='w-full text-center'>
             <button onClick={()=>setModalOpen(false)} className='px-12 py-2  bg-cyan-600 rounded-full text-white text-base font-poppins'>
              OK
             </button>
            </div>
             </DialogContent>
           </Dialog>
        </nav>
    )
}

export default Navbar