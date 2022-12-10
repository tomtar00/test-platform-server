const RestRepository = require("./restRepository");
const format = require('pg-format');

class UserRepository extends RestRepository {
    static findGroupColumnNames() {
        return this.makeQuery(`SELECT column_name FROM information_schema.columns WHERE TABLE_NAME = '${this.groupsTable.split('.')[1]}'`)
    }

    static findUserPermissionsById(userId) {
        return this.makeQuery(`SELECT * FROM ${this.permissionsTable} WHERE account_id = $1`, [userId])
    }
    static findUserPermissionsByGroups(permissionNames, groupNames) {
        const values = permissionNames.map(p => `sum(${p}::int) > 0 as ${p}`).join(',')
        return this.makeQuery(`SELECT ${values} FROM ${this.groupsTable} WHERE group_name = ANY($1)`, [groupNames])
    }
    static addPermissions(userId, permissions) {
        const columns = ['account_id'].concat(Object.keys(permissions))
        const values = [userId].concat(Object.values(permissions))
        const body = {}
        columns.forEach((c, i) => {
            body[c] = values[i]
        })
        return this.insertSingle(this.permissionsTable, body)
    }
    static editUserPermissions(userId, permissions) {
        let { columns, values } = this.jsonBodyToQueryValues(permissions)
        let set_query = []
        columns.forEach((col, idx) => {
            set_query.push(col + '=' + values[idx])
        })
        return this.makeQuery(`UPDATE ${this.permissionsTable} SET ${set_query} WHERE account_id = $1 RETURNING *`, [userId])
    }

    static findUserByName(userName) {
        return this.makeQuery(`SELECT * FROM ${this.accountTable} WHERE account_name = $1`, [userName])
    }

    static addUser(userName, password) {
        return this.insertSingle(this.accountTable, {
            account_name: userName,
            password
        })
    }

    static findAllGroups() {
        return this.selectAll(this.groupsTable)
    }
    static findUserGroups(userId) {
        return this.makeQuery(`
            SELECT * FROM users.accounts a
            JOIN users.account_groups ac ON a.id = ac.account_id
            JOIN users.groups g ON ac.group_id = g.id
            WHERE a.id = $1`, [userId])
    }
    static findGroupIdsByGroupNames(groupNames) {
        return this.makeQuery(`SELECT id FROM ${this.groupsTable} WHERE group_name = ANY($1)`, [groupNames])
    }
    static findUserIdsFromGroupIds(groupIds) {
        return this.makeQuery(`SELECT account_id FROM users.account_groups WHERE group_id = ANY($1)`, [groupIds])
    }
    static editUserGroups(userId, groupIds) {
        const deleteOld = this.makeQuery(`DELETE FROM ${this.accountGroupsTable} WHERE account_id = $1`, [userId])
        const insertNew = this.makeQuery(format(`INSERT INTO ${this.accountGroupsTable} (account_id, group_id) VALUES %s`, [groupIds.map(g => `(${userId}, ${g.id})`)].join(',')), [])
        return Promise.all([deleteOld, insertNew])
    }
    static addGroups(groups) {
        const promises = []
        groups.forEach(group => {
            promises.push(this.insertSingle(this.groupsTable, group))
        })
        return Promise.all(promises)
    }
    static editGroups(groups) {
        const promises = []
        groups.forEach(group => {
            promises.push(this.updateSingle(this.groupsTable, group, group.id))
        })
        return Promise.all(promises)
    }
}

UserRepository.permissionsTable = 'users.account_permissions'
UserRepository.accountTable = 'users.accounts'
UserRepository.groupsTable = 'users.groups'
UserRepository.accountGroupsTable = 'users.account_groups'

module.exports = UserRepository