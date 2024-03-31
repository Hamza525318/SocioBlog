const mongoose = require("mongoose")

const analyticsSchema  = new mongoose.Schema({

    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogModel'
    },
    read_counts:{
        type: Array,
        default: [],
    },
    read_time:{
        type: Number,
        default: 0,
    }
})

const mongooseModel = mongoose.model("BlogAnalytics",analyticsSchema);

module.exports = mongooseModel;