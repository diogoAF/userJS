const express = require('express')
const consign = require('consign')
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb'}))
app.use(bodyParser.json({limit: '50mb'}))
 
consign()
        .include('routes')
        .include('utils')
        .into(app)

app.listen(4000, 'localhost', () => {
    console.log('Servidor rodando.....')
})