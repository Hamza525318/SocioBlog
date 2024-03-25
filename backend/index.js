const app = require("./app")
const dotenv = require("dotenv");
const http = require("http");
const connectDatabaseFunc = require("./config/database");
const socketFuncForUpdatedBlog = require("./controllers/websock");
const blogModel = require("./model/blogModel");
dotenv.config({path: "./config/config.env"});


//returns a new instance of web server;
const server = http.createServer(app);

//connect to socket and listen for updates in the database;
socketFuncForUpdatedBlog(server);
//connect database
connectDatabaseFunc();

//console.log(process.env.SMTP_PASSWORD);

// console.log(process.env.HOST_MAIL_USER);

//starts the web server and listens for incoming http requests;
server.listen(process.env.PORT,()=>{
    console.log(`server started running on port ${process.env.PORT}`);
})


