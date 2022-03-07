const express = require("express");
const router = express.Router();
const sections = require("../controllers/sections");

// desc: set up all sections
router.post("/setup-sections", sections.setupSection);

router.delete("/deleteSection", sections.deleteSection);

router.post("/editSection", sections.editSection);

module.exports = router;
