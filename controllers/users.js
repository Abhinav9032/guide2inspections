const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, position, shipType, createdDate } = req.body;

  const is_already_registered = await User.findOne({ email });

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
    name,
    email,
    password: hashedPassword,
    position,
    shipType,
    createdDate,
  });

  user.save((err, u) => {
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

    return res
      .status(200)
      .send({ responseCode: 200, responseMessage: "SUCCESS", user: u, token });
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
