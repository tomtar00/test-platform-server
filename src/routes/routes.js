const { userRoutes } = require('./user.endpoint')
const { questionRoutes } = require('./question.endpoint')
const { testRoutes } = require('./test.endpoint')
const { answerRoutes } = require('./answer.endpoint');
const { resultRoutes } = require('./result.endpoint');

const auth = require('../middleware/auth')

exports.routes = (router) => {
    userRoutes(router, auth)
    questionRoutes(router, auth)
    testRoutes(router, auth)
    answerRoutes(router, auth)
    resultRoutes(router, auth)
}