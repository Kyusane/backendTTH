
const express = require('express')
const router = express.Router()
const adminAuth = require('../middleware/adminAuth')

const { getDeviceAll, changeUserPassword, deleteUser, deleteRecord } = require('../controllers/adminController')

router.use(adminAuth) //authorisasi admin
router.get('/deviceall', getDeviceAll) //get semua data device
router.patch('/changeUserPassword', changeUserPassword) // mengubah password user
router.delete('/users/delete', deleteUser) //menghapus user
router.delete('/records/delete', deleteRecord)

module.exports = router