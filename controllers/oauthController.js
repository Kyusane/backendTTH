const db = require("../connection")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const validator = require('validator')

const createToken = (_userId) => {
     return jwt.sign({ _userId }, process.env.SECRET, { expiresIn: '3d' })
}

const userLogin = async (req, res) => {
     const { email, password } = req.body
     try {
          if (!email || !password) {
               res.status(400).json({ error: "All field must be Filled" })
          }
          // const sql = `SELECT * FROM user where email='${email}'`
          // db.query(sql, async (err, fields) => {
          //      if (err) throw err
          //      if (fields.length == 0) {
          //           return res.status(400).json({ error: "Incorrect email" })
          //      }
          //      const matching = await bcrypt.compare(password, fields[0].password)
          //      if (!matching) {
          //           return res.status(400).json({ error: "Incorrect password" })
          //      }
          //      const token = createToken(fields[0].email)
          //      res.status(200).json({ email, token })
          // })
          if (email == "labkal002@gmail.com" && password == "kalibrasiTTH") {
               const token = createToken("labkal002")
               res.status(200).json({ email, token })
          }
     }
     catch (error) {
          res.status(400).json({ error: error.message })
     }
}

//POST SIGNUP
const userSignUp = async (req, res) => {
     const { email, password, nama } = req.body
     try {
          if (!email || !password || !nama) {
               res.status(400).json({ error: "Fields harus diisi" })
          }

          const sqlCheck = `SELECT * FROM user where email='${email}'`
          db.query(sqlCheck, (err, fields) => {
               if (err) throw err
               if (fields.length != 0) {
                    throw res.status(400).json({ error: "email sudah digunakan" })
               }
          })

          const salt = await bcrypt.genSalt(10)
          const hash = await bcrypt.hash(password, salt)
          const sqlSignUp = `INSERT INTO user (nama, email, password, role, login_status) 
               VALUES ('${nama}','${email}','${hash}','1','0')`

          db.query(sqlSignUp, (err) => {
               if (err) throw err
               const token = createToken(email)
               res.status(200).json({ email: email, token: token })
          })
     }
     catch (error) {
          res.status(400).json({ error: error.message })
     }
}

module.exports = {
     userLogin, userSignUp
}