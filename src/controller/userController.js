const RestController = require("./restController");
const { body, query } = require('express-validator')
const error = require('../utils/applicationException')

class UserController extends RestController {

    constructor(service) {
        super(service)

        this.methods.find = [
            query('id', 'User id not found').isInt().optional(),
            query('name').isString().optional(),
            query('page').isInt().optional(),
            query('page_size').isInt().optional(),
        ]
        this.methods.findUserPermissions = [
            query('id', 'User id not found').isInt().exists()
        ]
        this.methods.findUserGroups = [
            query('userId', 'User id not found').isInt().exists()
        ]
        this.methods.authenticate = [
            body('username').isString().exists(),
            body('password').isString().exists()
        ]
        this.methods.findAllGroups = []
        this.methods.editGroupsPermissions = []
    }

    find = (req, res, next) => {
        const searchId = req.query.id
        const searchUserName = req.query.name
        const page = req.query.page
        const page_size = req.query.page_size

        this.service.find(searchId, searchUserName, page, page_size)
            .then(obj => {
                res.set('page-count', this.service.pageCount)
                res.status(200).send(obj)
            })
            .catch(err => error.handle(err, res, next))
    }

    findUserPermissions = (req, res, next) => {
        const id = req.query.id

        this.service.findUserPermissions(id)
            .then(permissions => {
                res.status(200).send(permissions)
            })
            .catch(err => error.handle(err, res, next))
    }

    findUserGroups = (req, res, next) => {
        const id = req.query.userId

        this.service.findUserGroups(id)
            .then(groups => {
                res.status(200).send(groups)
            })
            .catch(err => error.handle(err, res, next))
    }

    findAllGroups = (_, res, next) => {
        this.service.findAllGroups()
            .then(groups => {
                res.status(200).send(groups)
            })
            .catch(err => error.handle(err, res, next))
    }

    editGroupsPermissions = (req, res, next) => {
        const groups = req.body

        this.service.editGroupsPermissions(groups)
            .then(obj => {
                res.status(200).send(obj)
            })
            .catch(err => error.handle(err, res, next))
    }

    authenticate = (req, res, next) => {
        const credentials = req.body

        this.service.authenticate(credentials, res)
            .then(user => {
                res.status(200).send(user)
            })
            .catch(err => error.handle(err, res, next))
    }
}

module.exports = UserController