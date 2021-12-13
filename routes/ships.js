const express = require("express");
const router = express.Router();
const ships = require("../controllers/ships");

router.get("/get-ships", ships.getShips);

module.exports = router;
