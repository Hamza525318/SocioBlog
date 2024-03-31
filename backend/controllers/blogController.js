const blogModel = require("../model/blogModel");
const CustomError = require("../utils/customErrorHandler");
const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const cloudinary = require("../utils/uploadImage");
const userModel = require("../model/userModel");
const uploadImage = require("../utils/uploadImage");
const { verifyUserOnVisit } = require("./userController");
const LikedPostModel = require("../model/LikedPostModel");
const {getUsernamefromCookie} = require("../middleware/validateUser")
const { generateUniqueID } = require("../config/randomID");
const fs = require("fs")
const {exec} = require("child_process");
const {generateUniqueFileName}  = require("../utils/generateFileName")



//fetch all blogs posts
const getAllBlogPosts = asyncErrorHandler(async (req,res)=>{
         
    const{pagecount} =  req.query;
    const resultsPerClick = 6;

    const totalSkipCount = resultsPerClick * (Number(pagecount)-1);

    const blogs = await blogModel.find().limit(resultsPerClick).skip(totalSkipCount);

    res.status(200).json({
        success: true,
        blogs: blogs,
    })
});

//controller to fetch blogs based on user's favourite topics;
const fetchUserFavouriteBlogs = asyncErrorHandler(async (req,res)=>{
    
    const{fav_topics} = req.body;
    const fav_topics_set = new Set(fav_topics);

    const blogs = await blogModel.find({
        category: {$in: fav_topics},
    }).limit(5);

    res.status(200).json({
        success: true,
        blogs: blogs,
    })
})

const addNewBlogPost = asyncErrorHandler(async (req,res)=>{

    // console.log(req.file);
    // console.log(req.body.name);
    const image_url = await uploadImage(req.file.path).catch((err)=> next(new CustomError(err,500)));
    console.log(image_url);
    res.status(200).json({
        success: true,
        message: "Blog post successfull",
    })
})

//create new blog
const createBlogPost = asyncErrorHandler(async(req,res,next)=>{

    const {title,category,blog_content,user_id,blogText} = req.body;
    const ImgFile = req.file;
    let blog_image_url="";
    if(ImgFile){
       
       blog_image_url =  await uploadImage(ImgFile.path).catch((err)=> next(new CustomError(
      {message: "there was an error uploading Image please try again!!"},500)));
    }

    const blog_words = blogText.split(" ");

    //console.log(blog_words);
    // console.log(Math.ceil(blog_words.length/150));
    //console.log(Math.floor(blog_words.length/150));

    const blog =  await blogModel.create({
        title: title,
        category: [category],
        blog_content: blog_content,
        blog_image:blog_image_url,
        user_id:user_id,
        read_time: Math.ceil(blog_words.length/150),
    })

    // console.log(blog);
     if(blog){
       const user = await userModel.findByIdAndUpdate(user_id,{$push: {blogs:blog}},{new: true});
    }
    res.status(201).json({
        success:true,
        message:"blog post successfull",
    })
    
})

//delete blog post
const deleteBlogPost = asyncErrorHandler(async (req,res,next)=>{
    
    const blogId = req.query.blogid
    const blog = await blogModel.findByIdAndDelete(blogId);
    const user = await userModel.findById(blog.user_id);

    const user_blogs = user.blogs;

    for(let i=0;i<user_blogs.length;i++){
         
        if(user_blogs[i]._id.toString() === blogId){
            user_blogs.splice(i,1);
            break;
        }
    }

    await userModel.findByIdAndUpdate(blog.user_id,{blogs: user_blogs})

    res.status(201).json({
        success:true,
        message:"Blog deleted successfully",
    })
})

//blogs by category
const blogsByCategory = asyncErrorHandler(async (req,res,next)=>{

    const category = req.query.category;

    const blogs = await blogModel.find({
        category:category,
    })
  
    if(!blogs){
        return next(new CustomError(`Sorry no blogs exists with  category: ${category}`,401));
    }

    res.status(201).json({
        success:true,
        blogs
    })
})

//fetch single blog:

const singleBlogInfo = asyncErrorHandler(async(req,res,next)=>{
    
    const{blogId} = req.query;
    const blog = await blogModel.findById(blogId);
    if(!blog){
        return next(new CustomError("No blog exists with the specified ID",404));
    }
    
    const user = await userModel.findById(blog.user_id);
    let read_counts = blog.read_counts.length;

    if(!req.cookies.token && !req.cookies.temp_user_id){
        const uid = generateUniqueID();
        await blog.updateOne({$push: {read_counts: uid}});
        res.cookie("temp_user_id",uid,{
            expires: new Date(Date.now() + 2*24*60*60*1000),
            httpOnly: false,
        })
        read_counts += 1;
    }

    else if((req.cookies.token)){
        if(req.cookies.temp_user_id && !blog.read_counts.includes(req.cookies.temp_user_id)){
        const username = getUsernamefromCookie(req.cookies.token);
        console.log(username);
        if(!blog.read_counts.includes(username)){
            await blog.updateOne({$push: {read_counts: username}});  
            read_counts += 1
        }
        }
    }

    else if((req.cookies.temp_user_id && !blog.read_counts.includes(req.cookies.temp_user_id))){
        console.log(req.cookies.temp_user_id);
        await blog.updateOne({$push: {read_counts: req.cookies.temp_user_id}});
        read_counts = read_counts+1;
    }
    

    const latestBlogsByAuthor = user.blogs.length>=4?user.blogs.slice(-4):user.blogs;

    res.status(201).json({
        success: true,
        blog,
        user: {username: user.username,email: user.email},
        latestBlogs: latestBlogsByAuthor,
    })
})


