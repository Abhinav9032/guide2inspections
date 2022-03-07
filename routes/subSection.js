const express = require("express");
const router = express.Router();
const subSection = require("../controllers/subSections");

// desc: get sub-sections on the basis of section
router.get("/fetch-subSections", subSection.getSubSections);

//future implementation
router.delete("/deleteSubSection", subSection.deleteSubSection);

router.post("/addSubSection", subSection.addSubSection);

router.post("/editSubSection", subSection.editSubSection);

module.exports = router;
