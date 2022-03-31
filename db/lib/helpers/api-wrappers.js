module.exports = {
  apiFailureWrapper(json, message = '', code = 400) {
    const returnedJSON = json;
    returnedJSON.success = false;
    returnedJSON.message = message;
    returnedJSON.code = code;
    return returnedJSON;
  },
  apiSuccessWrapper(json, message = '', code = 200) {
    const returnedJSON = json;
    returnedJSON.success = true;
    returnedJSON.message = message;
    returnedJSON.code = code;
    return returnedJSON;
  },
};
