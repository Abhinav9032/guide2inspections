const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const { getShipId, getPositionId } = require("../actions/postion&ship");
require("dotenv").config();

exports.register = async (req, res) => {
  const { name, email, password, position, shipType, createdDate } = req.body;

  const is_already_registered = await User.findOne({ email });

  const numberOfUser = (await User.find({})).length;

  if (is_already_registered) {
    return res.json({
      responseCode: 403,
      responseMessage: "User already registered",
    });
  }

  let hashedPassword;

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(password, salt);

  let user = new User({
    userId: numberOfUser + 1,
    name,
    email,
    password: hashedPassword,
    position,
    shipType,
    createdDate,
  });

  user.save(async (err, u) => {
    if (err) {
      console.log(err);
    }
    const payload = {
      user: {
        id: u.id,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SCERET, {
      expiresIn: 100000000000,
    });

    let createdUser = await User.findById({ _id: u.id }).select(
      "-password -_id -__v"
    );

    return res.status(200).send({
      responseCode: 200,
      responseMessage: "SUCCESS",
      user: createdUser,
      token,
    });
  });
};

// editRolesFields
exports.editRolesFields = async (req, res) => {
  const { email, role, isAllowed } = req.body;
  const user = await User.findOne({ email }).select("-password");

  user.roles.map((r) => {
    if (r.role === role) {
      r.isAllowed = isAllowed;
    }
  });
  user.save((err, success) => {
    if (err) {
      return res
        .status(400)
        .json({ responseCode: 400, responseMessage: "FAILED" });
    } else {
      return res
        .status(200)
        .json({ responseCode: 200, responseMessage: "SUCCESS" });
    }
  });
};

//get user
exports.getUser = (req, res) => {
  const { userId } = req.body;
  User.findOne({ userId })
    .select("-password -_id -__v")
    .exec((err, user) => {
      if (err) {
        console.log(err);
      }

      return res.status(200).json({
        responseCode: 200,
        responseMessage: "SUCCESS",
        userDetails: user,
      });
    });
};

//update user image
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY,
});

exports.updateUserImage = (req, res) => {
  // const imageFileName = req.file.originalname.split(".");
  // console.log(Date.now());
  // console.log(req.file);
  // console.log(imageFileName);
  // fixing code push issues
};
//random changes