//function to handle when a user likes a particular blog;
const likeBlogPost = asyncErrorHandler(async(req,res,next)=>{

    const{user_id,blog_id} = req.body;
    const likedPost = new LikedPostModel({
        user: user_id,
        blogPost: blog_id
    })

    await likedPost.save();

    const blog = await blogModel.findById(blog_id);
    await blog.updateOne({no_of_likes: blog.no_of_likes+1})
    await userModel.findByIdAndUpdate(user_id, { $push: { likedPosts: likedPost._id } });


    res.status(200).json({
        sucess: true,
        no_of_likes: blog.no_of_likes+1
    })

})

//function to check if the user has liked post or not
const checkForTheLikedPost = asyncErrorHandler(async (req,res,next)=>{

    const{user_id,blog_id} = req.query;

    const hasLikedPost = await LikedPostModel.exists({user:user_id,blogPost:blog_id});

    res.status(200).json({
        isPostLiked: hasLikedPost===null?false:true,
    })
})

//function to dislike the post

const dislikePost = asyncErrorHandler(async (req,res,next)=>{
    
    const {user_id,blog_id} = req.query;
    const dislikedPost = await LikedPostModel.findOneAndDelete({user:user_id,blogPost:blog_id});

    const user = await userModel.findById(user_id);
    // for(let i=0;i<user.likedPosts.length;i++){
    //     if(dislikedPost._id.toString() === user.likedPosts[i].toString()){
    //         user.likedPosts.splice(i,1);
    //         break;
    //     }
    // }
    console.log(user.likedPosts);
    user.likedPosts = user.likedPosts.filter((post)=>post.toString() != dislikedPost._id.toString());
    console.log(user.likedPosts);
    await user.updateOne({likedPosts: user.likedPosts});

    const blog = await blogModel.findById(blog_id);
    blog.no_of_likes = Math.max(blog.no_of_likes-1,0);

    await blog.save();

 

    res.status(200).json({
        success: true,
        no_of_likes: blog.no_of_likes,
    })

})


const fetchLatestBlogs = asyncErrorHandler(async(req,res)=>{

    const blogs = await blogModel.find().sort({createdAt: -1}).limit(6);

    const latest_blogs = [];

    blogs.forEach((blog)=>{
     latest_blogs.push({
     blog_id: blog._id.toString(),
     title: blog.title,
     image: blog.blog_image,
     createdAt:blog.createdAt
    });
    })

    res.status(200).json({
        latestBlogs: latest_blogs
    })
})

const fetchTopReadBlogs = asyncErrorHandler(async (req,res)=>{
    
    const blogs = await blogModel.aggregate([
        {
            $addFields: {
                ArrayLength: {
                  $size: "$read_counts",   
                }
            }
        },
        {
            $sort : {ArrayLength: -1}
        }
    ]).limit(5);
      
    const latest_blogs = [];

    blogs.forEach((blog)=>{
    latest_blogs.push({
     blog_id: blog._id.toString(),
     title: blog.title,
     image: blog.blog_image,
     createdAt:blog.createdAt,
     readCounts: blog.read_counts,
    });
    })

    res.status(200).json({
        latestBlogs: latest_blogs
    })
})

const fetchBlogsBasedOnSearchField = asyncErrorHandler(async (req,res)=>{
     
    const {search_word} = req.query;
    const regex_expression  = new RegExp(search_word,"i");

    const blogs = await blogModel.find({title: regex_expression});
    res.status(200).json({
        blogs: blogs,
    })
})

const suggestCategoryTags = asyncErrorHandler(async (req,res,next)=>{

    const {blog_content,username} = req.body
    //console.log("req came");
    fs.writeFileSync(`./blogfiles/${username}.txt`,blog_content);
    let arr = []

    exec(`python ./config/script.py ${username}`,(error,stdout,stderr)=>{
        if(error || stderr){
            fs.unlinkSync(`./blogfiles/${username}.txt`);
            return next(new CustomError("There was some error generating tags, please try again!!",500))
        }
        else{
          const data = stdout.trim();
          arr = JSON.parse(data.replace(/'/g, '"'));
          //console.log(arr);
          fs.unlinkSync(`./blogfiles/${username}.txt`)
          res.status(200).json({
            blog_tags: arr
          })
        }
    })

})

const summarizeBlog = asyncErrorHandler(async(req,res)=>{
    
    const {blog_content} = req.body;
    const filename = generateUniqueFileName();
    fs.writeFileSync(`./summaryFiles/${filename}`,blog_content);
    let summary = "";
    exec(`python ./config/summarize.py ${filename}`,(err,stdout,stderr)=>{
        if(err || stderr){
            fs.unlinkSync(`./summaryFiles/${filename}`);
            return next(new CustomError("There was some error summarizing the blog, please try again!!",500))
        }
        else{
            summary = stdout.trim();
            fs.unlinkSync(`./summaryFiles/${filename}`);
            //console.log(summary)
            res.status(200).json({
                blog_summary: summary
            })
        }
    })


})


module.exports = {

 getAllBlogPosts,
 createBlogPost,
 deleteBlogPost,
 blogsByCategory,
 singleBlogInfo,
 likeBlogPost,
 checkForTheLikedPost,
 dislikePost,
 fetchUserFavouriteBlogs,
 addNewBlogPost,
 fetchLatestBlogs,
 fetchTopReadBlogs,
 fetchBlogsBasedOnSearchField,
 suggestCategoryTags,
 summarizeBlog,
};