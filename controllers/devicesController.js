const db = require("../connection")
const jwt = require('jsonwebtoken')

const receiveData = async (req, res) => {
     const { deviceId, datas } = req.body
     const timestamp = Date.now()

     try {
          // const sqlAdd = `
          // INSERT INTO monitoring(${`device_id`},${`tegangan`},${`arus`},${`daya`},${`baterai`}, ${`timestamp`}) 
          // VALUES ('${deviceId}','${datas.tegangan}','${datas.arus}','${datas.daya}','${datas.baterai}','${datetime}')
          // `
          // const sqlUpdate = `
          // UPDATE device SET rt_tegangan='${datas.tegangan}', rt_arus='${datas.arus}',rt_daya='${datas.daya}',rt_baterai='${datas.baterai}' WHERE device_id='${deviceId}'
          // `
          // db.query(sqlUpdate, (err) => {
          //      if (err) throw err;
          // })

          // db.query(sqlAdd, (err) => {
          //      if (err) throw err;
          //      res.status(200).json({ deviceId, mode: "monitoring", mssg: "POST Berhasil" })
          // })
          res.status(200).json({
               status: 200,
               deviceId: deviceId,
               message: "Data terkirim",
               ts: datas.timestamp,
               val: {
                    frequency: datas.frequency,
                    humidity: datas.humidity,
                    temperature: datas.temperature,
                    voltage: datas.voltage
               }
          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

module.exports = {
     receiveData,
}