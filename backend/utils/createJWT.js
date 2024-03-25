const jwt = require("jsonwebtoken");


const generateJWT = (user,res,statusCode)=>{
     
    const username = user.username
    const email = user.email;

    const token = jwt.sign({username:user.username,email:user.email},process.env.JWT_SECRET_KEY,{
        expiresIn: "2 days"
    })
     
    res.cookie("token",token,{
        expires: new Date(Date.now() + 2*24*60*60*1000),
        httpOnly: false,
    })


    res.status(statusCode).json({
        success: true,
        user,
        
    })
}

module.exports = generateJWT;