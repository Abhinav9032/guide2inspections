const express = require("express");
const router = express.Router();
const sections = require("../controllers/sections");
// desc: set up all sections
router.post("/setup-sections", sections.setupSection);

module.exports = router;
