const RestController = require("./restController")
const { query, oneOf } = require('express-validator')
const error = require('../utils/applicationException')

class AnswerController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            oneOf([
                query('id').isInt(),
                query('questionId').isInt(),
                query('userId').isInt(),
                query('testId').isInt()
            ])
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