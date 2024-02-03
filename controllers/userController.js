const { json } = require("sequelize");
const { User } = require("../models");
const path = require('path')
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

// Multer Storage
const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/photo");
//   },
  filename: (req, file, cb) => {
    cb(null, `photo-${Date.now()}` + path.extname(file.originalname));
  },
});

// Multer Filter
const multerFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(png|jpg|jfif)$/)) {
    return cb(new Error("Please upload an Photo (png/jpg)"));
  }
  cb(null, true);
};

// Multer Upload
exports.upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

exports.getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = req.query.page ? (parseInt(req.query.page) - 1) * limit : 0;
    const users = await User.findAll({
      order: [["id", "ASC"]],
      limit,
      offset,
    });

    res.json({ message: "Success", data: users });
    console.log(users);
  } catch (error) {
    res,
      json({
        message: "Failed",
        error: error,
      });
  }
};

exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Success",
      data: user,
    });
    console.log(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
    console.log(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, fullName, email, password, photo, role } = req.body;
    const image = await cloudinary.uploader.upload(req.file.path, {
      folder: "fix-oauth/photo",
      use_filename: true,
      public_id: uuidv4() + req.file.originalname + "-" + Date.now(),
    });
    const hashPassoword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      fullName,
      email,
      password: hashPassoword,
      photo: image.secure_url,
      role,
    });

    res.status(201).json({
      message: "Success",
      data: user,
    });
    console.log(user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, fullName, email, password, photo, role } = req.body;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      const image = await cloudinary.uploader.upload(req.file.path, {
        folder: "fix-oauth/photo",
        use_filename: true,
        public_id: uuidv4() + req.file.originalname + "-" + Date.now(),
      });

      const hashPassoword = await bcrypt.hash(password, 10);

      const updateUser = await User.update({
        username,
        fullName,
        email,
        password: hashPassoword,
        photo: image.secure_url,
        role,
      });

      res.status(200).json({
        message: "Success",
        data: updateUser,
      });
      console.log(updateUser);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
    console.log(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    const deleteUser = await User.destroy({
      where: {
        id: userId,
      },
    });

    res.status(200).json({
      message: "Success",
      data: deleteUser,
    });
    console.log(deleteUser);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
    console.log(error);
  }
};
