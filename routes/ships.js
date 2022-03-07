const express = require("express");
const router = express.Router();
const ships = require("../controllers/ships");

// desc: to get all the ships in the database
router.get("/get-ships", ships.getShips);

// desc: add new ship type
router.post("/addShipType", ships.addShipType);

// desc: edit ship type
router.post("/editShipType", ships.editShipType);

// desc: delete ship type
router.delete("/deleteShipType", ships.deleteShipType);

module.exports = router;
