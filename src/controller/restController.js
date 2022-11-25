const { validationResult, query, body } = require('express-validator')
const error = require('../utils/applicationException')

class RestController {

    constructor(service) {
        this.service = service

        this.methods = {
            find: [
                query('id', 'User id not found').isInt().optional(),
                query('name').isString().optional(),
            ],
            add: [
                body().isJSON()
            ],
            edit: [
                query('id', 'User id not found').isInt().optional(),
                body().isJSON()
            ],
            delete: [
                query('id', 'User id not found').isInt().optional(),
            ]
        }
    }

    find = (req, res, next) => {
        const searchId = req.query.id
        const searchName = req.query.name

        this.service.find(searchId, searchName)
            .then(obj => {
                res.status(200).send(obj)
            })
            .catch(err => {
                error.handle(err, res, next)
            })
    }

    add = (req, res, next) => {
        const jsonReq = req.body

        this.service.add(jsonReq)
            .then(added => {
                res.status(201).send(added)
            })
            .catch(err => error.handle(err, res, next))
    }

    edit = (req, res, next) => {
        const jsonReq = req.body
        const searchId = req.query.id

        this.service.edit(jsonReq, searchId)
            .then(edited => {
                res.status(200).send(edited)
            })
            .catch(err => error.handle(err, res, next))
    }

    delete = (req, res, next) => {
        const searchId = req.query.id

        this.service.remove(searchId)
            .then(deleted => {
                res.status(200).send(deleted)
            })
            .catch(err => error.handle(err, res, next))
    }

    validate(method) {
        const checkErrors = (_req, res, next) => {
            const errors = validationResult(_req);
            if (!errors.isEmpty()) {
                res.status(400).send({ errors: errors.array() }).end();
            }
            else next()
        }

        const validators = this.methods[method] || false
        if (!validators) {
            console.log('Cannot find validators for method ' + method);
            return []
        }
        validators.push(checkErrors)
        return validators
    }
}

module.exports = RestController