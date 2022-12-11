const RestController = require("./restController")
const { query, oneOf } = require('express-validator')
const error = require('../utils/applicationException')

class ResultController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            oneOf([
                query('id').isInt(),
                query('testName').isString(),
                query('userName').isString()
            ])
        ]
    }

    find = (req, res, next) => {
        const id = req.query.id
        const userName = req.query.userName
        const testName = req.query.testName

        this.service.find(id, userName, testName)
            .then(results => {
                res.status(200).send(results)
            })
            .catch(err => error.handle(err, res, next))
    }
}

module.exports = ResultController