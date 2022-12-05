const RestRepository = require("./restRepository");

class QuestionRepository extends RestRepository {

    static findTestQuestions(testId) {
        return this.selectBy(this.questionsTable, { test_id: testId })
    }

    static addTestQuestions(questions) {
        return this.insertMultiple(this.questionsTable, questions)
    }

    static removeTestQuestions(testId) {
        return this.makeQuery(`DELETE FROM ${this.questionsTable} WHERE test_id = $1 RETURNING *`, [testId])
    }
}

QuestionRepository.questionsTable = 'tests.questions' 

module.exports = QuestionRepository