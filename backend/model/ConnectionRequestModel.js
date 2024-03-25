const mongoose = require("mongoose");

const connRequestSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: String,
        enum: ['pending','accepted','denied'],
        default: 'pending'
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    // sender_name:{
    //     type: String,
    //     required : true,
    // }
    // firebaseChatId:{
    //     type:String,
    // }


})

const connReqModel = mongoose.model("connection_requests",connRequestSchema);

module.exports = connReqModel