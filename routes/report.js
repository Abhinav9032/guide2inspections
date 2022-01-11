const express = require("express");
const router = express.Router();
const { saveReport, getReport } = require("../controllers/report");

// @desc: save report to database
router.post("/saveReport", saveReport);

// @desc: get report
router.post("/getReport", getReport);

module.exports = router;
