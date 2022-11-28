const RestService = require("./restService")
const userRepository = require('../repository/userRepository')
const exc = require("../utils/applicationException")

const customGroupsPath = './data/default_groups.json'
const modUsersPath = './data/modified_users.json'


class UserService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'users.accounts'
    }

    authenticate(credentials) {
        
    }

    insertGroupsToDatabase() {

    }

    getUserPermissions(groups) {

    }

    updateUserGroups(account_id, groups) {

    }

    updateUserPermissions(account_id, groups) {

    }

    find(id, name, page, page_size) {

    }

    findUserGroups(userId) {

    }

    editGroupsPermissions(groups) {
        
    }

    findAllGroups() {

    }

    findUserPermissions(userId) {
        return new Promise((resolve, reject) => {
            userRepository.findUserPermissions(userId)
                .then(permissions => {
                    if (permissions.length == 0)
                        reject(exc.err(exc.NOT_FOUND, 'User permissions not found'))
                    else resolve(permissions)
                })
                .catch(err => reject(err))
        })
    }
}

module.exports = UserService