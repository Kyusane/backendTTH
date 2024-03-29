// BERISI FUNGSI UNTUK OAUTH ROUTE

require('dotenv').config();

const db = require("../connection")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

//Generate token dengan parameter user_id
const createToken = (credential_id) => {
     return jwt.sign({ credential_id }, process.env.SECRET, { expiresIn: '3d' })
}

//Generate User Id dengan parameter UNIX_TIMESTAMP
const createUserId = (_timestamp) => {
     return (Math.floor(Math.random() * 1000000) + _timestamp)
}

//Generate Device Name dengan parameter panjang karakter
function createDeviceName(length) {
     let result = '';
     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     const charactersLength = characters.length;
     let counter = 0;
     while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
     }
     return result;
}

//LOGIN FUNCTION
const userLogin = async (req, res) => {
     //memperoleh data email dan password
     const { email, password } = req.body
     try {
          if (!email || !password) {//memastikan data lengkap
               res.status(400).json({ error: "All field must be Filled" })
          }

          //mencocokan data dengan database
          const sql = `SELECT * FROM users INNER JOIN devices ON users.id = devices.user_id where users.email='${email}'`
          db.query(sql, async (err, fields) => {
               //apabila tidak cocok atau error maka login gagal
               if (err) throw err
               if (fields.length == 0) {
                    return res.status(400).json({ error: "Incorrect email" })
               }
               const matching = await bcrypt.compare(password, fields[0].password)
               if (!matching) {
                    return res.status(400).json({ error: "Incorrect password" })
               }
               //apabila cocok maka mengembalikan data email, token, device_id, device_name , LOGIN BERHASIL
               const token = createToken(fields[0].user_id)
               const threshold = {
                    hum: [fields[0].hum_bot, fields[0].hum_top],
                    temp: [fields[0].temp_bot, fields[0].temp_top],
               }
               res.status(200).json({ email, token, threshold, username: fields[0].username, device_name: fields[0].device_name })
          })
     }
     catch (error) {
          res.status(400).json({ error: error.message })//ERROR HANDLER
     }
}

// SIGN UP / REGISTER FUNCTION
const userSignUp = async (req, res) => {
     const { email, password, username } = req.body // memperoleh data email, password , username
     try {
          if (!email || !password || !username) { //memastikan data lengkap
               res.status(400).json({ error: "Fields harus diisi" })
          }

          //memastikan apakah email sudah digunakan
          const sqlCheck = `SELECT * FROM users where email='${email}'`
          db.query(sqlCheck, (err, fields) => {
               if (err) throw err
               if (fields.length != 0) {
                    throw res.status(400).json({ error: "email sudah digunakan" })
               }
          })

          //Generate User_id, Device_Name, dan encrypt password
          const _timestamp = Date.now()
          const userId = createUserId(_timestamp)
          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(password, salt)
          const device_name = createDeviceName(30);
          const sqlSignUp = `INSERT INTO users (id,username, email, password, created_at, hum_bot, hum_top, temp_bot, temp_top) 
               VALUES ('${userId}','${username}','${email}','${hash}','${_timestamp}',40,70,21,25)`

          //Memasukan data ke database
          db.query(sqlSignUp, (err) => {
               if (err) throw err
               const sqlCreateDevice = `INSERT INTO devices (user_id,device_name,isConnected,created_at)
                    VALUES('${userId}','${device_name}','0','${_timestamp}')`
               db.query(sqlCreateDevice, (err) => {
                    if (err) throw err
                    const token = createToken(userId)
                    res.status(200).json({ email: email, token: token })
               })
          })
     }
     catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//LOGIN FUNCTION
const adminLogin = async (req, res) => {
     //memperoleh data email dan password
     const { email, password } = req.body
     try {
          if (!email || !password) {//memastikan data lengkap
               res.status(400).json({ error: "All field must be Filled" })
          }
          const sql = `SELECT * FROM admin  where admin.email='${email}'`
          db.query(sql, async (err, fields) => {
               if (err) throw err
               if (fields.length == 0) {
                    return res.status(400).json({ error: "Login Failed" })
               }
               if (fields[0].password != password) {
                    return res.status(400).json({ error: "Login Failed" })
               }
               const token = createToken(fields[0].credential_id)
               res.status(200).json({ email, token })
          })
     }
     catch (error) {
          res.status(400).json({ error: error.message })//ERROR HANDLER
     }
}

module.exports = {
     userLogin, userSignUp, adminLogin
}