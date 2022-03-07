const Ships = require("../models/Ships");
const sync = require("../controllers/sync");

exports.getShips = (req, res) => {
  Ships.find()
    .sort({ _id: 1 })
    .select("-_id -__v")
    .exec((err, ships) => {
      if (err) {
        console.log(err);
      }

      return res.status(200).json({
        responseCode: 200,
        resposeMessage: "SUCCESS",
        ships,
      });
    });
};

exports.addShipType = async (req, res) => {
  const ships = await Ships.find({}).sort({ _id: -1 });
  const { shipTypeName } = req.body;
  let result = {};
  let newShipType = Ships({
    shipTypeId: parseInt(ships[0].shipTypeId) + 1,
    shipTypeName,
  });
  sync.syncUpdates("shipType");
  result = await newShipType.save();
  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", result });
};

exports.deleteShipType = async (req, res) => {
  try {
    const { shipTypeId } = req.body;
    await Ships.findOneAndDelete({ shipTypeId });
    sync.syncUpdates("shipType");
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.editShipType = async (req, res) => {
  let result = {};
  try {
    const { shipTypeId, shipTypeName } = req.body;
    const ship = await Ships.findOne({ shipTypeId });
    ship.shipTypeName = shipTypeName;
    result = await ship.save();
    sync.syncUpdates("shipType");
  } catch (err) {
    console.log(err);
  }
  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", result });
};
