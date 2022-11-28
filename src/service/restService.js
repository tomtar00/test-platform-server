const { pgConfig } = require('../config')
const restRepository = require('../repository/restRepository')
const error = require('../utils/applicationException')

class RestService {

    constructor() {
        this.column_names = []

        // get table's column names from database
        const column_query = `
            SELECT column_name FROM information_schema.columns WHERE TABLE_NAME = '${this.tableName}'`
        pgConfig.query(column_query, (error, results) => {
            if (error) {
                console.error(error)
            }
            else {
                this.column_names = results.rows.map(item => item.column_name)
            }
        })
    }

    find(id) {
        return new Promise((resolve, reject) => {
            if (typeof id === 'string' && id.includes(',')) {
                this.findMultiple(id.split(','))
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
            else {
                this.findSingle(id)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
        })
    }

    findSingle(id) {
        return new Promise((resolve, reject) => {
            restRepository.selectSingle(this.schemaTableName, id)
                .then(res => {
                    if (res.length <= 0)
                        reject(error.err(error.NOT_FOUND, `Failed to find ${this.objName}`))
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    findMultiple(ids) {
        return new Promise((resolve, reject) => {
            restRepository.selectMultiple(this.schemaTableName, ids)
                .then(res => {
                    if (res.length <= 0)
                        reject(error.err(error.NOT_FOUND, `Failed to find ${this.objName}s`))
                    resolve(res)
                })
                .catch(err => reject(err))
        })
    }

    add(body) {
        return new Promise((resolve, reject) => {
            if (Array.isArray(body)) {
                this.addMultiple(body)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
            else {
                this.addSingle(body)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
        })
    }

    addSingle(body) {
        return new Promise((resolve, reject) => {
            restRepository.insertSingle(this.schemaTableName, body)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    addMultiple(bodies) {
        return new Promise((resolve, reject) => {
            restRepository.insertMultiple(this.schemaTableName, bodies)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    edit(body, id) {
        return new Promise((resolve, reject) => {
            restRepository.updateSingle(this.schemaTableName, body, id)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.find(id).then(() => {
                if (typeof id === 'string' && id.includes(',')) {
                    this.removeMultiple(id.split(','))
                        .then(res => resolve(res))
                        .catch(err => reject(err))
                }
                else {
                    this.removeSingle(id)
                        .then(res => resolve(res))
                        .catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
        })
    }

    removeSingle(id) {
        return new Promise((resolve, reject) => {
            restRepository.deleteSingle(this.schemaTableName, id)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    removeMultiple(ids) {
        return new Promise((resolve, reject) => {
            restRepository.deleteMultiple(this.schemaTableName, ids)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }
}

module.exports = RestService