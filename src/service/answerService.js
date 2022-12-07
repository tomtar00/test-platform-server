const RestService = require("./restService");
const ResultService = require('./resultService')
const exc = require('../utils/applicationException')

class AnswerService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.answers'

        this.resultService = new ResultService()
    }

    find = (id, questionId, userId, testId) => {
        return new Promise((resolve, reject) => {
            if (id) {
                super.find(id)
                    .then(answer => resolve(answer))
                    .catch(err => reject(err))
            }
            else {
                super.findBy({
                    question_id: questionId,
                    user_id: userId,
                    test_id: testId
                })
                .then(answers => resolve(answers))
                .catch(err => reject(err))
            }
        })
    }

    add = (body) => {
        return new Promise((resolve, reject) => {
            if (Array.isArray(body)) {
                super.add(body)
                    .then(addedAnswers => this.resultService.evaluate(addedAnswers))
                    .then(answersResults => resolve(answersResults))
                    .catch(err => reject(err))
            }
            else {
                reject(exc.err(exc.BAD_REQUEST, 'Answers payload must be an array'))
            }
        })
    }
}

module.exports = AnswerService