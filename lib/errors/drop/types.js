const { extendableBuiltin } = require('../../helpers/babel-helpers');

/**
 * @class DropError
 * @extends Error
 */
class DropError extends extendableBuiltin(Error) {
  /**
   * @constructor
   * @constructs DropError
   * @param {string|Error} error message or thrown error by code
   * @param {Array<any>} args additional arguments
   */
  constructor(error) {
    super();
    if (typeof error === 'string') this.message = error;
    else { // this should imply error instanceof Error
      this.message = error.message;
      this.stack = error.stack;
    }
  }
}

/**
 * @class ReturnCreditError
 * @extends DropError
 */
class ReturnCreditError extends DropError { }

module.exports = {
  DropError,
  ReturnCreditError,
};
