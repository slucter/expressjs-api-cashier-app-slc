const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
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
    getAllUser: (req, res) => {
        knex('user').then((user) => {
            res.status(200).json({
                status: 200,
                msg: 'Gett All User',
                user
            })
        })
    },
    getUserById: (req, res) => {
        const id = req.params.id_user
        knex('user').where({id_user: id}).then((result) => {
            res.status(200).json({
                status: 200,
                msg: 'Getting this user',
                result
            })
        })
    },
    insertUser: (req, res) => {
        const { name_user, img_user, email_user, username, pwd_user } = req.body;
        knex('user').where({email_user : email_user}).orWhere({username: username}).then((cek) => {
            if(cek > 0){
                
            }
        })
        bcrypt.hash(pwd_user, 10, (err, hash)=>{
            if(err){
                res.send(200).json({
                    status: 404,
                    msg: 'Bcrypt Error'
                })
            } else {
                const data = {
                    name_user,
                    img_user,
                    email_user,
                    username,
                    pwd_user: hash,
                    token: 1337,
                    role_user: 1
                }
                knex('user').insert(data).then((result) =>{
                    res.status(200).json({
                        status: 200,
                        msg: 'Success Add New User!',
                        result
                    })
                })
            }
        })
    },
    loginUser: (req, res) => {
        const { username, pwd_user } = req.body;
        knex('user').where({ username: username}).then((data) => {

            if(data.length > 0 ){

                bcrypt.compare(pwd_user, data[0].pwd_user, (err, komper) => {
                    if(komper){
                        let datas = data[0]
                        let genToken = jwt.sign({id_user: datas.id_user, }, process.env.SECRET_BANGET);
                        delete datas.pwd_user;
                        datas.token = genToken
                        res.status(200).json({
                            status: 200,
                            msg: 'Berhasil Login',
                            datas
                        })

                    } else {
                        res.status(200).json({
                            status: 401,
                            msg: 'Password Salah!'
                        })
                    }
                })
            } else{
                
                res.status(200).json({
                    status: 401,
                    msg: 'User Belum Terdaftar'
                })
            }
        })
    }
}