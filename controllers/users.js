const User = require("../models/User");
const bcrypt = require("bcrypt");
const defaultRoles = require("../actions/roles");

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
    roles: defaultRoles,
  });

  user.save((err, u) => {
    if (err) {
      console.log(err);
    }
    return res
      .status(200)
      .send({ responseCode: 200, responseMessage: "SUCCESS" });
  });
};

// editRolesFields
exports.editRolesFields = async (req, res) => {
  const { email, role, isAllowed } = req.body;
  const user = await User.findOne({ email });
  // user.roles = roleAssigned(user.position);
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