const jwt = require('jsonwebtoken');
const token = require('./token')
const appExc = require('../utils/applicationException')

const authorize = (req, res, isAuthorized) => {

    // TODO: check if user is authorized to do the action

    return Promise.reject(appExc.new(appExc.FORBIDDEN, "Forbidden resource requested"))
}
exports.authorize = authorize

exports.manage_permissions = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_manage_permissions))
        .then(next)
        .catch(err => appExc.errorHandler(err, res, next))
}
exports.manage_tests = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_manage_tests))
        .then(next)
        .catch(err => appExc.errorHandler(err, res, next))
}
exports.view_stats = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_view_stats))
        .then(next)
        .catch(err => appExc.errorHandler(err, res, next))
}
exports.access_admin_panel = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_access_admin_panel))
        .then(next)
        .catch(err => appExc.errorHandler(err, res, next))
}
exports.solve_tests = (req, res, next) => {
    authorize(req, res, userPermissions => {
        return new Promise((resolve, reject) => {
            // TODO: check if user is in required group and if time is ok
        })
    })
        .then(next)
        .catch(err => appExc.errorHandler(err, res, next))
}