const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const multer = require("multer");

// desc: for user registration
router.post("/register", users.register);

router.post("/edit-user-roles", users.editRolesFields);

// desc: to get user profile using userId
router.post("/get-user", users.getUser);

// desc: to update user's profile picture
const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});
const upload = multer({ storage }).single("image");

router.post("/update-profile-pic", upload, users.updateUserImage);

// desc: user dashboard
router.post("/dashboard", users.dashboard);

module.exports = router;
