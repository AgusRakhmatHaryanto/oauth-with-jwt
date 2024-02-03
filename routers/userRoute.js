const express = require('express');
const route = express.Router()
const userController = require('../controllers/userController')

route.get(`/`, userController.getUsers)
route.get(`/:id`, userController.getUser)
route.post(`/`, userController.upload.single('photo'), userController.createUser)
route.put(`/:id`,userController.upload.single('photo'), userController.updateUser)

module.exports = route