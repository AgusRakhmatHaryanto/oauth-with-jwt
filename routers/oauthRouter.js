  const express = require("express");
  const authController = require("../controllers/oauthController");
  require('dotenv').config()
  const api = process.env.API
  const route = express.Router();
  require('../middleware/passport')
  const authenticateToken = require("../middleware/auth");


  route.get("/",(req, res) => {
    res.send(`<a href="/${api}/oauth/auth/google">Authenticate with Google</a>`);
  });
  //ini untuk login
  route.get(`/auth/google`, authController.authenticateGoogle);

  route.get(`/google/callback`, authController.handleGoogleCallback);

  // ini untuk kalo sudah masuk
  route.get(`/protected`, authController.protectedRoute);

  route.get(`/logout`, authController.logout);

  route.get("/auth/failure", authController.authFailure);

  module.exports = route;
