const RestService = require("./restService");
const testRepository = require('../repository/testRepository')
const QuestionService = require('../service/questionService')

class TestService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.headers'
        this.itemName = 'test'

        this.questionService = new QuestionService()
    }

    find(id, full) {
        return new Promise((resolve, reject) => {
            if (full && /^true$/i.test(full)) {
                this.findFull(id)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
            else {
                super.find(id)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
        })
    }

    findFull(id) {
        return new Promise((resolve, reject) => {
            let test = {}
            testRepository.findTestById(id)
                .then(res => test = res[0])
                .then(_ => this.questionService.findTestQuestions(test.id))
                .then(questions => test.questions = questions)
                .then(_ => resolve([test]))
                .catch(err => reject(err))
        })
    }

    findAll(page, pageSize, name) {
        return new Promise((resolve, reject) => {
            super.paginate(name, page, pageSize, test => test.test_name)
                .then(tests => resolve(tests)).catch(_err => reject(_err))
        })
    }

    add(body) {
        return new Promise((resolve, reject) => {

            let test = {...body}
            let questions = JSON.parse(JSON.stringify(test.questions))
            delete test.questions

            testRepository.addTest(test)
                .then(addedTest => {
                    test = addedTest[0]
                    questions.forEach(question => question.test_id = test.id)
                    return this.questionService.addTestQuestions(questions)
                })
                .then(addedQuestions => {
                    test.questions = addedQuestions
                    resolve([test])
                })
                .catch(err => reject(err))
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            testRepository.removeTestById(id)
                .then(deletedTest => {
                    this.questionService.removeTestQuestions(id)
                    return deletedTest
                })
                .then(deletedTest => resolve(deletedTest))
                .catch(err => reject(err))
        })
    }
}

module.exports = TestService