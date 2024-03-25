const mongoose = require("mongoose");

//this is seprate schema to store whixh user has liked which blog of an particular author

const singleAuthorLikesSchema = new mongoose.Schema({

    userId:{
        type: String,
        unique: true,
    },
    user_likes:{
        type:Array,
        default: [],
    }
})

const singleAuthorLikesModel = mongoose.model('singleAuthorLikes',singleAuthorLikesSchema);

module.exports = singleAuthorLikesModel;