//Server respresents the socketIo server;
const {Server} = require("socket.io");
const blogModel = require("../model/blogModel");
const userModel = require("../model/userModel");
const singleAuthorLikesModel = require("../model/userBlogLikes");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ConnectionRequestModel = require("../model/ConnectionRequestModel");

const updateLikeforAuthor = async (authorId,username,title)=>{
    
    const likeObj = {username: username,title: title,createdAt: Date.now(),isRead: false};
    await singleAuthorLikesModel.findOneAndUpdate({userId: authorId},{$push: {user_likes:likeObj}});
    console.log("update successfully")
}

const findKeyByValueAndRemoveUser = (map,socketId)=>{

    let isFound = false; 
    for(const[key,user_arr] of map.entries()){
       user_arr.forEach((socketObj,i)=>{
           if(socketObj.socketId === socketId){
               if(user_arr.length <= 1){
                  map.delete(key);
                  return;
               }
               else{
                   user_arr.splice(i,1);
                   return;
               }
           }
       })
    }
}

const chechkForAlreadyLike = async(authorId,username,title)=>{

    const author = await singleAuthorLikesModel.findOne({userId: authorId});
    let isFound = false;

    const updated_arr = author.user_likes.map((likeObj)=>{
        if(likeObj.username === username && likeObj.title === title){
            isFound = true;
            return {...likeObj,createdAt:Date.now()};
        }

        return likeObj;
    })

    await singleAuthorLikesModel.findOneAndUpdate({userId:authorId},{$set : {user_likes: updated_arr}});
    
    return new Promise((resolve,reject)=>{
        resolve(isFound);
    })

}


function socketFuncForUpdatedBlog(server){
    //server constructor;
    const map = new Map();
    const io = new Server(server,{
        cors:{
            origin: 'http://localhost:5173',
        }
    })

    io.on('connection',async (socket)=>{
        console.log(`user connected `);
        console.log(socket.id);
        const userId = socket.handshake.query.userId;
        const userObj = 
        {
            username: socket.handshake.query.username,
            socketId: socket.id
        }

        const sendLikeNotificationsToUser = async(userId)=>{
                
         const author = await singleAuthorLikesModel.findOne({userId: userId});
         const read_notifications = [], unread_notifications =[];
         if(author !== null){
         author.user_likes.forEach((likeObj)=>{
            // (likeObj.isRead? read_notifications.push(likeObj):unread_notifications.push(likeObj));
            if(!likeObj.isRead){
                unread_notifications.push(likeObj);
            }
            // else{
            //     const differenceInMilliseconds = Math.abs(likeObj.createdAt - Date.now());
            //     const differenceIndays = differenceInMilliseconds/ (1000 * 60 * 60 * 24);
            //     //console.log(differenceIndays);
            //     if(differenceIndays < 7){
            //         read_notifications.push(likeObj);
            //     }
            // }
         }) 
        }
         socket.emit("unreadNotifications",
            {
            "unread":unread_notifications,
            "count":unread_notifications.length
            }
        );
            console.log("user connected for first time");
        }

        if(!map.has(userId)){
    
         map.set(userId,[userObj]);
         console.log(map);
         await sendLikeNotificationsToUser(userId);   
         
        }
      

        else{
            
            map.get(userId).push(userObj);
            console.log(map);
            await sendLikeNotificationsToUser(userId);
        }
    
        //event when user closes the website or moves away
        socket.on('disconnect',()=>{
            findKeyByValueAndRemoveUser(map,socket.id);
            console.log(map);
            console.log("deleted user");
        })

        //event when user themselves log out of their account;
        socket.on('userLogOut',({user_id})=>{
            if(map.has(user_id)){
                map.delete(user_id);
                console.log(map.size);
            }
        })
        
        socket.on('addConnectionRequest',async({sender,receiver})=>{
            if(map.has(receiver)){
                const pendingObj = await ConnectionRequestModel.findOne({
                    sender: sender,
                    reciever: receiver,
                    status: 'pending',
                }).populate({
                    path: 'sender',
                    select: 'username'
                })
                console.log(pendingObj);
                map.get(receiver).forEach((socketObj)=>{
                    socket.to(socketObj.socketId).emit('connRequestFromUser',pendingObj);
                })
            }
        })

        socket.on("acceptedConnectionRequest",(connObj)=>{

            if(map.has(connObj.sender_id)){
                map.get(connObj.sender_id).forEach((socketObj)=>{
                    socket.to(socketObj.socketId).emit("acceptedRequestNotification",{
                        username: connObj.username,
                        user_id: connObj.user_id,
                        firebaseId: connObj.firebaseId,
                    })
                })
            }
        })

        socket.on('receiveLike',async({authorId,username,title})=>{
            

            await chechkForAlreadyLike(authorId,username,title).then(async(val)=>{
                if(!val){
                    if(map.has(authorId)){

                        map.get(authorId).forEach((socketObj)=>{
                            socket.to(socketObj.socketId).emit('likedPost',{"username":username,"title":title})
                        })
                        // const authorObj = map.get(authorId);
                        // console.log(authorObj.socketId);
                        // socket.to().emit('likedPost',{"username":username,"title":title});
                        const likeObj = {username: username,title: title,createdAt: Date.now(),isRead: false,};
                        await singleAuthorLikesModel.findOneAndUpdate({userId: authorId},{$push: {user_likes:likeObj}});
                        console.log("first time like");
                    }
                    else{
                       updateLikeforAuthor(authorId,username,title);
                    }
                }
            })
           
        })
    })
}

module.exports = socketFuncForUpdatedBlog;
