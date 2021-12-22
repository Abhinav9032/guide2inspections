const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

// desc: for user registration
router.post("/register", users.register);

router.post("/edit-user-roles", users.editRolesFields);

// desc: to get user profile using userId
router.post("/get-user", users.getUser);

// desc: to update user's profile picture
router.post("/update-profile-pic", users.updateUserImage);

module.exports = router;
