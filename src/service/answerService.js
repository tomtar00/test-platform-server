const RestService = require("./restService");

class AnswerService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.answers'
    }

    find = (id, questionId, userId, testId) => {

    }

    add = (body) => {

    }
}

module.exports = AnswerService