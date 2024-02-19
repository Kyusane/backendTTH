// ROUTE UNTUK HTTP REQEUST AUTHENTIFIKASI

const express = require('express')
const router = express.Router()

const {userLogin,userSignUp} = require('../controllers/oauthController')

router.post('/login',userLogin)//route prosess login
router.post('/signup',userSignUp)//route prosess daftar

module.exports = router