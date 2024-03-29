// ROUTE UNTUK HTTP REQUEST USER

const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const { getResources, createEndpoint, getRecords, getEndpoints, getChartBar, getRecordsAll, changePassword, updateThreshold } = require('../controllers/usersController')

//SETIAP REQUEST MEMERLUKAN AUTENTIFIKASI
router.use(requireAuth) //Middleware authentifikasi

//sebelum menuju route dibawah ini, authentifikasi akan dilakukan
//apabila tidak valid maka tidak dapat mengakses route dibawah
router.get('/device/:deviceId/resources', getResources) //memperoleh data resource device 
router.get('/endpoint/get', getEndpoints) //memperoleh data endpoint
router.get('/records/:deviceName/:startDate/:endDate', getRecords) //memperoleh records device
router.get('/records/:deviceName', getRecordsAll) //memperoleh records device
router.get('/records/bar/:deviceName', getChartBar) // memperoleh data char Bar
router.post('/endpoint/create', createEndpoint) //membuat endpoint telegram
router.patch('/password/change', changePassword) //mengubah password
router.patch('/threshold/update', updateThreshold) //mengupdate thresshold

module.exports = router