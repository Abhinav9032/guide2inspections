const sync = require("../controllers/sync");
const Section = require("../models/Sections");
const User = require("../models/User");

exports.setupSection = async (req, res) => {
  const {
    sectionName,
    sectionThumbnail,
    sequence,
    eligibleShipType,
    eligibleRank,
  } = req.body;
  const sections = await Section.find({});

  let section = new Section({
    sectionId: sections.length + 1,
    sectionName,
    sectionThumbnail,
    sequence: sections.length + 1,
    eligibleRank,
    eligibleShipType,
    lastUnlockDate: 0,
  });
  sync.syncUpdates("sections");

  section.save((err, success) => {
    if (err) console.log(err);

    return res.status(200).json(success);
  });
};

exports.editSection = async (req, res) => {
  const { section } = req.body;

  try {
    let targetSection = await Section.findOne({
      sectionId: section.sectionId,
    });
    targetSection.eligibleRank = section.eligibleRank;
    targetSection.eligibleShipType = section.eligibleShipType;
    targetSection.sectionName = section.sectionName;
    targetSection.sectionThumbnail = section.sectionThumbnail;
    sync.syncUpdates("sections");
    await targetSection.save();
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.deleteSection = async (req, res) => {
  const { sectionId } = req.body;
  try {
    sync.syncUpdates("sections");
    await Section.findOneAndDelete({
      sectionId: sectionId,
    });
  } catch (err) {
    console.log(err);
  }
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};
