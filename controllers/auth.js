const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* authenticate the user and provide login token */
exports.isAuth = async (req, res, next) => {
  const { userId, password } = req.body;
  let user = await User.findOne({ userId });
  if (!user) {
    return res.status(404).send("user no found");
  }
  const isMatch = await bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(400).send("invalid password");
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

  res.cookie("token", token, { expiresIn: 100000000000 });
  return res.status(200).json({ token, user });
};
