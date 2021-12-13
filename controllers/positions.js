const Positions = require("../models/Positions");

exports.getPositions = (req, res) => {
  Positions.find()
    .sort({ _id: 1 })
    .select("-_id -__v")
    .exec((err, positions) => {
      if (err) {
        console.log(err);
      }

      return res.status(200).json({
        responseCode: 200,
        resposeMessage: "SUCCESS",
        positions,
      });
    });
};
