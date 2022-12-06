const RestService = require("./restService");
const questionRepository = require('../repository/questionRepository')

class QuestionService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.questions'
    }

    findTestQuestions(testId) {
        return questionRepository.findTestQuestions(testId)
    }

    addTestQuestions(questions) {
        return questionRepository.addTestQuestions(questions)
    }

    removeTestQuestions(testId) {
        return questionRepository.removeTestQuestions(testId)
    }
}

module.exports = QuestionService