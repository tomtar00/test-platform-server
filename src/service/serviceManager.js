class ServiceManager { }

const TestService = require('./testService')
ServiceManager.TestService = new TestService()
const UserService = require('./userService')
ServiceManager.UserService = new UserService()
const QuestionService = require('./questionService')
ServiceManager.QuestionService = new QuestionService()
const ResultService = require('./resultService')
ServiceManager.ResultService = new ResultService()
const AnswerService = require('./answerService')
ServiceManager.AnswerService = new AnswerService()

module.exports = ServiceManager