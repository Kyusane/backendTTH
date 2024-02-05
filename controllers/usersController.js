const db = require("../connection")
const jwt = require('jsonwebtoken')


const getResources = async (req, res) => {
     const { deviceId } = req.params
     try {
          // const { authorization } = req.headers
          // if (!authorization) {
          //      return res.status(401).json({ error: "Authorization token required" })
          // }

          // const getToken = authorization.split(' ')[1]
          // const { _id } = jwt.verify(getToken, process.env.SECRET)

          // const getUserId = `select user_id,role from user where email='${_id}'`
          // db.query(getUserId, (err, fields) => {
          //      if (fields[0].role == 1) {
          //           const sql = `SELECT rt_arus,rt_tegangan,rt_daya,rt_baterai FROM device where device_Id='${deviceId}'`
          //           db.query(sql, (err, datas) => {
          //                if (err) throw err;
          //                res.status(200).json({ deviceId, datas })
          //           })
          //      } else {
          //           const sql = `SELECT rt_arus,rt_tegangan,rt_daya,rt_baterai FROM device where device_Id='${deviceId}' AND user_id=${user_id}`
          //           db.query(sql, (err, datas) => {
          //                if (err) throw err;
          //                res.status(200).json({ deviceId, datas })
          //           })
          //      }

          // }){
          res.status(200).json({
               ts: Date.now(),
               val: {
                    frequency: Math.floor(Math.random() * 5) + 50,
                    humidity: Math.floor(Math.random() * 20) + 55,
                    temperature: Math.floor(Math.random() * 5) + 23,
                    voltage: Math.floor(Math.random() * 5) + 218,
               }
          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

module.exports = {
     getResources
}