const SubSections = require("../models/SubSections");

// desc: get the all sub-sections from the database
exports.getSubSections = async (req, res) => {
  const subSections = await SubSections.find({}).sort({ _id: 1 });
  res.status(200).json({ subSections });
};
