import {incrementRealTimeLike,addNewRealtimeLike,addNotifications,addNewConnectionRequest,updateAcceptedConnectionRequests} from "../features/user/userSlice"

export const registerSocketEvent = (socket,dispatch)=>{
      
    console.log("register event");
    socket.on('likedPost',({username,title})=>{
      console.log("likePost event");
      dispatch(incrementRealTimeLike());
      dispatch(addNewRealtimeLike({"username":username,"title":title}));
    })

    socket.on("unreadNotifications",({read,unread,count})=>{
      // console.log("unreadnotifications event");
      // console.log(read);
      // console.log(unread);
      dispatch(addNotifications({"unread_notifications":unread,"unread_likes_count":count}));
    })

    socket.on("connRequestFromUser",(connObj)=>{
        dispatch(addNewConnectionRequest({"connObj":connObj}));
      })

    socket.on("acceptedRequestNotification",(connObj)=>{
        dispatch(updateAcceptedConnectionRequests({"connObj":connObj}));
    })
}