const express = require("express");
const router = express.Router();
const ships = require("../controllers/ships");

// desc: to get all the ships in the database
router.get("/get-ships", ships.getShips);

// desc: add new ship type
router.get("/addShipType", ships.addShipType);

module.exports = router;
