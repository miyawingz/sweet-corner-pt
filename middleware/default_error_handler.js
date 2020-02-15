const apiError = require('../lib/apiError');

module.exports = (err, req, res, next) => {
    if (err instanceof apiError ){
        res.status(err.status).send({
            message:err.message,
            status:err.status
        })
    }
    
    if (err.error) {
        res.status(500).send({
            message: err.error,
            status: 500
        })
    }

    res.status(err.status || 500).send({
        message: err.message,
        status: err.status || 500
    })
}