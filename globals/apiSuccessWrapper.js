module.exports = function apiSuccessWrapper(json, message = '', code = 200) {
    const returnedJSON = json;
    returnedJSON.success = true;
    returnedJSON.message = message;
    returnedJSON.code = code;
    return returnedJSON;
};
