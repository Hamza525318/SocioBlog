const userModel = require("../model/userModel");
const CustomError = require("../utils/customErrorHandler");
const jwt = require("jsonwebtoken");
const generateJWT = require("../utils/createJWT")
const asyncErrorHandler = require("../middleware/asyncErrorHandler")
const bcrypt = require("bcrypt");
const singleAuthorLikesModel = require("../model/userBlogLikes")
const {sendEmailforPasswordRecovery} = require("../utils/sendEmail");
const { generateResetPasswordToken } = require("../utils/resetPasswordToken");
const uploadImage = require("../utils/uploadImage");


const signUpUser = asyncErrorHandler(async (req,res)=>{

    const{username,email,password} = req.body;

    const user = await userModel.create({

        username: username,
        email: email,
        password: password,
    })

    await singleAuthorLikesModel.create({
        userId: user.id,
    })

    generateJWT(user,res,201);
})

/*when the user wants to login to the website they will fill the credentials in the form which will be then sent to server
and will be validated with credentials stored in the database if the credentials match then a json web token will be sent
in response which will be then attached to the browser , the json web token contains the encoded data about the user
the json web token will be validated by the server and then the data requiring authentication will be shown
*/

/*
the json web token is an encoded string containing of three different parts:
Header : which is like the metadata about the json web token, what type of signature is being used
Payload: which consist of the actual encoded data (ex-user id)
signature: makes the token secure
*/

const loginUser = asyncErrorHandler(async (req,res,next)=>{
        
    const {username,password} = req.body;
    const user = await userModel.findOne({
        username:username,
    })

    
    if(!user){
        return next(new CustomError(" Incorrect username. Please try again.",404));
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        
        return next(new CustomError("The password you entered is incorrect. Please try again",401));
    }

    generateJWT(user,res,201);
})

//logout user route
const logoutUser = (req,res,next)=>{

  res.status(201)
  .cookie('token',null,{expires: new Date(Date.now())})
  .json({
    success: true,
    message: "User logged out successfully",
  })

}

//fetch blogs written by a particular user
const fetchUserBlogs = asyncErrorHandler( async(req,res,next)=>{
      
    const user = await userModel.findById(req.user._id);
    return res.status(201).json({
        success:true,
        blogs: user.blogs,
    })

})


//verify user when he/she visits the website for the first time
const verifyUserOnVisit = asyncErrorHandler(async (req,res,next)=>{

    const token = req.cookies.token;
    

    jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,decoded)=>{
        if(err){
            req.cookies.token = undefined;
            return next(new CustomError("A problem account while signing to your account. Please Sign in again to access authorized resources",500));
        }
        else{
            const user = await userModel.findOne({username: decoded.username});
            req.user = 
            {

            "_id": user._id.toString(),
            "username":user.username,
            "email":user.email
                    
            }
            res.status(201).json({
                user: user
            })
            
        }
    })
    
});

//function used to add favourite topics of the user

const addFavouriteTopics = asyncErrorHandler(async(req,res)=>{
     
    console.log("req came");
    const{topics,userId} = req.body;
    console.log(topics)
    await userModel.findByIdAndUpdate(userId,{favTopics: [...topics]});

    const user = await userModel.findById(userId);
    res.status(200).json({
        success: true,
        favTopics: user.favTopics,
    })
})

//controller to save a blog written by an author
const addIncompleteBlogToSavedBlogs = asyncErrorHandler(async(req,res)=>{

    const {blogObj,userId} = req.body;
    //const userObj = await userModel.findByIdAndUpdate(userId,{$push: {saved_blogs: blogObj}});
    //console.log(userObj);

    const userObj = await userModel.findByIdAndUpdate(userId,{$push:{saved_blogs: blogObj}},{new: true});
    console.log(userObj);
    //userObj.saved_blogs.push(blogObj);
    res.status(200).json({
        saved_blogs: userObj.saved_blogs,
    })
})

//controller to delete an saved blog
const deleteBlogfromSavedBlogs = asyncErrorHandler(async(req,res)=>{
     
    const {index,userId} = req.query;
    const ind = parseInt(index);
    
    await userModel.updateOne({_id: userId},{$pull:{saved_blogs: {"index": index}}});
    
    const userObj = await userModel.findById(userId);
    console.log(userObj);
    res.status(200).json({
        saved_blogs: userObj.saved_blogs,
    })
})

