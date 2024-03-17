const success = (statusCode, data) => {
    return {
        status: 'success',
        statusCode,
        data
    }
}

const error = (statusCode, message) => {
    return {
        status: 'error',
        statusCode,
        message
    }
}

module.exports = {
    success,
    error
}