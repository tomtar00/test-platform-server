const QuestionController = require("../controller/questionController")
const QuestionService = require('../service/questionService')

exports.questionRoutes = (router, authorize) => {

    const questionService = new QuestionService()
    const questionController = new QuestionController(questionService)

    router.route('/questions/find')
        .get(authorize.solve_tests, questionController.validate('find'), questionController.find)

}