const http = require('http')

let server = http.createServer((req, res) => {
    switch(req.url){
        case '/':
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end('<h1>OK!</h1>')
            break
        case '/users':
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
                users: [{
                    name: 'Motoko Kusanagi',
                    email: 'motoko@gits.com',
                    id: 3
                }]
            }))
            break
    }
    
})

server.listen(3000, 'localhost', () => {
    console.log('Servidor rodando.....')
})