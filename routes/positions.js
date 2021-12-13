const express = require("express");
const router = express.Router();
const positions = require("../controllers/positions");

router.get("/get-positions", positions.getPositions);

module.exports = router;
