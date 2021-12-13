const Ships = require("../models/Ships");
const Positions = require("../models/Positions");

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

