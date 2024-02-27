// MIDDLEWARE AUTENTIFIKASI
// PROGRAM YANG BERJALAN SEBELUM MENGAKSES ROUTE YANG TERLINDUNGI

const jwt = require('jsonwebtoken')
const db = require('../connection')
require('dotenv')

//Menggunakan JSON WEB TOKEN

const adminAuth = async (req, res, next) => {
     const { authorization } = req.headers //memperoleh Bearer Token
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
          //kalau tidak ada token maka process tidak dilanjutkan
     }
     const token = authorization.split(' ')[1] //memisahkan token dari Bearer Token
     try {
          const { credential_id } = jwt.verify(token, process.env.SECRET) //Decrypt token menjadi data _id (user_id)
          db.query(`SELECT * FROM admin WHERE credential_id ='${credential_id}'`, (err, fields) => {
               if (err) throw err
               if (fields.length != 0) {
                    next() //melanjutkan ke route selanjutnya
               } else {
                    return res.status(401).json({ error: "Request is not authorized" })
               }
          })
     } catch (error) {
          res.status(401).json({ error: "Request is not authorized" })
          //apabila token tidak valid maka akan error
     }
}

module.exports = adminAuth