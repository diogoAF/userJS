module.exports = {
    user: (app, req, res, validationResult) => {
        let errors = validationResult(req)

        if(!errors.isEmpty()){
            app.utils.error.send(errors, req, res)
            return false
        }
        return true
    }
}