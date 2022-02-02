const express = require("express");
const router = express.Router();
const positions = require("../controllers/positions");

// desc: to get all the positions in the database
router.get("/get-positions", positions.getPositions);

// desc: to add a new position
router.post("/addPosition", positions.addPosition);

module.exports = router;
