const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleware/validateUser")
const {uploadImgToMulter} = require("../middleware/multer_middleware")
const 
{
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
    summarizeBlog
} = require("../controllers/blogController")


/*express.Router is a class in express which allows you to create modular, mountable route handlers . You can orangise
your routes in separate folders and moduler and each router can handle its own set of routes independently . You can
use this router as an middleware in your application*/

router.route("/").get(getAllBlogPosts);
router.route("/newblog").post(uploadImgToMulter.single("file"),createBlogPost);
router.route("/deleteblog/").delete(verifyUser,deleteBlogPost);
router.route("/blogs-by-category/").get(blogsByCategory);
router.route("/single-blog/").get(singleBlogInfo);
router.route("/like-post").post(likeBlogPost);
router.route("/hasLikedPost").get(checkForTheLikedPost);
router.route("/unlike-post").get(dislikePost);
router.route("/fetch-blogs").get(fetchUserFavouriteBlogs);
router.route("/new-blog-post").post(uploadImgToMulter.single("file"),addNewBlogPost);
router.route("/latest-blogs").get(fetchLatestBlogs);
router.route("/topread-blogs").get(fetchTopReadBlogs);
router.route("/search-blogs").get(fetchBlogsBasedOnSearchField);
router.route("/suggest-tags").post(suggestCategoryTags);
router.route("/generate-summary").post(summarizeBlog);

module.exports = router;