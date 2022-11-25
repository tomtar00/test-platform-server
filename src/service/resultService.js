const RestService = require("./restService");

class ResultService extends RestService {

    constructor() {
        super()
        this.schemaTableName = 'tests.results'
    }

    find = (id, userId, testId, full) => {
        
    }

    evaluate = (answersArray) => {
        
    }
}

module.exports = ResultService