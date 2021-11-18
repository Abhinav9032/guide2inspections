const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* authenticate the user and provide login token */
exports.isAuth = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ responseCode: 404, responseMessage: "User not found" });
  }

  let modifiedDate = String(user.date);
  modifiedDate = modifiedDate
    .split(":")
    .join("-")
    .split(" ")
    .join("-")
    .substring(0, 21);

  let tempUser = {
    name: user.name,
    email: user.email,
    position: user.position,
    shipType: user.shipType,
    date: modifiedDate,
  };

  let roles = [];
  user.roles.map((i) => {
    if (i.isAllowed === true) {
      roles.push(i.role);
    }
  });

  const isMatch = await bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ responseCode: 400, responseMessage: "Invalid password" });
  }

  const payload = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SCERET, {
    expiresIn: 100000000000,
  });
  user.password = undefined;

  if (!token) {
    return res
      .status(500)
      .json({ responseCode: 500, responseMessage: "Internal server error" });
  }

  res.cookie("token", token, { expiresIn: 100000000000 });
  return res.status(200).json({
    token,
    responseCode: 200,
    responseMessage: "SUCCESSS",
    roles,
    user: tempUser,
  });
};
