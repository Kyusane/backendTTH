// BERISI FUNGSI UNTUK USER ROUTE

const db = require("../connection")
const jwt = require('jsonwebtoken')


const getResources = async (req, res) => {
     const { deviceId } = req.params
     try {
          const sql = `SELECT frequency,humidity, temperature,voltage,created_at FROM records where device_id='${deviceId}'ORDER BY created_at DESC LIMIT 1
          `
          db.query(sql, (err, datas) => {
               if (err) throw err
               if (datas.length == 0) {
                    res.status(400).json({ mssg: "No Record" })
               } else {
                    res.status(200).json({
                         ts: parseInt(datas[0].created_at),
                         val: {
                              frequency: datas[0].frequency,
                              humidity: datas[0].humidity,
                              temperature: datas[0].temperature,
                              voltage: datas[0].voltage
                         }
                    })
               }
          })

     } catch (error) {
          res.status(400).json({ error: error.message })
     }
}

const createEndpoint = (req, res) => {
     const { botToken, chatIdentifier, deviceName, endpoint_desc } = req.body
     const time = Date.now()
     const createEndpoint = `INSERT INTO endpoints (user_id, endpoint_desc,bot_token,chat_identifier,created_at,modified_at,device_name)
     VALUES ('${req.user_id}','${endpoint_desc}','${botToken}','${chatIdentifier}','${time}','${time}','${deviceName}')`
     db.query(createEndpoint, (err) => {
          if (err) throw err
          res.status(200).json({
               mssg: "Endpoint Create Successfully"
          })
     })

}

const getEndpoints = (req, res) => {
     const getEndpoints = `SELECT * FROM endpoints WHERE user_id = '${req.user_id}'`
     db.query(getEndpoints, (err, fields) => {
          if (err) throw err
          res.status(200).json(fields)
     })

}

const getRecords = (req, res) => {
     const { deviceName, startDate, endDate } = req.params
     const getRecords = `SELECT * FROM records WHERE device_name = '${deviceName}' AND created_at BETWEEN ${startDate} AND ${endDate}`
     db.query(getRecords, (err, fields) => {
          if (err) throw err
          var data = fields.map(d => {
               return {
                    ts: parseInt(d.created_at),
                    val: {
                         frequency: d.frequency,
                         humidity: d.humidity,
                         temperature: d.temperature,
                         voltage: d.voltage
                    }
               }
          })
          res.status(200).json(data)
     })
}

const getRecordsAll = (req, res) => {
     const { deviceName } = req.params
     const getRecords = `SELECT * FROM records WHERE device_name = '${deviceName}'`
     db.query(getRecords, (err, fields) => {
          if (err) throw err
          var data = fields.map(d => {
               return {
                    ts: parseInt(d.created_at),
                    val: {
                         frequency: d.frequency,
                         humidity: d.humidity,
                         temperature: d.temperature,
                         voltage: d.voltage
                    }
               }
          })
          res.status(200).json(data)
     })
}

const getChartBar = (req, res) => {
     const { deviceName } = req.params
     const getDaily = `SELECT 
     DATE_FORMAT(FROM_UNIXTIME(created_at / 1000), '%Y-%m-%d') AS date,
     AVG(frequency) AS avg_freq,
     AVG(humidity) AS avg_hum,
     AVG(temperature) AS avg_temp,
     AVG(voltage) AS avg_volt
     FROM records
     WHERE 
     FROM_UNIXTIME(created_at / 1000) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) && device_name = '${deviceName}'
     GROUP BY 
     date`

     const getWeek = `SELECT 
     CONCAT('Week ', WEEK(FROM_UNIXTIME(created_at/1000)),' ',YEAR(FROM_UNIXTIME(created_at/1000))) AS date,
     AVG(frequency) AS avg_freq,
     AVG(humidity) AS avg_hum,
     AVG(temperature) AS avg_temp,
     AVG(voltage) AS avg_volt
     FROM 
          records
     WHERE 
          FROM_UNIXTIME(created_at/1000) >= DATE_SUB(CURDATE(), INTERVAL 7 WEEK) && device_name = '${deviceName}'
     GROUP BY 
     date;`

     const getMonth = `SELECT 
     CONCAT( MONTHNAME(FROM_UNIXTIME(created_at/1000)),' ', YEAR(FROM_UNIXTIME(created_at/1000))) AS date,
     AVG(frequency) AS avg_freq,
     AVG(humidity) AS avg_hum,
     AVG(temperature) AS avg_temp,
     AVG(voltage) AS avg_volt
     FROM 
          records
     WHERE 
          FROM_UNIXTIME(created_at/1000) >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH) && device_name = '${deviceName}'
     GROUP BY 
     YEAR(FROM_UNIXTIME(created_at/1000)), date;`


     db.query(getDaily, (err, daily) => {
          if (err) throw err
          db.query(getWeek, (err, weekly) => {
               if (err) throw err
               db.query(getMonth, (err, monthly) => {
                    if (err) throw err
                    res.status(200).json([daily, weekly, monthly])
               })
          })
     })


}

module.exports = {
     getResources,
     createEndpoint,
     getEndpoints,
     getRecords,
     getRecordsAll,
     getChartBar
}