//controller to fetch saved blogs for a user 
const fetchSavedBlogs = asyncErrorHandler(async(req,res)=>{

    const {userId} = req.query;
    console.log(userId);
    const userObj = await userModel.findById(userId);
    res.status(200).json({
        saved_blogs: userObj.saved_blogs,
    })
})

//controller for password recovery
const resetPasswordTokenController = asyncErrorHandler(async (req,res,next)=>{

    const{userCredential} = req.body;
    
    const user = await userModel.findOne({
        $or:[
            {username: userCredential},
            {email: userCredential},
        ]
    })
    if(!user){
        return next(new CustomError("Username does not exists with the provided username or emailId",404));
    }

    const {resetPasswordToken,resetPasswordExpire} = generateResetPasswordToken();

    await sendEmailforPasswordRecovery(user.email,user.username,`http://localhost:5173/reset-password/token/${resetPasswordToken}`)
    .catch((error)=>{ 
        return next(new CustomError(`An error occured while sending email to ${user.email}. Please try again after sometime or reach out to our customer support team if the issue still persists!!`,500))
    })

    await user.updateOne({resetPasswordToken: resetPasswordToken, resetPasswordTokenExpiry:resetPasswordExpire});

    res.status(200).json({
        success: true,
        message: `We have sent an email to ${user.email}.Please follow the steps to Sign In back`,
    })

})

const updatePassword = asyncErrorHandler(async(req,res,next)=>{
 
    const resetToken = req.params.passToken;
    const {password} = req.body;
    // console.log(password);
    console.log(resetToken);
    const user = await userModel.findOne({resetPasswordToken: resetToken});

    if(!user){
        return next(new CustomError("We're sorry, but we couldn't find a valid reset password token for your account. This may be due to the token expiring or being used already. Please make sure you clicked the correct link in the email we sent you, and ensure that you complete the password reset process within 15 minutes of receiving the email",404))
    }

    if(!user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < Date.now()){
        await user.updateOne({resetPasswordToken:"",resetPasswordTokenExpiry:""})
        return next(new CustomError("Link To reset your password token is expired.Please try again later",500));
    }

    const isPasswordMatchesOldPassword = await bcrypt.compare(password,user.password);
    if(isPasswordMatchesOldPassword){
        return next(new CustomError("Please type a password that you have not used before",500));
    }

    user.resetPasswordToken = "",
    user.resetPasswordTokenExpiry= "",
    user.password = password;

    await user.save();
    generateJWT(user,res,201);

})

const fetchUserProfileDetails = asyncErrorHandler(async (req,res,next)=>{
     
    const{username} = req.query;
    //console.log(username);
    const user = await userModel.findOne({username: username});

    if(!user){
        return next(new CustomError(`There exists no user with the username ${username}`,404));
    }

    res.status(200).json({
        success:true,
        user: {
        "user_id": user._id.toString(),
        "username":user.username,
        "user_email":user.email,
        "user_blogs":user.blogs,
        "total_connections":user.connectionRequests.length
       },
    })

})

const addUserBgImageforChat = asyncErrorHandler(async (req,res)=>{

    const ImgFile = req.file;
    const{userId} = req.query;
    let image_url = "";

    if(ImgFile){
        image_url = await uploadImage(ImgFile.path).catch((err)=> next(new CustomError(
        {message: "there was an error uploading Image please try again!!"},500)));
    }
    await userModel.findByIdAndUpdate(userId,{userChatBg: image_url})
    res.status(200).json({
        chat_background: image_url
    })
})

const removeChatBgImage = asyncErrorHandler(async(req,res)=>{

    const {userId} = req.query;
    await userModel.findByIdAndUpdate(userId,{userChatBg: ""});

    res.status(200).json({
        success: true
    })
})

const fetchUsersBasedOnSearch = asyncErrorHandler(async(req,res)=>{
      
  const {search_user} = req.query;
  const regex = new RegExp(search_user,"i");

  const results = await userModel.find({username: regex});

  const users =  results.map(({ username, _id}) => ({ username, "user_id": _id.toString()}));

  res.status(200).json({
    users: users,
  })

})


module.exports = 
{
signUpUser,
loginUser,
logoutUser,
fetchUserBlogs,
verifyUserOnVisit,
addFavouriteTopics,
addIncompleteBlogToSavedBlogs,
deleteBlogfromSavedBlogs,
fetchSavedBlogs,
resetPasswordTokenController,
updatePassword,
fetchUserProfileDetails,
addUserBgImageforChat,
removeChatBgImage,
fetchUsersBasedOnSearch
};