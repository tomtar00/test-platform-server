const RestRepository = require("./restRepository");

class TestRepository extends RestRepository {

    static findTestById(id) {
        return this.selectSingle(this.headersTable, id)
    }

    static addTest(test) {
        return this.insertSingle(this.headersTable, test)
    }

    static removeTestById(id) {
        return this.deleteSingle(this.headersTable, id)
    }

}

TestRepository.headersTable = 'tests.headers' 

module.exports = TestRepository