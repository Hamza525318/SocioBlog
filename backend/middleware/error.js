const ErrorHandler = require("../utils/customErrorHandler");

module.exports = (err,req,res,next)=>{

    const statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server error";

    // if(message.includes("users validation failed")){
          
    //     let errMessage = "";
    //     Object.values(err.errors).forEach(({properties})=>{
    //         errMessage += properties.message
    //     })

    //     message= errMessage;
    // }

    
    //duplicate key error in mongodb
    if(err.code === 11000){
        const message = `Account aldready exists with ${Object.keys(err.keyValue)}`
        err = new ErrorHandler(message,400);
    }
     
    
    res.status(statusCode).json({
        sucess:false,
        message: message,
    })
}
