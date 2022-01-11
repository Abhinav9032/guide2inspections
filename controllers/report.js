const Report = require("../models/Report");

exports.saveReport = async (req, res) => {
  const { reports } = req.body;
  reports.map(async (report) => {
    let formedAnswerId = "Q" + report.qId + "_" + "U" + report.userId;

    let newReport = Report({
      qId: report.qId,
      userId: report.userId,
      answerId: formedAnswerId,
      comment: report.comment,
      imageLink: report.imageLink,
    });

    await newReport.save();
  });

  res.status(200).json({ responseCode: 200, responseMessage: "SUCCESS" });
};

exports.getReport = async (req, res) => {
  const { answerId } = req.body;
  const report = await Report.findOne({ answerId });

  if (!report) {
    res.status(404).json({
      responseCode: 404,
      responseMessage: "NOT FOUND",
    });
  } else {
    res
      .status(200)
      .json({ responseCode: 200, responseMessage: "SUCCESS", report });
  }
};
