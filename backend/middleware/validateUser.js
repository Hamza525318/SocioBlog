const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../middleware/asyncErrorHandler")
const userModel = require("../model/userModel");
const CustomError = require("../utils/customErrorHandler");

const verifyUser = asyncErrorHandler(async(req,res,next)=>{

    const token = req.cookies.token;
    if(!token){
        return next(new CustomError("Login or SignUp to access this page",401));
    }


     jwt.verify(token,process.env.JWT_SECRET_KEY,async (err,decoded)=>{
        if(err){
            return next(new CustomError("Invalid token please login again",401));
        }
        else{
            
            const user = await userModel.findOne({username: decoded.username});
            req.user = 
            {

            "_id": user._id.toString(),
            "username":user.username,
            "email":user.email
            
            }
            next();
        }
    })
    
})

const getUsernamefromCookie = (cookie)=>{


    jwt.verify(cookie,process.env.JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
           console.log(err);
        }
        else{
            username = decoded.username;
        }
    })

    return username;
}

module.exports = {verifyUser,getUsernamefromCookie};