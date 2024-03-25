const ConnectionRequestModel = require("../model/ConnectionRequestModel");
const mongoose = require("mongoose");
const UserModel = require("../model/userModel");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const {db} = require("../config/firebase")

//controller here
//add new request here

const addNewConnectionRequest = asyncErrorHandler(async (req,res)=>{

    const {sender,receiver} = req.body;
    
    const senderId = new mongoose.Types.ObjectId(sender);
    const receiverId = new mongoose.Types.ObjectId(receiver);
   
    //to check if connection request is aldready sent

    const conn_request = await ConnectionRequestModel.findOne({
        sender: senderId,
        reciever: receiverId,
        status: 'pending'
    }) 
    if(conn_request){
        res.status(400).json({message: 'Connection request sent aldready'});
        return;
    }
    
    
    const request = await ConnectionRequestModel.create({
        sender: senderId,
        reciever: receiverId

    })
    
    console.log(request);

    res.status(200).json({
        success: true,
        message: "connection request sent successfully"
    })

})

/*controller to create chat room in firestore once the author accepts chat request,so that the author and user
can then start chatting
*/

const createChatRoom = async(user_one,user_two)=>{
      
    const chats = db.collection('chats');

    const new_chat = await chats.add({
        participants: [user_one,user_two],
        messages: [],
    })
    console.log(new_chat.id);
    const senderObj = {
      userId: new mongoose.Types.ObjectId(user_one),
     firebaseId: new_chat.id,
    }

    const recieverObj = {
         userId: new mongoose.Types.ObjectId(user_two),
         firebaseId: new_chat.id
     }

    
    await UserModel.findByIdAndUpdate(user_one,{$addToSet:{connectionRequests: recieverObj}});
    await UserModel.findByIdAndUpdate(user_two,{$addToSet:{connectionRequests: senderObj}});
 }

const fetchPendingRequests = asyncErrorHandler(async(req,res)=>{
    

    const {authorId} = req.query;
   // console.log(authorId)
    const author = new mongoose.Types.ObjectId(authorId);
    const pending_requests = await ConnectionRequestModel.find({
        reciever: author,
        status: 'pending',
    }).populate({
        path: 'sender',
        select: 'username',
    })
    //console.log(pending_requests);
    //console.log(pending_requests);
    res.status(200).json({
        success: true,
        pending_requests: pending_requests
    })
})

//fetch accepted connection requests 
const fetchAcceptedConnectionRequests = asyncErrorHandler(async(req,res)=>{

    const{user_id} = req.query;
    const user = await UserModel.findById(user_id).populate({
        path: 'connectionRequests.userId',
        model: 'users',
        select: 'username',
    })
    
    const accepted_users = user.connectionRequests.map((request)=>({"username": request.userId.username,
    "user_id":request.userId._id,"firebaseId":request.firebaseId}));
    //console.log(accepted_users);

    // console.log(user);
    
    res.status(200).json({
        success: true,
        accepted_users: accepted_users
    })

})

//controller to accept connection request;
const acceptConnectionRequest = asyncErrorHandler(async(req,res)=>{
    
    const {connection_id} = req.query;
    const connection = new mongoose.Types.ObjectId(connection_id);

    const request = await ConnectionRequestModel.findByIdAndUpdate(connection,{status: "accepted"},{new: true});

    // await UserModel.findByIdAndUpdate(request.sender,{$addToSet:{connectionRequests: request.reciever}});
    // await UserModel.findByIdAndUpdate(request.reciever,{$addToSet:{connectionRequests: request.sender}});
    
    createChatRoom(request.sender.toString(),request.reciever.toString())
    .then(async()=>{
        const user = await UserModel.findById(request.reciever).populate({
            path: 'connectionRequests.userId',
            model: 'users',
            select: 'username',
        })
        //console.log(user);
        const connObj = user.connectionRequests.find((req)=> req.userId._id.toString() === request.sender.toString());
        //console.log(connObj);
        if(connObj){
            res.status(200).json({
                success: true,
                connObj: {"username":connObj.userId.username,"user_id":connObj.userId._id,"firebaseId":connObj.firebaseId}
            })
        }
    })

    
})

const denyConnectionRequest = asyncErrorHandler(async(req,res)=>{

    const {connection_id} = req.query;

    await ConnectionRequestModel.findByIdAndDelete(connection_id);
    res.status(200).json({
        success: true,
    })
})

//controller to check if User is connected to an Author

const checkForUserConnectionToAuthor = asyncErrorHandler(async(req,res)=>{
    const{userId,authorId} = req.query;
    //console.log(userId,authorId);
    const user_Obj = await UserModel.findById(userId);
    //console.log(user_Obj)
    let connObj;
    if(user_Obj){
        connObj = user_Obj.connectionRequests.find(conn => conn.userId.toString() === authorId);
    }

    res.status(200).json({
        conn_info: connObj===undefined?null:connObj,
    })

})

const checkforPendingConnectionRequest = asyncErrorHandler(async(req,res)=>{

    const {senderId,receiverId} = req.query;
    const conn_request = await ConnectionRequestModel.findOne({
        sender: senderId,
        reciever: receiverId,
        status: 'pending'
    }) 
    console.log(senderId,receiverId);
    res.status(200).json({
        success: conn_request?true:false,
    })
})

module.exports = 
{
addNewConnectionRequest,
fetchPendingRequests,
acceptConnectionRequest,
denyConnectionRequest,
fetchAcceptedConnectionRequests,
checkForUserConnectionToAuthor,
checkforPendingConnectionRequest,
};