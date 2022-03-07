const Positions = require("../models/Positions");
const sync = require("../controllers/sync");

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

exports.addPosition = async (req, res) => {
  const { rankName } = req.body;
  const rank = await Positions.find({}).sort({ _id: -1 });
  let result = {};
  let newRank = Positions({
    rankId: parseInt(rank[0].rankId) + 1,
    rankName,
  });
  sync.syncUpdates("positions");
  result = await newRank.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.deletePosition = async (req, res) => {
  const { rankId } = req.body;
  try {
    sync.syncUpdates("positions");
    await Positions.findOneAndDelete({ rankId });
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.editPosition = async (req, res) => {
  const { rankName, rankId } = req.body;
  let result = {};
  try {
    const rank = await Positions.findOne({ rankId });
    rank.rankName = rankName;
    sync.syncUpdates("positions");
    result = await rank.save();
  } catch (err) {
    console.log(err);
  }
  res
    .status(200)
    .json({ responseCode: 200, responseMessage: "SUCCESS", result });
};
