const { GoogleSpreadsheet } = require("google-spreadsheet");
const Question = require("../models/Question");
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
require("dotenv").config();

function createData(
  suffix,
  qId,
  qText,
  ansType,
  link,
  description,
  rank,
  shipType,
  vIq,
  qParent
) {
  return {
    suffix,
    qId,
    qText,
    ansType,
    link,
    description,
    rank,
    shipType,
    vIq,
    qParent,
  };
}

exports.getQuestions = async (req, res) => {
  await doc.useServiceAccountAuth({
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  });

  const myQuestions = [];

  // load the document info
  await doc.loadInfo();

  // Index of the sheet
  let sheet = doc.sheetsByIndex[0];

  // Get all the rows
  let rows = await sheet.getRows();

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    myQuestions.push(
      createData(
        row._rawData[0],
        row._rawData[1],
        row._rawData[2],
        row._rawData[3],
        row._rawData[4],
        row._rawData[5],
        row._rawData[6],
        row._rawData[7],
        row._rawData[8],
        row._rawData[9]
      )
    );
  }

  Question.collection.insertMany(myQuestions, (err, question) => {
    if (err) {
      console.log(err);
    }

    return res.status(200).json({ message: "SUCCESS" });
  });

  // myQuestions.map(async (q) => {
  //   const isPresent = await Question.findOne({ qId: q.qId });
  //   if (!isPresent) {
  //     let question = new Question(q);
  //     question.save();
  //   }
  // });
};

//prepare a route for changing the  to type from string to array, for rank and ship type also
// try to string to integer
