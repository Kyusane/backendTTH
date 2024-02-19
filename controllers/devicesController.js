// BERISI FUNGSI UNTUK ROUTE DEVICE

const db = require("../connection")
const jwt = require('jsonwebtoken')


const createDevice = (req, res) => {
     const { deviceName } = req.body
     const { authorization } = req.headers

     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
     }
     const token = authorization.split(' ')[1]
     try {
          const { _id } = jwt.verify(token, process.env.SECRET)
          if (_id == undefined) throw error
          const sqlAdd = `
          INSERT INTO devices(${`user_id`},${`device_name`},${`isConnected`},${`created_at`}) 
          VALUES ('${_id}','${deviceName}','0','${Date.now()}')
          `
          db.query(sqlAdd, (err) => {
               if (err) throw err;
               res.status(200).json({ deviceName, mssg: "Create Device Berhasil" })
          })
     } catch (error) {
          res.status(401).json({ error: "Request is not authorized" })
     }


}

const getDevice = (req, res) => {
     const { authorization } = req.headers
     if (!authorization) {
          return res.status(401).json({ error: "Authorization token required" })
     }
     const token = authorization.split(' ')[1]
     try {
          const { _id } = jwt.verify(token, process.env.SECRET)
          if (_id == undefined) throw error
          const getSql = `
          SELECT * FROM devices where user_id = ${_id}
          `
          db.query(getSql, (err, fields) => {
               if (err) throw err;
               res.status(200).json({
                    id: fields[0].id,
                    deviceName: fields[0].device_name
               })
          })
     } catch (error) {
          res.status(401).json({ error: "Request is not authorized" })
     }



}

module.exports = {
     createDevice,
     getDevice
}