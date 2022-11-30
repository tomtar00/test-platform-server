const { userRoutes } = require('./user.endpoint')
const { questionRoutes } = require('./question.endpoint')
const { testRoutes } = require('./test.endpoint')
const { answerRoutes } = require('./answer.endpoint');
const { resultRoutes } = require('./result.endpoint');

const ServiceManager = require('../service/serviceManager')

const TestService = require('../service/testService')
ServiceManager.TestService = new TestService()
const UserService = require('../service/userService')
ServiceManager.UserService = new UserService()
const QuestionService = require('../service/questionService')
ServiceManager.QuestionService = new QuestionService()
const ResultService = require('../service/resultService')
ServiceManager.ResultService = new ResultService()
const AnswerService = require('../service/answerService')
ServiceManager.AnswerService = new AnswerService()

const auth = require('../middleware/auth')

exports.routes = (router) => {
    userRoutes(router, auth)
    questionRoutes(router, auth)
    testRoutes(router, auth)
    answerRoutes(router, auth)
    resultRoutes(router, auth)
}