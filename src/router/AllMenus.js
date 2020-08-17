const exp = require('express');
const menus = require('../controller/AllMenusController');
const Router = exp.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './upload/img/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage
})

Router  .get('/', menus.getAllMenus)
        .get('/AllOrder', menus.getOrders)
        .post('/add', upload.single('img_menu'),menus.addMenus)
        .post('/order', menus.orderMenu)
        .put('/update/food/:id_food', menus.updateMenu)
        .delete('/delete/food/:id_food', menus.deleteMenu)
        .get('/page/', menus.paginationMenus)

module.exports = Router;