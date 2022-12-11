const QuestionService = require("./questionService");
const RestService = require("./restService");
const TestService = require("./testService");
const UserService = require("./userService");

class ResultService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.results'
        this.itemName = 'result'

        this.questionService = new QuestionService()
        this.testService = new TestService()
        this.userService = new UserService()
    }

    find = (id, userName, testName) => {
        return new Promise((resolve, reject) => {
            if (id) {
                super.find(id)
                    .then(result => resolve(result))
                    .catch(err => reject(err))
            }
            else {
                super.findBy({
                    user_name: userName,
                    test_name: testName
                }, false)
                    .then(results => resolve(results))
                    .catch(err => reject(err))
            }
        })
    }

    evaluate = (answersArray) => {
        return new Promise((resolve, reject) => {
            let userName, testName
            let _points = 0
            this.questionService.find(answersArray.map(a => a.question_id).join(','))
                .then(questions => {
                    answersArray.forEach(answer => {
                        const question = questions.find(q => q.id === answer.question_id)
                        const correct_answers = question.correct_answer_idx.sort((a, b) => a - b)
                        const given_answers = answer.given_answer_idx.sort((a, b) => a - b)
                        if (correct_answers.toString() === given_answers.toString())
                            _points++
                    })
                })
                .then(_ => this.userService.find(answersArray[0].user_id))
                .then(user => userName = user[0].account_name)
                .then(_ => this.testService.find(answersArray[0].test_id))
                .then(test => testName = test[0].test_name)
                .then(_ => {
                    const result = {
                        points: _points,
                        max_points: answersArray.length,
                        user_id: answersArray[0].user_id,
                        user_name: userName,
                        test_id: answersArray[0].test_id,
                        test_name: testName,
                        date: Date.now() + ''
                    }

                    return this.add(result)
                })
                .then(addedResult => resolve(addedResult))
                .catch(err => reject(err))
        })
    }
}

module.exports = ResultService