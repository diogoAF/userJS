const express = require('express')
let routes = express.Router()

routes.get('/', (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
        users: [{
            name: 'Motoko Kusanagi',
            email: 'motoko@gits.com',
            id: 3
        }]
    })
})

routes.get('/admin', (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
        users: []
    })
})

module.exports = routes