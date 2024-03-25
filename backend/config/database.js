const mongoose = require("mongoose");

const connectDatabaseFunc = async () =>{
        
    await mongoose.connect(process.env.DATABASE_URI)
    .then(()=>{
        console.log("connected to database successfully")
    })
    .catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDatabaseFunc;