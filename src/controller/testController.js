const RestController = require("./restController");
const { query, body, oneOf } = require('express-validator')
const error = require('../utils/applicationException')

class TestController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            query('id', 'Test id not found').exists(),
            query('full').isBoolean().optional()
        ]
        this.methods.add = [
            body().isObject(),
            body('test_name', 'Wrong test name').isString(),
            body('questions', 'Questions must be ab array').isArray()
        ]
        this.methods.findAll = [
            oneOf([
                query('name').isString().optional(),
                query('page').isInt(),
                query('page_size').isInt()
            ])
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