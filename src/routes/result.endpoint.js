const ResultController = require("../controller/resultController")
const ResultService = require('../service/resultService')

exports.resultRoutes = (router, authorize) => {

    const resultService = new ResultService()
    const resultController = new ResultController(resultService)

    router.route('/results/find')
        .get(authorize.view_stats, resultController.validate('find'), resultController.find)

}