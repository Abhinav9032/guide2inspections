const express = require("express");
const router = express.Router();
const {
  saveReport,
  getReport,
  generateReport,
} = require("../controllers/report");
const multer = require("multer");

// @desc: save report to database
router.post("/saveReport", saveReport);

// @desc: get report
router.post("/getReport", getReport);

// desc generate report save report to database
const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "");
  },
});
const upload = multer({ storage }).single("reportDoc");
router.post("/generateReport", upload, generateReport);

module.exports = router;
