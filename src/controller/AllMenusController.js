const path = require('path');
const knex = require('knex')({
    client: 'mysql2',
    connection: {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
    }
})

module.exports = {
    getAllMenus: (req, res)=>{
        knex('all_menu').innerJoin('food_category', 'all_menu.category_menu', 'food_category.id_category').then((result)=>{
            res.status(200).json({
                status: 200,
                msg: 'Get All Menu',
                result,
            })
        })
    },
    paginationMenus: async (req, res) => {
        let page = req.query.page;
        const limit = req.query.limit;
        let search = req.query.search;
        let dimulai = limit * page - limit;
        let count = await knex('all_menu').count('id_menu', {as: 'total'});
        let totalPage = Math.ceil(parseInt(count[0].total) / limit);
        const pageMin = parseInt(page) - 1;
        if(search){

            knex('all_menu').innerJoin('food_category', 'all_menu.category_menu', 'food_category.id_category')
            .orderBy('id_menu').limit(limit).offset(dimulai).where('name_menu', 'like', `%${search}%`).then((result)=>{
                res.status(200).json({
                    status: 200,
                    msg: 'Pagination Details',
                    page: {
                        totalPage: totalPage,
                        thisPage: parseInt(page),
                        limitPage: parseInt(limit),
                        link: {
                            prev: pageMin < 1 ? null : `http://${process.env.ADDR_HOST}/api/AllMenu/page/?page=${page - 1}&limit=${limit}`,
                            next: parseInt(page) < totalPage ? `http://${process.env.ADDR_HOST}/api/AllMenu/page/?page=${parseInt(page) + 1}&limit=${limit}` : null,
                        }
                    },
                    result,
                })
            })
        } else {

            knex('all_menu').innerJoin('food_category', 'all_menu.category_menu', 'food_category.id_category')
            .orderBy('id_menu').limit(limit).offset(dimulai).then((result)=>{
                res.status(200).json({
                    status: 200,
                    msg: 'Pagination Details',
                    page: {
                        totalPage: totalPage,
                        thisPage: parseInt(page),
                        limitPage: parseInt(limit),
                        link: {
                            prev: pageMin < 1 ? null : `http://${process.env.ADDR_HOST}/api/AllMenu/page/?page=${page - 1}&limit=${limit}`,
                            next: parseInt(page) < totalPage ? `http://${process.env.ADDR_HOST}/api/AllMenu/page/?page=${parseInt(page) + 1}&limit=${limit}` : null,
                        }
                    },
                    result,
                })
            })
        }
    },
    addMenus: (req, res)=>{
        const { name_menu, category_menu, price_menu, stock_menu } = req.body;
        if(req.file != undefined){

            if(path.extname(req.file.originalname) != '.jpg' && path.extname(req.file.originalname) != '.png'){
                res.status(200).json({
                    status: 500,
                    success: 0,
                    msg: 'Extension Not Allowed -_-'
                })
            } else {
                knex('all_menu').insert({
                    name_menu,
                    img_menu: `http://${process.env.ADDR_HOST}/img/${req.file.filename}`,
                    category_menu,
                    price_menu,
                    stock_menu,
                    is_available: 1,
                }) .then((result)=>{
                    res.status(200).json({
                        status: 200,
                        success: 1,
                        msg: 'success add menu!',
                        result
                    })
                }) .catch((error) =>{
                    console.log('ok' + error)
                })

            }
        } else {
            res.json({
                status: 500,
                success: 0,
                msg: 'success add menu!'
            })
            console.log('fill in please!')
        }
    },
    updateMenu: (req, res)=>{
        const idFood = req.params.id_food;
        knex('all_menu').where({
            id_menu: idFood,
        }).update({
            name_menu : 'Menu Kedua',
        }).then((result)=>{
            res.status(200).json({
                result,
            })
        })
    },
    deleteMenu: (req, res)=>{
        const idFood = req.params.id_food;
        knex('all_menu').where({ id_menu: idFood}).del()
        .then((result)=>{
            res.status(200).json({
                result,
            })
        })
    },
    orderMenu: (req, res) => {
        const { order_menu, amount, invoice_code, id_user, date_order } = req.body;
        const data = {
            order_menu, amount, invoice_code, id_user, date_order
        }
        knex('orders').insert(data).then((order)=>{
            res.status(200).json({
                status: 200,
                msg: 'Success Order!',
                order
            })
        })
    },
    getOrders: (req, res) => {
        knex.select('user.name_user', 'orders.*').from('orders').innerJoin('user', 'orders.id_user', 'user.id_user').then((order) =>{
            res.status(200).json({
                status: 200,
                msg: 'Getting Orders',
                order
            })
        })
    }
}