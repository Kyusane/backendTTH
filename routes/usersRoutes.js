const express = require('express')
const router = express.Router()
const requireAuth = require('../middleware/requireAuth')

const { getResources } = require('../controllers/usersController')

router.use(requireAuth)

router.get('/devices/:device/resources', getResources)

module.exports = router