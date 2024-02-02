const express = require('express');
require('dotenv').config()
const oauthRoute = require('./oauthRouter')
const router = express.Router();
const api = process.env.API

// app.use(`/${api}/user`, useroute)
router.use(`/${api}/oauth/`, oauthRoute)

module.exports = router
