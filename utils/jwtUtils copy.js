const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY, {
    expiresIn: "12h",
  });

  return token;
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded;
  }
  catch (err) {
    return false;
  }
}