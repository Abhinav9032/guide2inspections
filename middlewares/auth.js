const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
  const token = req.header("auth-token");

  if (!token) {
    return res.status(401).send("No Token, authorization denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SCERET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send("Inavlid Token");
  }
};
