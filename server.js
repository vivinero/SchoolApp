const express = require('express')
require("./config/config")
const router = require('./router/routers')
const scoreRouter = require("./router/scoreRouter")

require("dotenv").config()

const app = express()
app.use(express.json())

app.use(router)
app.use(scoreRouter)

const port = process.env.port

app.listen(port, ()=>{
    console.log(`server is listening on port: ${port}`)
})


