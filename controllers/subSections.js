const sync = require("../controllers/sync");
const SubSections = require("../models/SubSections");

// desc: get the all sub-sections from the database
exports.getSubSections = async (req, res) => {
  const subSections = await SubSections.find({}).sort({ _id: 1 });
  res.status(200).json({ subSections });
};

exports.deleteSubSection = async (req, res) => {
  const { subSectionId } = req.body;
  await SubSections.findOneAndDelete({
    subsId: parseInt(subSectionId),
  });
  sync.syncUpdates("subSections");
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.addSubSection = async (req, res) => {
  const { subSection } = req.body;
  const latestSubSection = await SubSections.find({}).sort({ _id: -1 });
  let newSubSection = SubSections({
    subsId: latestSubSection[0].subsId + 1,
    name: subSection.name,
    subParent: subSection.subParent,
    subLink: subSection.subLink,
    sited: subSection.sited,
    observation: subSection.observation,
    clouserDate: subSection.clouserDate,
    comments: subSection.comments,
    risk: subSection.risk,
    status: subSection.status,
    note: subSection.note,
    attachmentLink: subSection.attachmentLink,
    ranks: subSection.ranks,
    shipType: subSection.shipType,
    evidence: subSection.evidence,
  });
  sync.syncUpdates("subSections");
  await newSubSection.save();
  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.editSubSection = async (req, res) => {
  const { subSection } = req.body;
  try {
    const targetSubSection = await SubSections.findOne({
      subsId: subSection.subsId,
    });

    if (!targetSubSection) {
      res.status(404).json({ message: "NO SUBSECTION FOUND" });
    } else {
      targetSubSection.name = subSection.name;
      targetSubSection.subParent = subSection.subParent;
      targetSubSection.sited = subSection.sited;
      targetSubSection.observation = subSection.observation;
      targetSubSection.clouserDate = subSection.clouserDate;
      targetSubSection.comments = subSection.comments;
      targetSubSection.risk = subSection.risk;
      targetSubSection.status = subSection.status;
      targetSubSection.note = subSection.note;
      targetSubSection.attachmentLink = subSection.attachmentLink;
      targetSubSection.ranks = subSection.ranks;
      targetSubSection.shipType = subSection.shipType;
      targetSubSection.evidence = subSection.evidence;

      sync.syncUpdates("subSections");
      await targetSubSection.save();
      res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.bindSectionsSubSection = async () => {
  const subSections = await SubSections.find({}).sort({ _id: 1 });
  let sections = [""],
    individualSubSection = "";
  for (let i = 1; i <= subSections.length; i++) {
    subSections.map((ss) => {
      if (ss.subParent === i) {
        individualSubSection = individualSubSection + String(ss.subsId) + " ";
      }
    });
    sections.push(individualSubSection.trimEnd(" "));
    individualSubSection = "";
  }
  return sections;
};
