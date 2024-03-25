const singleAuthorLikesModel = require("../model/userBlogLikes");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
//function to update unread notification to read notification when the user reads all the messages

const updateUnreadtoReadNotifications = asyncErrorHandler(async (req,res)=>{

    const{userId} = req.query;
    console.log("req came");
    const author = await singleAuthorLikesModel.findOne({userId: userId});
    const updated_likes_arr = author.user_likes.map((likeObj)=>{
        likeObj.isRead = likeObj.isRead == false?true:true;
        return likeObj;
    })
     console.log(updated_likes_arr);
     await author.updateOne({user_likes:updated_likes_arr});
     res.status(200).json({
        success: true
     })

})

const fetchUnreadNotifications = asyncErrorHandler(async(req,res)=>{

    const {user_id} = req.query;
    const author = await singleAuthorLikesModel.findOne({userId: user_id});

    const unread_nots = author.user_likes.filter((likeObj) => !likeObj.isRead);
    console.log(unread_nots);

    res.status(200).json({
        success:true,
        unread_nots:unread_nots
    })
})

const fetchAldreadyReadNotifications = asyncErrorHandler(async(req,res)=>{

    const{user_id} = req.query;
    const author = await singleAuthorLikesModel.findOne({userId:user_id});

    const read_notifications = author.user_likes.filter((likeObj)=>{
        if(likeObj.isRead){
            const differenceInMilliseconds = Math.abs(likeObj.createdAt - Date.now());
            const differenceIndays = differenceInMilliseconds/ (1000 * 60 * 60 * 24);
                //console.log(differenceIndays);
            if(differenceIndays < 7){
                return likeObj;
            }
        }
    })

    res.status(200).json({
        success: true,
        read_notifications: read_notifications
    })
})


module.exports = {updateUnreadtoReadNotifications,fetchUnreadNotifications,fetchAldreadyReadNotifications};