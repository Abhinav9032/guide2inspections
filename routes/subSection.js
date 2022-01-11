const express = require("express");
const router = express.Router();
const subSection = require("../controllers/subSections");

// desc: get sub-sectionsn on the basis of section
router.get("/fetch-subSections", subSection.getSubSections);

module.exports = router;
