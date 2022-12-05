const { pgConfig } = require('../config')
const format = require('pg-format');

class RestRepository {

    static makeQuery(query, params) {
        return new Promise((resolve, reject) => {
            pgConfig.query(query, params, (error, results) => {
                if (error) {
                    reject(error + '\nQUERY: ' + query + "\nPARAMS: " + params)
                }
                else {
                    resolve(results.rows)
                }
            })
        })
    }

    static jsonBodyToQueryValues(body) {
        const columns = Object.keys(body)
        let values = Object.values(body)
        values = values.map(value => {
            if (Array.isArray(value)) {
                const sign = typeof value[0] == 'string' ? '%L' : '%s'
                return `ARRAY[${format(sign, value)}]`
            }
            else if (typeof value == 'string')
                return `'${value}'`
            else return value
        })
        return { columns, values }
    }

    static selectBy(tableName, entry) {
        let conditions = []
        Object.entries(entry).forEach(keyValue => {
            conditions.push(keyValue[0] + " = " + keyValue[1])
        })
        conditions = conditions.join(' AND ')
        return this.makeQuery(format(`SELECT * FROM ${tableName} WHERE %s`, conditions))
    }

    static selectAll(tableName) {
        return this.makeQuery(`SELECT * FROM ${tableName}`)
    }

    static selectSingle(tableName, id) {
        return this.makeQuery(`SELECT * FROM ${tableName} WHERE id = $1`, [id])
    }

    static selectMultiple(tableName, ids) {
        return this.makeQuery(`SELECT * FROM ${tableName} WHERE id IN $1`, [ids])
    }

    static insertSingle(tableName, body) {
        let { columns, values } = this.jsonBodyToQueryValues(body)
        const query = format(`INSERT INTO ${tableName} (%s) VALUES (%s) RETURNING *`, columns, values)
        return this.makeQuery(query, [])
    }

    static insertMultiple(tableName, bodies) {
        let _columns = []
        let _values = []
        for (let body of bodies) {
            const { columns, values } = this.jsonBodyToQueryValues(body)
            _columns = columns
            _values.push(values)
        }
        const query = format(`INSERT INTO ${tableName} (%s) VALUES %s RETURNING *`, _columns, _values)
        return this.makeQuery(query, [])
    }

    static updateSingle(tableName, body, id) {
        let { columns, values } = this.jsonBodyToQueryValues(body)
        let set_query = []
        columns.forEach((col, idx) => {
            set_query.push(col + '=' + values[idx])
        })
        return this.makeQuery(format(`UPDATE ${tableName} SET %s WHERE id = %s RETURNING *`, set_query, id), [])
    }

    static deleteSingle(tableName, id) {
        return this.makeQuery(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id])
    }

    static deleteMultiple(tableName, ids) {
        return this.makeQuery(`DELETE FROM ${tableName} WHERE id IN $1 RETURNING *`, [ids])
    }

    static paginate(tableName, page, pageSize) {
        return this.makeQuery(`SELECT *, (SELECT COUNT(*) FROM ${tableName}) FROM ${tableName} OFFSET $1 LIMIT $2`, [(page-1) * pageSize, pageSize])
    }
}

module.exports = RestRepository