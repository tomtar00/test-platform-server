const jwt = require('jsonwebtoken');
const token = require('./token')
const appExc = require('../utils/applicationException')

const userService = new (require('../service/userService'))()
const testService = new (require('../service/testSErvice'))()

const accessTokenSecret = process.env.SECRET
const timeIntervalSendNewToken = 10

const authorize = (req, res, isAuthorized) => {
    let accessToken = req.headers.access_token
    if (/^null$/i.test(accessToken)) accessToken = undefined

    if (!accessToken)
        return Promise.reject(appExc.err(appExc.UNAUTHORIZED, "Unauthorized access requested"))

    return new Promise((resolve, reject) => {
        // time left for token to expire (in minutes)
        const timeLeft = token.timeToExpire(accessToken) / 60000
        if (timeLeft <= 0) {
            reject(appExc.err(appExc.VALIDATION_FAILURE, `Your access token has expired ${-timeLeft} minutes ago`))
        }

        // verify user
        jwt.verify(accessToken, accessTokenSecret, (err, user) => {
            if (err) {
                reject(appExc.err(appExc.VALIDATION_FAILURE, err))
            }

            // get user permissions
            userService.findUserPermissions(user.id)
                .then(userPermissions => isAuthorized(userPermissions[0], user.id))
                .then(isAuth => {
                    if (isAuth) {
                        if (timeLeft < timeIntervalSendNewToken && timeLeft > 0) {
                            res.set('access_token', token.generateAccessToken(user.username, user.id))
                        }
                        else
                            res.set('access_token', accessToken)
                        resolve(true)
                    } else {
                        reject(appExc.err(appExc.FORBIDDEN, "Forbidden resource requested"))
                    }
                })
                .catch(_err => reject(_err))
        })
    })
}
exports.authorize = authorize

exports.user = (req, res, next) => {
    authorize(req, res, _ => true)
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}
exports.manage_permissions = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_manage_permissions))
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}
exports.manage_tests = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_manage_tests))
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}
exports.view_stats = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_view_stats))
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}
exports.access_admin_panel = (req, res, next) => {
    authorize(req, res, userPermissions => Promise.resolve(userPermissions.can_access_admin_panel))
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}
exports.solve_tests = (req, res, next) => {
    authorize(req, res, userPermissions => {
        return new Promise((resolve, reject) => {
            // find all user groups from database
            let user_groups
            userService.findUserGroups(userPermissions.account_id)
                .then(groups => {
                    user_groups = groups.map(g => g.group_name)
                    return testService.find(req.query.id || req.body[0].test_id)
                })
                .then(test => {
                    test = test[0]

                    // check if groups allow user to solve test
                    let group_allow = false
                    if (!test.groups) {
                        group_allow = true
                    }
                    else {
                        const common_groups = test.groups.filter(value => user_groups.includes(value))
                        group_allow = common_groups.length !== 0
                    }

                    if (!group_allow)
                        reject(appExc.err(appExc.PRECONDITION_FAILED, 'User doesn\'t belong to any of required groups'))

                    // check whether user in attempting to solve the test in proper time frames
                    const current_time = Date.now()
                    const start_time = test.start_time || -1
                    const end_time = test.end_time || Number.MAX_SAFE_INTEGER
                    const time_allow = start_time < current_time && end_time > current_time

                    if (!time_allow)
                        reject(appExc.err(appExc.PRECONDITION_FAILED, 'Tried to solve test outside time frames'))

                    resolve(true)
                })
                .catch(err => reject(err))
        })
    })
        .then(_ => next())
        .catch(err => appExc.handle(err, res, next))
}