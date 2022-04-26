module.exports = function apiFailureWrapper(json, message = '', code = 400) {
    const returnedJSON = json;
    returnedJSON.success = false;
    returnedJSON.message = message;
    returnedJSON.code = code;
    return returnedJSON;
};
