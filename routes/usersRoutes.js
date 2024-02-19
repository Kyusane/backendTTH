// ROUTE UNTUK HTTP REQUEST USER

const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const { getResources, createEndpoint, getRecords, getEndpoints , getChartBar } = require('../controllers/usersController')

//SETIAP REQUEST MEMERLUKAN AUTENTIFIKASI
router.use(requireAuth) //Middleware authentifikasi

//sebelum menuju route dibawah ini, authentifikasi akan dilakukan
//apabila tidak valid maka tidak dapat mengakses route dibawah
router.get('/device/:deviceId/resources', getResources) //memperoleh data resource device 
router.get('/endpoint/get', getEndpoints) //memperoleh data endpoint
router.get('/records/:deviceName', getRecords) //memperoleh records device
router.get('/records/bar/:deviceName',getChartBar) // memperoleh data char Bar
router.post('/endpoint/create', createEndpoint) //membuat endpoint telegram

module.exports = router