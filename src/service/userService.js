const RestService = require("./restService")
const userRepository = require('../repository/userRepository')
const exc = require("../utils/applicationException")
const jsonTools = require('../utils/jsonTools')
const token = require('../middleware/token')

const groupsPath = './data/default_groups.json'
const modUsersPath = './data/modified_users.json'

class UserService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'users.accounts'
    }

    async insertGroupsToDatabase() {
        // add custom groups
        const baseGroups = jsonTools.readFromFile(groupsPath)
        const databaseGroups = await this.findAllGroups()
        const baseGroupsToBeAdded = baseGroups.filter(g => !databaseGroups.map(dg => dg.group_name).includes(g.group_name))

        if (baseGroupsToBeAdded.length > 0)
            userRepository.addGroups(baseGroupsToBeAdded)
                .catch(_err => console.error(_err))
    }

    // ======================================================================

    authenticate(credentials, res) {
        return new Promise((resolve, reject) => {
            let { username, password } = credentials

            if (!username || !password) {
                reject(exc.err(exc.BAD_REQUEST, 'Wrong credentials format'))
                return
            }

            let user, user_groups
            userRepository.findUserByName(username)
                .then(_user => {
                    user = _user

                    // get user groups
                    user_groups = []
                    const customGroups = jsonTools.readFromFile(groupsPath)

                    // add 'User' group to EVERY user
                    if (customGroups.find(g => g.cn === 'Student'))
                        user_groups.push('Student')

                    // apply groups to a single user (from modified_users.json)
                    const mod_users = jsonTools.readFromFile(modUsersPath)
                    mod_users.filter(obj => obj.account_name === username).forEach(u => {
                        u.groups.forEach(g => user_groups.push(g))
                    })

                    // get account permissions
                    return this.getUserPermissions(user_groups)
                })
                .then(permissions => {
                    // check if already in database
                    if (user.length === 0) {
                        // if not - add account 
                        userRepository.addUser(username, password)
                            .then(_user => {
                                user = _user[0]

                                this.updateUserGroups(user.id, user_groups)
                                    .catch(_err => reject(_err))
                                userRepository.addPermissions(user.id, permissions)
                                    .catch(_err => reject(_err))
                            })
                            .then(() => {
                                res.set('access_token', token.generateAccessToken(username, user.id))
                                resolve([user])
                            })
                            .catch(_err => reject(_err))
                    }
                    else {
                        // if exists - check password & update groups and permissions
                        user = user[0]
                        if (password !== user.password)
                            reject(exc.err(exc.VALIDATION_FAILURE, "Incorrect password"))
                        else {
                            this.updateUserGroups(user.id, user_groups)
                                .catch(_err => reject(_err))
                            this.updateUserPermissions(user.id, user_groups)
                                .catch(_err => reject(_err))

                            res.set('access_token', token.generateAccessToken(username, user.id))
                            resolve([user])
                        }
                    }
                })
                .catch(_err => reject(_err))
        })
    }

    getUserPermissions(groupNames) {
        return new Promise((resolve, reject) => {
            // get permissions column names
            userRepository.findGroupColumnNames()
                .then(res => {
                    this.permissions_names = []
                    res.filter(item => item.column_name.toLowerCase().includes('can_'))
                        .forEach((item) => this.permissions_names.push(item.column_name))
                    if (groupNames.length > 0) {
                        userRepository.findUserPermissionsByGroups(this.permissions_names, groupNames)
                            .then(permissions => resolve(permissions[0]))
                            .catch(err => reject(err))
                    }
                    else {
                        resolve(this.permissions_names.map(() => false))
                    }
                })
        })
    }

    updateUserGroups(userId, groupNames) {
        return new Promise((resolve, reject) => {
            if (groupNames.length === 0)
                resolve('')
            else {
                userRepository.findGroupIdsByGroupNames(groupNames)
                    .then(groupsIds => userRepository.editUserGroups(userId, groupsIds))
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
        })
    }

    updateUserPermissions(userId, groups) {
        return new Promise((resolve, reject) => {
            this.getUserPermissions(groups)
                .then(permissions => userRepository.editUserPermissions(userId, permissions))
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    // ===================================================================

    find(id, name, page, pageSize) {
        return new Promise((resolve, reject) => {
            if (id)
                super.find(id).then(user => resolve(user)).catch(_err => reject(_err))
            else {
                pageSize = parseInt(pageSize)
                page = parseInt(page)

                if (((!page || !pageSize) && !name) || page < 1 || pageSize < 1)
                    reject(exc.err(exc.BAD_REQUEST,
                        `Passed invalid pagination params: page = ${page}, page_size = ${pageSize}`))
                else {
                    let promise = (!page || !pageSize) && name ? userRepository.selectAll(userRepository.accountTable) : 
                        userRepository.paginate(userRepository.accountTable, page, pageSize)
                    
                    promise
                        .then(users => {
                            if (name)
                                users = users.filter(user =>
                                    user.account_name.toLowerCase().includes(name.toLowerCase())
                                )
                            if (users.length > 0) {
                                this.pageCount = Math.ceil(users[0].count / pageSize)
                                resolve(users)
                            }
                            else {
                                reject(exc.err(exc.NOT_FOUND, 'Users not found'))
                            }

                        })
                        .catch(err => reject(err))
                }
            }
        })
    }

    findUserGroups(userId) {
        return new Promise((resolve, reject) => {
            userRepository.findUserGroups(userId)
                .then(groups => {
                    if (groups.length === 0)
                        reject(exc.err(exc.NOT_FOUND, 'User groups not found'))
                    else resolve(groups)
                })
                .catch(err => reject(err))
        })
    }

    editGroupsPermissions(groups) {
        return new Promise((resolve, reject) => {
            let users_affected = []

            userRepository.editGroups(groups)
                .then(() => {
                    const groupIds = groups.map(g => g.id)
                    return userRepository.findUserIdsFromGroupIds(groupIds)
                })
                .then(res => {
                    users_affected = res.map(u => u.account_id)
                    // get unique ids
                    users_affected = [...new Set(users_affected)]

                    users_affected.forEach(uid => {
                        this.findUserGroups(uid)
                            .then(_groups => {
                                return this.updateUserPermissions(uid, _groups.map(g => g.group_name))
                            })
                            .catch(err => reject(err))
                    })
                    resolve(groups)
                })
                .catch(err => reject(err))
        })
    }

    findAllGroups() {
        return new Promise((resolve, reject) => {
            userRepository.findAllGroups()
                .then(groups => {
                    if (groups.length === 0)
                        reject(exc.err(exc.NOT_FOUND, 'Groups not found'))
                    else resolve(groups)
                })
                .catch(err => reject(err))
        })
    }

    findUserPermissions(userId) {
        return new Promise((resolve, reject) => {
            userRepository.findUserPermissionsById(userId)
                .then(permissions => {
                    if (permissions.length === 0)
                        reject(exc.err(exc.NOT_FOUND, 'User permissions not found'))
                    else resolve(permissions)
                })
                .catch(err => reject(err))
        })
    }
}

module.exports = UserService