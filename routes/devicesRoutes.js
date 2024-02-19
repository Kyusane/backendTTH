// ROUTE UNTUK HTTP REQUEST DEVICE 

//STATUS NOT USE (beberapa prosess dipindahkan ke route lain)
// data device terbuat otomatis ketika register
// data device diperoleh otomatis ketika login

const express = require('express')
const router = express.Router()

const { createDevice, getDevice } = require('../controllers/devicesController')

router.get('/', (req, res) => {
     res.status(200).json({ message: "Route is available" })
})

router.post('/createDevice', createDevice)//membuat device
router.get('/getDevice', getDevice)//memperoleh informasi device

module.exports = router