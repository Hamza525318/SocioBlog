const asyncErrorHandler = (myFunc) => (req,res,next)=>{
     
    //creates a new resolved promise
    Promise.resolve(myFunc(req,res,next)).catch(next);
}

module.exports = asyncErrorHandler;