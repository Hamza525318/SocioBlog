const nodemailer = require("nodemailer");

const sendEmailforPasswordRecovery = async(user_email,username,url)=>{

const transporter = nodemailer.createTransport({

    service:"gmail",
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASSWORD
    }
});
 
const mailObj = {
    from:{
      name: "SOCIOBLOG- WRITE CONNECT ENGAGE",
      address: process.env.SMTP_USER,
    },
    to:user_email,
    subject: "Reset Password",
    text: `
    Dear ${username}
    We received a request to reset the password associated with your account. If you did not request this reset,  please disregard this email.To reset your password, please click on the following link:

    ${url}
    
    Please note that this link will expire in 15 minutes for security reasons.
    If you are unable to click the link, you can copy and paste it into your web browser's address bar.
    
    Thank You
    SocioBlog
    `,
    html: `<div class="container">
    <h1>Password Reset Request</h1>
    <p>Dear ${username},</p>
    <p>We received a request to reset the password associated with your account. If you did not request this reset, please disregard this email.</p>
    <p>To reset your password, please click on the following link:</p>
    <p><a href=${url}>Reset Password</a></p>
    <p>Please note that this link will expire in 15 minutes for security reasons.</p>
    <p>If you are unable to click the link, you can copy and paste it into your web browser's address bar.</p>
    <p>Thank you,<br>
    SocioBlog</p>
    </div>`
}

await transporter.sendMail(mailObj).then(()=>{
    console.log("email sent successfully")
})
.catch((err)=>{
    console.log(err)
})

}

module.exports = {sendEmailforPasswordRecovery};