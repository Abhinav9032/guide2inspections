const express = require("express");
const router = express.Router();
const Positions = require("../models/Positions");
const Ships = require("../models/Ships");

router.get("/", async (req, res) => {
  const positions = await Positions.find({});
  const ships = await Ships.find({});
  let details = {
    ranks: positions.length,
    ships: ships.length,
  };

  res
    .status(200)
    .json({ responseCode: 200, resposeMessage: "SUCCESS", details });
});

module.exports = router;
