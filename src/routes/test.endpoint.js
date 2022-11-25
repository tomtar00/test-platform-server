const TestController = require("../controller/testController")
const TestService = require('../service/testService')

exports.testRoutes = (router, authorize) => {

    const testService = new TestService()
    const testController = new TestController(testService)

    router.route('/tests/find-all')
        .get(testController.validate('findAll'), testController.findAll)

    router.route('/tests/find')
        .get(authorize.solve_tests, testController.validate('find'), testController.find)

    router.route('/tests/add')
        .post(authorize.manage_tests, testController.validate('add'), testController.add)

    router.route('/tests/delete')
        .delete(authorize.manage_tests, testController.validate('delete'), testController.delete)
}