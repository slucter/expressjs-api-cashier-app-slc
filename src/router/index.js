const exp = require('express');
const menu = require('./AllMenus');
const user = require('./User');
const Router = exp.Router();

Router  .use('/AllMenu/', menu)
        .use('/user/', user);

module.exports = Router;