const db = require("../connection")
const bcrypt = require('bcrypt')

const getDeviceAll = (req, res) => {
     const sql = "SELECT users.username, users.email, devices.device_name FROM devices INNER JOIN users ON devices.user_id = users.id"
     try {
          db.query(sql, (err, fields) => {
               if (err) throw err
               res.status(200).json(fields)
          })
     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

const deleteUser = (req, res) => {
     const { email } = req.body
     const sql = `DELETE users , devices
     FROM  users INNER JOIN devices ON users.id = devices.user_id 
     WHERE users.email = '${email}'`
     try {
          db.query(sql, (err) => {
               if (err) throw err
               res.status(200).json({ mssg: "DELETE SUCCESS" })
          })
     } catch {
          res.status(400).json({ mssg: "DELETE FAILED" })
     }
}

const changeUserPassword = async (req, res) => {
     const { emailTarget, passwordTarget, deviceTarget, uniqueCode } = req.body
     const salt = await bcrypt.genSalt(10)
     const hash = await bcrypt.hash(passwordTarget, salt)
     const insertSql = `INSERT INTO uniqcode(email, device_name, uniqcode) VALUES ('${emailTarget}','${deviceTarget}','${uniqueCode}')`
     const changeSql = `UPDATE users SET password = '${hash}' WHERE email ='${emailTarget}'`
     try {
          db.query(insertSql, (err) => {
               if (err) throw err
               db.query(changeSql, (err) => {
                    if (err) throw err
                    res.status(200).json({ mssg: "CHANGE PASSWORD SUCCESS" })
               })
          })
     } catch (error) {
          res.status(400).json({ mssg: "ACTION FAILED" })
     }
}

const deleteRecord = (req, res) => {
     const { dateThreshold } = req.body
     const delSql = `DELETE FROM records WHERE created_at < ${dateThreshold} `
     try {
          db.query(delSql, (err) => {
               if (err) throw err
               res.status(200).json({ mssg: "DELETE RECORD SUCCESS" })
          })
     } catch (error) {
          res.status(400).json({ mssg: "ACTION FAILED" })
     }
}

module.exports = {
     getDeviceAll,
     changeUserPassword,
     deleteUser,
     deleteRecord
}