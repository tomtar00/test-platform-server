const AnswerController = require("../controller/answerController")
const AnswerService = require('../service/answerService')

exports.answerRoutes = (router, authorize) => {

    const answerService = new AnswerService()
    const answerController = new AnswerController(answerService)

    router.route('/answers/find')
        .get(authorize.user, answerController.validate('find'), answerController.find)

    router.route('/answers/add')
        .post(authorize.solve_tests, answerController.validate('add'), answerController.add)
}