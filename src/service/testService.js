const RestService = require("./restService");

class TestService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.headers'
    }

    find(id, full) {
        return new Promise((resolve, reject) => {
            if (full && /^true$/i.test(full)) {
                this.findFull(id)
                    .then(res => {
                        resolve(res)
                    })
                    .catch(err => reject(err))
            }
            else {
                super.find(id)
                    .then(res => resolve(res))
                    .catch(err => reject(err))
            }
        })
    }

    findFull(id) {

    }

    findAll(page, page_size, form, name) {

    }

    remove(id) {

    }
}

module.exports = TestService