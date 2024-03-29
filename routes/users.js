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

// desc: allocate or deallocate section
router.post("/manage-acl", users.allocateDeallocateSection);

// desc: allocate section
router.post("/allocate-section", users.allocateSection);

// desc: update user's profile
router.put("/update-profile", users.updateUserProfile);

// desc: update current inspection
router.put("/update-currentInspection", users.updateCurrentInspection);

// desc: get user's current inspection
router.get("/get-currentInspection/:userId", users.getCurrentInspection);

// desc: grant or deny video access
router.post("/grant-deny-video-access", users.grantDenyVideoAccess);

// desc: delete user specific questions
router.post("/deleteUserQuestion", users.deleteUserQuestion);

// desc: mail for section unlock
router.post("/section-unlock-mail", users.requestSectionUnlock)

module.exports = router;
