class RestRepository {

    makeQuery(query, params) {
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
        let columns = []
        let values = []
        for (const [key, value] of Object.entries(body)) {
            // TODO: split here
        }
        return { columns, values }
    }

    static selectSingle(tableName, id) {
        return makeQuery(`SELECT * FROM ${tableName} WHERE id = $1`, [id])
    }

    static selectMultiple(tableName, ids) {
        return makeQuery(`SELECT * FROM ${tableName} WHERE id IN $1`, [ids])
    }

    static insertSingle(tableName, body) {
        let { columns, values } = this.jsonBodyToQueryValues(body)
        return makeQuery(`INSERT INTO ${tableName} ($1) VALUES ($2) RETURNING *`, [columns, values])
    }

    static insertMultiple(tableName, bodies) {
        let columns = []
        let values = []
        for (let body of bodies) {
            const { _columns, _values } = this.jsonBodyToQueryValues(body)
            columns = _columns
            values.push(_values)
        }
        values = values.map(item => '(' + item + ')')
        return makeQuery(`INSERT INTO ${tableName} ($1) VALUES ($2) RETURNING *`, [columns, values])
    }

    static updateSingle(tableName, body, id) {
        let { columns, values } = this.jsonBodyToQueryValues(body)
        let set_query = []
        columns.forEach((col, idx) => {
            set_query.push(col + '=' + values[idx])
        })
        return makeQuery(`UPDATE ${tableName} SET $1 WHERE id = $2 RETURNING *`, [set_query, id])
    }

    static deleteSingle(tableName, id) {
        return makeQuery(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id])
    }

    static deleteMultiple(tableName, ids) {
        return makeQuery(`DELETE FROM ${tableName} WHERE id IN $1 RETURNING *`, [ids])
    }
}

module.exports = RestRepository