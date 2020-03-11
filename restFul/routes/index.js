module.exports = app => {
    let route = app.route('/')
    route.get((req, res) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'text/html')
        res.end('<h1>OK!</h1>')
    })
}