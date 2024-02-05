const express = require('express')
const router = express.Router()

const { receiveData } = require('../controllers/devicesController')

router.get('/', (req, res) => {
     res.status(200).json({ message: "Route is available" })
})
router.post('/', receiveData)

module.exports = router