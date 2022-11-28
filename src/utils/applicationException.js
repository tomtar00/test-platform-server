function ApplicationException(error, message) {
    this.error = error;
    this.message = message;
}

module.exports = {

    BAD_REQUEST: { message: 'BAD_REQUEST', code: 400 },
    NOT_FOUND: { message: 'NOT_FOUND', code: 404 },
    FORBIDDEN: { message: 'FORBIDDEN', code: 403 },
    UNAUTHORIZED: { message: 'UNAUTHORIZED', code: 401 },
    VALIDATION_FAILURE: { message: 'VALIDATION_FAILURE', code: 406 },
    METHOD_NOT_ALLOWED: { message: 'METHOD_NOT_ALLOWED', code: 405 },
    PRECONDITION_FAILED: { message: 'PRECONDITION_FAILED', code: 412 },
    CONFLICT: { message: 'CONFLICT', code: 409 },

    exc: ApplicationException,
    is: (error, errorCode) => {
        return error instanceof ApplicationException && (null == errorCode || error.error === errorCode)
    },
    err: (code, message) => {
        return new ApplicationException(code, message)
    },
    handle: (error, response, next) => {
        let error_msg
        if (error instanceof ApplicationException) {
            error_msg = String(error.message || error.error.message)
            response.status(error.error.code).send({'message': error_msg}) // error.message || error.error.message
        } else {
            error_msg = String(error)
            response.status(500).send({"message": error_msg})
        }
        console.trace(error_msg)

        response.message = error_msg
    }
};