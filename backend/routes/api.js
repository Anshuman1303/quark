const express = require("express");
const app = express();
const router = express.Router();
const path = require("path");
const verifyUser = require("../middleware/verifyUser");
const handleFriendRequest = require("../controllers/friendRequestController");
const handleMsg = require("../controllers/msgController");
const handleGetFriends = require("../controllers/getFriendsController");
const handleGetMsg = require("../controllers/getMsgController");

router.post("/sendreq", verifyUser, handleFriendRequest);
router.post("/msg", verifyUser, handleMsg);
router.post("/getmsgs", verifyUser, handleGetMsg);
router.get("/getfrnds", verifyUser, handleGetFriends);
module.exports = router;
