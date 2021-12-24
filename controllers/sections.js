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

  if (
    sectionName == "Engine Room" ||
    sectionName == "LSA FFA" ||
    sectionName == "Deck Documentation"
  ) {
    setEligibleShipType = eligibleShipType;
  } else {
    setEligibleShipType = [];
  }

  let section = new Section({
    sectionId: sections.length + 1,
    sectionName,
    sectionThumbnail,
    sequence,
    eligibleRank: type == "all" ? allRanksAllowed : [{ rankId: 3 }],
    eligibleShipType: setEligibleShipType,
    note: "",
    lastUnlockDate: 0,
  });

  section.save((err, success) => {
    if (err) console.log(err);

    return res.status(200).json(success);
  });
};
