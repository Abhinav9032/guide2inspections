const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth");
require("dotenv").config();

router.post("/login", auth.isAuth);

module.exports = router;
