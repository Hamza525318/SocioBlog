const mongoose = require("mongoose");
const {isEmail} = require("validator");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        unique: [true,"provided username is aldready taken"],
        required: [true,"please enter username"],
        minlength: [5,"Username should contain atleast 5 characters"],
    },

    email:{
         
        type:String,
        unique:[true,"an account aldready exists with the provided emailId"],
        required: [true,"please enter an email id"],
        validate: [isEmail,"email format not specified properly"],
        minlength: true,
    },

    password:{
        
        type: String,
        required: true,
        minlength: [8,"password should contain atleast 8 characters"],
    },

    blogs:{
        type: Array,
    },
    likedPosts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'likedPosts',
        }
    ],
    favTopics:{

        type: Array,
        default: [],
    },
    connectionRequests: {
        type: Array,
    },
    saved_blogs:{
        type: Array,
        default:[],
    },
    resetPasswordToken:{
        type: String,
    },
    resetPasswordTokenExpiry:{
        type: Date
    },
    userChatBg:{
        type: String,
        default: "",
    }

})

/*mongoose hooks like pre and post allows you to run a certain code before or after an certain event occurs, example
you want to send a message to the user after an document is saved in database you can do it with the help of 
post function (hooks are nothing but functions);
*/

userSchema.pre("save", async function(next){
     
    //password of the user trying to create a new account

    //a promise to be resolved with the generated Salt or rejected with an error;
    this.password =  await bcrypt.hash(this.password,10);
    next();
})

/*hashing password and storing them in he database is an idle approach to maintain the confidentiality 
because if we dont hash the passwords and our database is compromised then the hackers will have all the passwords

general idea:
We run the password through a hashing algorithm which will generate random characters and attach a salt (string of random)
characters and then store it in database
*/

const userModel = mongoose.model("users",userSchema);
module.exports = userModel;
