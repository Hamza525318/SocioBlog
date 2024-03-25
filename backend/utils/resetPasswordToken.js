const crypto = require("crypto");

const generateResetPasswordToken = ()=>{
    
    //generate random token and convert it to hexadecimal 
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    //hash the token using sha256 algo and then digest it to hexadecimal;
    const resetPasswordToken =  crypto.createHash("sha256").update(resetToken).digest("hex");

    const resetPasswordExpire = new Date(Date.now() + 15*60*1000);

    return {resetPasswordToken,resetPasswordExpire};
}

module.exports = {generateResetPasswordToken};