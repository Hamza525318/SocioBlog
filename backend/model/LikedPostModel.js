const mongoose = require('mongoose');

const LikedPostSchema = new mongoose.Schema({

    user:{
        type: String,
        required: true,
    },
    blogPost:{
        type: String,
        required: true,
    }
})

const LikedPostModel = mongoose.model('likedPosts',LikedPostSchema);

module.exports = LikedPostModel;