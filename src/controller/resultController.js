const RestController = require("./restController")
const { query } = require('express-validator')
const error = require('../utils/applicationException')

class ResultController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            query('id').isInt().optional(),
            query('userId').isInt().optional(),
            query('testId').isInt().optional(),
            query('full').isBoolean().optional()
        ]
    }

    find = (req, res, next) => {
        const id = req.query.id
        const userId = req.query.userId
        const testId = req.query.testId
        const full = req.query.full

        this.service.find(id, userId, testId, full)
            .then(results => {
                res.status(200).send(results)
            })
            .catch(err => error.handle(err, res, next))
    }
}

module.exports = ResultController