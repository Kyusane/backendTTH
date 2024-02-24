// ROUTE UNTUK HTTP REQEUST AUTHENTIFIKASI

const express = require('express')
const router = express.Router()

const { userLogin, userSignUp, adminLogin } = require('../controllers/oauthController')

router.post('/login', userLogin)//route prosess login
router.post('/signup', userSignUp)//route prosess daftar
router.post('/admin', adminLogin)//route prosess daftar

module.exports = router