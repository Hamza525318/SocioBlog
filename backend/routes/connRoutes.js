const express = require("express");
const router = express.Router();
const {
addNewConnectionRequest,
fetchPendingRequests,
acceptConnectionRequest,
denyConnectionRequest,
fetchAcceptedConnectionRequests,
checkForUserConnectionToAuthor,
checkforPendingConnectionRequest,
} = require("../controllers/connectionRequestController");

router.route("/add-request").post(addNewConnectionRequest);
router.route("/pending-requests").get(fetchPendingRequests);
router.route("/accept-request").put(acceptConnectionRequest);
router.route("/deny-request").delete(denyConnectionRequest);
router.route("/accepted-requests").get(fetchAcceptedConnectionRequests)
router.route("/check-connection").get(checkForUserConnectionToAuthor);
router.route("/check-pending-request").get(checkforPendingConnectionRequest);

module.exports = router;