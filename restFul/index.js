const express = require('express')
let routesIndex = require('./routes/index.js') 
let routesUsers = require('./routes/users.js')

let app = express()
 
app.use(routesIndex)
app.use('/users',routesUsers)

app.listen(3000, 'localhost', () => {
    console.log('Servidor rodando.....')
})