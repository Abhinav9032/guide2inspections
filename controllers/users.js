const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { name, email, password, position, shipType } = req.body;
  let hashedPassword;

  const salt = await bcrypt.genSalt(10);
  hashedPassword = await bcrypt.hash(password, salt);

  let user = new User({
    name,
    email,
    password: hashedPassword,
    position,
    shipType,
  });

  user.save((err, u) => {
    if (err) {
      console.log(err);
    }
    return res.status(200).json(u);
  });
};
