const exp = require('express');
const Router = exp.Router();
const UserController = require('../controller/UserController');

Router .get('/', UserController.getAllUser)
       .post('/register', UserController.insertUser)
       .post('/login', UserController.loginUser)
       .get('/get/:id_user', UserController.getUserById)

module.exports = Router;