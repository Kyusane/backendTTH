
const express = require('express')
const router = express.Router()

const { getDeviceAll } = require('../controllers/adminController')

router.get('/deviceall', getDeviceAll)

module.exports = router