const express = require("express");
const blogRouter = require("./routes/blogRoutes");
const userRouter = require("./routes/userRoutes");
const connRouter = require("./routes/connRoutes");
const cors = require("cors")
const bodyParser = require('body-parser');
const cookie_parser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");

//mjs stands for module javascript which generally used an extension to identify the file as ecma module;
//middlewares in express have the access to req and res objects.

//it is important to include the necessary cors headers to allow request
/*in this case we should allow all the requests coming in from the frontend, so the url of the frontend must be included
   in the cors headers*/

//Access control allow origin 
//Access control allow method

//creates an express application
const app = express();


/*when client sends the data to the server using http post or put method and includes json payload in the request body
this middleware will parse the json payload and make it available to the req.body object
*/
app.use(cors({
    origin:'http://localhost:5173',
    credentials: true },
))
app.use(bodyParser.json({"limit":"3mb"}))
app.use(express.json())
app.use(cookie_parser())
app.use("/blogs",blogRouter);
app.use("/user",userRouter);
app.use("/conn-request",connRouter);

//middleware to handle errors gracefully
app.use(errorMiddleware);



module.exports = app;

