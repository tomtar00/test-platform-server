const RestService = require("./restService");

class QuestionService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.questions'
    }

    removeSingle(id) {

    }

    removeMultiple(ids) {

    }
}

module.exports = QuestionService