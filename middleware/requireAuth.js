// MIDDLEWARE AUTENTIFIKASI
// PROGRAM YANG BERJALAN SEBELUM MENGAKSES ROUTE YANG TERLINDUNGI

const jwt = require('jsonwebtoken')
const db = require('../connection')
require('dotenv')

//Menggunakan JSON WEB TOKEN

const requireAuth = async (req, res, next) => {
     const { authorization } = req.headers //memperoleh Bearer Token
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
          //kalau tidak ada token maka process tidak dilanjutkan
     }
     const token = authorization.split(' ')[1] //memisahkan token dari Bearer Token
     try {
          const { _id } = jwt.verify(token, process.env.SECRET) //Decrypt token menjadi data _id (user_id)
          req.user_id = _id //menyimpan dat id pada parameter request user_id
          next() //melanjutkan ke route selanjutnya
     } catch (error) {
          res.status(401).json({ error: "Request is not authorized" })
          //apabila token tidak valid maka akan error
     }
}

module.exports = requireAuth