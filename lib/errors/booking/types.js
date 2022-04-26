const { extendableBuiltin } = require('../../helpers/babel-helpers');
const resolveNestedObject = require('../../helpers/resolve-nested-object');

/**
 * @class BookingError
 * @extends Error
 */
class BookingError extends extendableBuiltin(Error) {
  /**
   * @constructor
   * @constructs PurchaseError
   * @param {string|Error} error message or thrown error by code
   * @param {Array<any>} args additional arguments
   */
  constructor(error) {
    super();
    if (typeof error === 'string') this.message = error;
    else if (error) { // this should imply error instanceof Error
      this.message = error.message;
      this.stack = error.stack;
    }
  }
}

/**
 * @class AvailabilityValidationError
 * @extends BookingError
 */
class AvailabilityValidationError extends BookingError {
  /**
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { soldOut = false, canceled = false, spotsUnavailable = false } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.soldOut = soldOut;
    this.canceled = canceled;
    this.spotsUnavailable = spotsUnavailable;
  }
}

/**
 * @class EnrollmentError
 * @extends BookingError
 */
class EnrollmentError extends BookingError {
  /**
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation and sales needed for ZF unenrollment
   */
  constructor(error, { sales, mbVisitRestriction = false } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.sales = sales;
    this.mbVisitRestriction = mbVisitRestriction;
  }
}

/**
 * @class AddToWaitlistError
 * @extends BookingError
 */
class AddToWaitlistError extends BookingError {
  /**
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { waitlistUnavailable = false, eventNoLongerFull = false, alreadyEnrolled = false } = {}) {
    if (typeof error === 'string') super(error);
    else if (!(error instanceof Error)) {
      // if this error was the result of a failure response from MindBody
      const mbErrorCode = resolveNestedObject(error, 'AddClientsToClassesResult', 'ErrorCode');
      if (mbErrorCode === 201) {
        super('User is already enrolled in the class');
        this.alreadyEnrolled = true;
      } else super();
    } else {
      super(error.message);
      Object.assign(this, error);
    }
    this.waitlistUnavailable = waitlistUnavailable;
    this.eventNoLongerFull = eventNoLongerFull;
    this.alreadyEnrolled = this.alreadyEnrolled || alreadyEnrolled;
  }
}

/**
 * @class CheckWaitlistError
 * @extends BookingError
 */
class CheckWaitlistError extends BookingError { }

/**
 * @class UnenrollmentError
 * @extends BookingError
 */
class UnenrollmentError extends BookingError {
  /**
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { attendanceNotCancellable = false } = {}) {
    if (typeof error === 'string') super(error);
    else if (error.body && error.body.error) {
      // if this error was the result of a failure response from Zingfit
      if (error.body.error === 'ATTENDANCE_NOT_CANCELLABLE') {
        super('Oh no! It appears this class cannot be cancelled through Dibs. Please try cancelling directly with Zingfit');
        this.attendanceNotCancellable = true;
      } else super();
    } else {
      super(error.message);
      Object.assign(this, error);
    }
    this.attendanceNotCancellable = this.attendanceNotCancellable || attendanceNotCancellable;
  }
}

/**
 * @class RemoveFromWaitlistError
 * @extends BookingError
 */
class RemoveFromWaitlistError extends BookingError { }

/**
 * @class MaximumEnrollmentError
 * @extends BookingError
 */
class MaximumEnrollmentError extends BookingError {
  /**
   * @param {Error|string} error thrown or reason for failure
   * @param {Object} opts, can include which pass failed validation
   */
  constructor(error, { eventid, clientid } = {}) {
    if (typeof error === 'string') super(error);
    else {
      super(error.message);
      Object.assign(this, error);
    }
    this.eventid = eventid;
    this.clientid = clientid;
  }
}

module.exports = {
  BookingError,
  AvailabilityValidationError,
  EnrollmentError,
  CheckWaitlistError,
  AddToWaitlistError,
  UnenrollmentError,
  RemoveFromWaitlistError,
  MaximumEnrollmentError,
};
