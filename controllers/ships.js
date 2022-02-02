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
  let newShipType = Ships({
    shipTypeId: parseInt(ships[0].shipTypeId) + 1,
    shipTypeName,
  });
  sync.syncUpdates("shipType");
  await newShipType.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};
