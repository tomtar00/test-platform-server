const RestService = require("./restService")

const customGroupsPath = './data/db_extensions/additional_groups.json'
const modUsersPath = './data/db_extensions/modified_users.json'


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

    getUserGroups(userId) {

    }

    editGroupsPermissions(groups) {
        
    }

    findAllGroups() {

    }

    findUserPermissions(userId) {

    }
}

module.exports = UserService