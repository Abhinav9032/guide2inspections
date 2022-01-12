const mongoose = require("mongoose");

const saveReportSchema = mongoose.Schema({
  documentNumber: {
    type: Number,
  },
  reportId: {
    type: String,
  },
  userId: {
    type: Number,
  },
  reportDoc: {
    type: String,
  },
});

module.exports = saveReport = mongoose.model("savereport", saveReportSchema);
