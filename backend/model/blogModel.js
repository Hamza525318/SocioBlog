const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    id: {
        type: String,
    },
    title:{

        type: String,
        required: [true,"Please enter title for your blog"],
        validate: {
            validator: (value)=> value.length >= 5,
            message: "Title must be atleast 5 characters long" 
        }
    },
    createdAt: {
        type: String,
        default: Date.now(),
    },
    blog_content:{
        type:String,
    },
    no_of_likes:{
        type: Number,
        default: 0,
    },
    category:{
        type: Array,
        default: [],
    },
    blog_image:{

        type:String,
        default:"",
    },
    user_id:{
        type:String,
    },
    timestamp:{
        type: Date,
        default: Date.now(),
    },
    read_counts:{
        type: Array,
        default: [],
    },

})

const blogModel = mongoose.model("blogModel",blogSchema);



module.exports = blogModel;