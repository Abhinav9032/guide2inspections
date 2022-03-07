const Sync = require("../models/Sync");

exports.syncUpdates = async (type) => {
  const sync = await Sync.find({});
  let fetchedSync = sync[0];
  switch (type) {
    case "shipType":
      fetchedSync.shipType = Date.now();
      break;
    case "positions":
      fetchedSync.positions = Date.now();
      break;
    case "sections":
      fetchedSync.sections = Date.now();
      break;
    case "questions":
      fetchedSync.questions = Date.now();
      break;
    case "subSections":
      fetchedSync.subSections = Date.now();
      break;
  }
  await fetchedSync.save();
};
