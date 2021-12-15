const express = require("express");
const router = express.Router();
const ships = require("../controllers/ships");

// desc: to get all the ships in the database
router.get("/get-ships", ships.getShips);

module.exports = router;
