const db = require("../connection")

const getDeviceAll = (req, res) => {
     const sql = "SELECT users.username, users.email, devices.device_name FROM devices INNER JOIN users ON devices.user_id = users.id"
     db.query(sql, (err, fields) => {
          res.status(200).json(fields)
     })

}


module.exports = {
     getDeviceAll
}