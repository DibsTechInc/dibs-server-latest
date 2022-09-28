const {
  AvailabilityValidationError,
} = require('../../../errors/booking');


module.exports = async function checkDibsAvailability(event, quantity) {
 // throw an error if the num spots will exceed the number that they are trying to book
  if (event.spots_booked + quantity > event.seats) {
    throw new AvailabilityValidationError(`Event ${event.eventid} does not have ${quantity} spots available for purchase`);
  }
};
