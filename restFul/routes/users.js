let NeDB = require('nedb')
let db = new NeDB({
    filename: 'users.db',
    autoload: true
})

const { check, validationResult } = require('express-validator')
// Array contendo os campos que devem e como devem ser validados
const userArrayFields = [
                check('name').isAscii().withMessage('Nome inválido.'),
                check('email').isEmail().withMessage('E-mail inválido.')
                ]

module.exports = app => {
    let route = app.route('/users')

    route.get((req, res) => {
        db.find({}).sort({name:1}).exec((err, users) => {
            if(err){
                app.utils.error.send(err, req, res, 500)
            } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json({users})
            }
        })
    })
    
    route.post(userArrayFields, (req, res) => {
        // Valida os campos informados
        if(!app.utils.validator.user(app, req, res, validationResult)) return false

        db.insert(req.body, (err, user) => {
            if(err){
                app.utils.error.send(err, req, res)
            } else {
                res.status(200).json(user)
            }
        })
    })

    let routeId = app.route('/users/:id')
    
    routeId.get((req, res) => {
        db.findOne({_id: req.params.id}).exec((err, user) => {
           if(err){
               app.utils.error.send(err, req, res )
           } else {
               res.status(200).json(user)
           }
        })
    })

    routeId.put(userArrayFields, (req, res) => {
        // Valida os campos informados
        if(!app.utils.validator.user(app, req, res, validationResult)) return false

        db.update({_id: req.params.id}, req.body, err => {
           if(err){
               app.utils.error.send(err, req, res )
           } else {
               res.status(200).json(Object.assign(req.body, req.params))
           }
        })
    })

    routeId.delete((req, res) => {
        db.remove({_id: req.params.id}, {}, err => {
            if(err){
                app.utils.error.send(err, req, res )
            } else {
                res.status(200).json(req.params)
            }
        })
    })
}