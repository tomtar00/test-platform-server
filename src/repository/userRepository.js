const RestRepository = require("./restRepository");

const userPermissionsTable = 'users.account_permissions'

class UserRepository extends RestRepository
{
    static findUserPermissions(userId) {
        return this.makeQuery(`SELECT * FROM ${userPermissionsTable} WHERE account_id = $1`, [userId])
    }
}

module.exports = UserRepository