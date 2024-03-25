/*this class is used to create customised error object to handle errors in the application it extends the 
  pre-defined Error class in Javascript
*/

class CustomError extends Error{
    
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        
        //capture the stack space at the point where the error is constructed;
        Error.captureStackTrace(this,this.contructor)
    }

}

module.exports = CustomError;
