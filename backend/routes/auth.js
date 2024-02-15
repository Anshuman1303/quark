const express = require("express");
const app = express();
const router = express.Router();
const handleLogin = require("../controllers/loginController");
const handleRegister = require("../controllers/registerController");
const path = require("path");
const handleLogout = require("../controllers/logoutController");
const handleIsAuth = require("../controllers/isAuthController");

router.post("/login", handleLogin);
router.post("/register", handleRegister);
router.post("/logout", handleLogout);
router.get("/isauth", handleIsAuth);
module.exports = router;
