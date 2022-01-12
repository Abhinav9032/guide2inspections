const Report = require("../models/Report");
const AWS = require("aws-sdk");
const SaveReport = require("../models/SaveReport");
require("dotenv").config();

exports.saveReport = async (req, res) => {
  const { reports } = req.body;
  reports.map(async (report) => {
    let formedAnswerId = "Q" + report.qId + "_" + "U" + report.userId;
    let newReport = Report({
      qId: report.qId,
      userId: report.userId,
      answer: report.answer,
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

// aws s3 instance // fixing commit issue
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY,
});

exports.generateReport = async (req, res) => {
  const reportDocName = req.file.originalname.split(".");
  const fileExtension = reportDocName[reportDocName.length - 1];

  const s3Config = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: Date.now() + "." + fileExtension,
    Body: req.file.buffer,
  };

  s3.upload(s3Config, async (err, reportUrl) => {
    if (err) {
      console.log(err);
    }
    const fetchReports = await SaveReport.find({}).sort({ _id: -1 });
    let formedReport = {};

    if (fetchReports.length == 0) {
      formedReport.documentNumber = 1;
      formedReport.Id =
        "USERID_" +
        req.body.userId +
        "-" +
        "REPORT_" +
        formedReport.documentNumber;
    } else {
      formedReport.Id =
        "USER_" +
        req.body.userId +
        "-" +
        "REPORT_" +
        (fetchReports[0].documentNumber + 1);

      formedReport.documentNumber =
        parseInt(fetchReports[0].documentNumber) + 1;
    }

    const newReportSave = SaveReport({
      userId: req.body.userId,
      reportDoc: reportUrl.Location,
      documentNumber: parseInt(formedReport.documentNumber),
      reportId: formedReport.Id,
    });

    await newReportSave.save();
    res.status(200).json({
      responseCode: 200,
      responseMessage: "SUCCESS",
      generatedReport: newReportSave.reportDoc,
    });
  });
};
