const express = require("express");
const router = express.Router();
const Positions = require("../models/Positions");
const Ships = require("../models/Ships");
const Sync = require("../models/Sync");

router.get("/", async (req, res) => {
  const positions = await Positions.find({});
  const ships = await Ships.find({});
  const sync = await Sync.find({}).select("-_id -__v");

  let details = {
    ranks: positions.length,
    ships: ships.length,
    syncTime: sync[0],
  };

  res
    .status(200)
    .json({ responseCode: 200, resposeMessage: "SUCCESS", details });
});

module.exports = router;
