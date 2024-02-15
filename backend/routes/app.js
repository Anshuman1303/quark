const express = require("express");
const router = express.Router();
const path = require("path");
const verifyUser = require("../middleware/verifyUser");
const handleMsg = require("../controllers/msgController");

router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
router.post("/msg", handleMsg);
module.exports = router;
