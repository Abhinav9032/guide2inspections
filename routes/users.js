const express = require("express");
const router = express.Router();
const users = require("../controllers/users");

router.post("/register", users.register);

router.post("/edit-user-roles", users.editRolesFields);

module.exports = router;
