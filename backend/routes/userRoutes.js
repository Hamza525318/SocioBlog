const express = require("express");
const router = express.Router();
const {verifyUser} = require("../middleware/validateUser")
const {uploadImgToMulter} = require("../middleware/multer_middleware")
const {
    
signUpUser,
loginUser,
logoutUser, 
fetchUserBlogs, 
verifyUserOnVisit,
addFavouriteTopics,
addIncompleteBlogToSavedBlogs,
deleteBlogfromSavedBlogs,
fetchSavedBlogs,
resetPasswordTokenController,
updatePassword,
fetchUserProfileDetails,
addUserBgImageforChat,
removeChatBgImage,
fetchUsersBasedOnSearch
} = require("../controllers/userController");
const {updateUnreadtoReadNotifications, fetchUnreadNotifications,fetchAldreadyReadNotifications} = require("../controllers/NotificationController")

router.route("/signup").post(signUpUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/myblogs").get(verifyUser,fetchUserBlogs);
router.route("/first-visit-verify").get(verifyUserOnVisit);
router.route("/add-fav-topics").post(addFavouriteTopics);
router.route("/update-notifications").put(updateUnreadtoReadNotifications);
router.route("/unread_notifications").get(fetchUnreadNotifications);
router.route("/fetch-read-notifications").get(fetchAldreadyReadNotifications);
router.route("/save-blog").put(addIncompleteBlogToSavedBlogs);
router.route("/delete-saved-blog").delete(deleteBlogfromSavedBlogs);
router.route("/fetch-saved-blogs").get(fetchSavedBlogs);
router.route("/reset-password").post(resetPasswordTokenController);
router.route("/update-password/:passToken").put(updatePassword);
router.route("/fetch-details").get(fetchUserProfileDetails);
router.route("/upload-chat-bg-image").post(uploadImgToMulter.single("file"),addUserBgImageforChat);
router.route("/remove-chat-bg-image").put(removeChatBgImage);
router.route("/search-users").get(fetchUsersBasedOnSearch)

module.exports = router;