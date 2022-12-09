const restRepository = require('../repository/restRepository')
const exc = require('../utils/applicationException')

class RestService {

    constructor() { /* empty */  }

    findBy(entry) {
        Object.keys(entry).forEach(key => {
            if (entry[key] === undefined || entry[key] === null)
                delete entry[key]
        })
        return new Promise((resolve, reject) => {
            restRepository.selectBy(this.schemaTableName, entry)
                .then(res => {
                    if (res.length <= 0)
                        reject(exc.err(exc.NOT_FOUND, `Failed to find ${this.itemName}`))
                    resolve(res)
                })
                .catch(err => reject(err))
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
                        reject(exc.err(exc.NOT_FOUND, `Failed to find ${this.itemName}`))
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
                        reject(exc.err(exc.NOT_FOUND, `Failed to find ${this.itemName}s`))
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

    paginate(name, page, pageSize, getNameField) {
        return new Promise((resolve, reject) => {
            pageSize = parseInt(pageSize)
            page = parseInt(page)
    
            if (((!page || !pageSize) && !name) || page < 1 || pageSize < 1) {
                reject(exc.err(exc.BAD_REQUEST,
                    `Passed invalid pagination params: page = ${page}, page_size = ${pageSize}`))
            }
            else 
            {
                let promise = (!page || !pageSize) && name ? 
                    restRepository.selectAll(this.schemaTableName) :
                    restRepository.paginate(this.schemaTableName, page, pageSize)
    
                promise.then(items => {
                    if (name)
                        items = items.filter(item =>
                            getNameField(item).toLowerCase().includes(name.toLowerCase())
                        )

                    if (items.length > 0) {
                        this.pageCount = Math.ceil(items[0].count / pageSize)
                        if (items[0].password)
                            items.forEach(item => delete item.password)
                        resolve(items)
                    }
                    else {
                        reject(exc.err(exc.NOT_FOUND, 'Users not found'))
                    }
    
                })
                .catch(err => reject(err))
            }
        })
    }
}

module.exports = RestService