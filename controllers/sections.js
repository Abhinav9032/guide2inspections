const sync = require("../controllers/sync");
const Section = require("../models/Sections");

function rankId(id) {
  return id;
}
exports.setupSection = async (req, res) => {
  const { sectionName, sectionThumbnail, sequence, type } = req.body;
  const sections = await Section.find({});
  // type for all rank or only selected rank(3)

  let allRanksAllowed = [],
    eligibleShipType = [],
    setEligibleShipType;

  for (let i = 1; i <= 28; i++) {
    allRanksAllowed.push({ rankId: rankId(i) });
  }

  for (let i = 1; i <= 9; i++) {
    eligibleShipType.push({ shipTypeId: rankId(i) });
  }

  setEligibleShipType = JSON.stringify(eligibleShipType);
  // if (
  //   sectionName == "Engine Room" ||
  //   sectionName == "LSA FFA" ||
  //   sectionName == "Deck Documentation"
  // ) {
  // } else {
  //   setEligibleShipType = [];
  // }

  let section = new Section({
    sectionId: sections.length + 1,
    sectionName,
    sectionThumbnail,
    sequence,
    eligibleRank:
      type == "all" ? JSON.stringify(allRanksAllowed) : [{ rankId: 3 }],
    eligibleShipType: setEligibleShipType,
    note: "",
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
    console.log(targetSection);
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
