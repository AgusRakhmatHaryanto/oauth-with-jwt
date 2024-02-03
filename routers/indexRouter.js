const express = require('express');
require('dotenv').config()
const authRoute= require('./authRoute')
const oauthRoute = require('./oauthRouter')
const userRoute = require('./userRoute')
const router = express.Router();
const api = process.env.API
const multer = require('multer')


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// app.use(`/${api}/user`, useroute)
// router.use(upload.any())
router.use(`/${api}/oauth/`, oauthRoute)
router.use(`/${api}/auth/`, authRoute)
router.use(`/${api}/user/`, userRoute)

module.exports = router
