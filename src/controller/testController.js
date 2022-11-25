const RestController = require("./restController");
const { query } = require('express-validator')
const error = require('../utils/applicationException')

class TestController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            query('id', 'Test id not found').exists(),
            query('full').isBoolean().optional()
        ]
        this.methods.findAll = [
            query('page').isInt().optional(),
            query('page_size').isInt().optional(),
            query('name').isString().optional()
        ]
    }

    find = (req, res, next) => {
        const searchId = req.query.id
        const searchFull = req.query.full

        this.service.find(searchId, searchFull)
            .then(tests => {
                res.status(200).send(tests)
            })
            .catch(err => error.handle(err, res, next))
    }

    findAll = (req, res, next) => {
        const page = req.query.page
        const page_size = req.query.page_size
        const name = req.query.name

        this.service.findAll(page, page_size, name)
            .then(tests => {
                res.set('page-count', this.service.pageCount)
                res.status(200).send(tests)
            })
            .catch(err => error.handle(err, res, next))
    }
}

module.exports = TestController