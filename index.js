require('dotenv').config()

const express = require('express')
const db = require("./connection")
const cors = require('cors')

const app = express()

const oauthRoutes = require('./routes/oauthRoutes')
const devicesRoutes = require('./routes/devicesRoutes')
const usersRoutes = require('./routes/usersRoutes')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
     console.log(req.path, req.method)
     next()
})

app.get('/', (req, res) => {
     res.json({
          mssg: "Server is running"
     })
})

app.use('/v1/oauth', oauthRoutes)
app.use('/v1/users', usersRoutes)
app.use('/v1/devices', devicesRoutes)

app.listen(process.env.PORT, () => {
     console.log(`Server is running on port ${process.env.PORT}`)
})