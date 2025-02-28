require('dotenv').config()
const { APP_PORT } = process.env

const express = require('express')
const router = require('./src/routes/router')
const app = express()

app.use(express.json())
app.use('/api', router)

app
    .listen(APP_PORT, () => console.info(`Server is listening on port ${APP_PORT}`))
    .on("error", (error) => console.error("Error:", error.message))