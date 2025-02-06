const { Router } = require("express");
const { registerUser, loginUser, updateUserDetails } = require("../controllers/user.controller");
const protect = require("../middlewares/protect");

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update-user-details").put(protect, updateUserDetails);


module.exports = router;
