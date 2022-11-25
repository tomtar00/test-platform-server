const RestController = require("./restController")
const { query } = require('express-validator')
const error = require('../utils/applicationException')

class AnswerController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            query('id').isInt().optional(),
            query('questionId').isInt().optional(),
            query('userId').isInt().optional(),
            query('testId').isInt().optional()
        ]
    }

    find = (req, res, next) => {
        const id = req.query.id
        const questionId = req.query.questionId
        const userId = req.query.userId
        const testId = req.query.testId

        this.service.find(id, questionId, userId, testId)
            .then(answers => {
                res.status(200).send(answers)
            })
            .catch(err => error.handle(err, res, next))
    }
}

module.exports = AnswerController