const Model = require("../models");
const User = Model.User;
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");

exports.register = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;
    const hashPassoword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      fullName: fullName,
      email: email,
      password: hashPassoword,
      role: "student",
    });

    res.status(201).json({ message: "Register Success", user: user });
    console.log(user);
  } catch (error) {
    res.status(500).json({ message: "Register Failed", error: error });
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwtUtils.generateJwt(user);
    res.status(200).json({ message: "Login Success", token: token });
    console.log(token);
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error: error });
    console.log(error);
  }
};
