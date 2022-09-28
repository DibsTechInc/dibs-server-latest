
/**
 * RouteTimer - Description
 * @class RouteTimer
 * @prop {number} time
 * @prop {array} events
 * @prop {function} timer
 */
function RouteTimer() {}


/**
 * Initalizes the timer
 * @memberof RouteTimer
 * @instance
 * @param {object} event the event
 *
 * @returns {undefined}
 */
RouteTimer.prototype.startTimer = function startTimer(event) {
  this.time = 0;
  this.events = [{ time: 0, event: event || 'Started Timer' }];
  this.timer = setInterval(() => { this.time += 1; }, 1);
};


/**
 * Adds an event
 * @memberof RouteTimer
 * @instance
 * @param {object} event the event
 *
 * @returns {undefined}
 */
RouteTimer.prototype.addEvent = function addEvent(event) {
  this.events.push({ time: this.time, event });
};


/**
 * Returns the events
 * @memberof RouteTimer
 * @instance
 * @returns {array} The events
 */
RouteTimer.prototype.getEvents = function getEvents() {
  return this.events;
};


/**
 * The time
 * @memberof RouteTimer
 * @instance
 * @returns {number} the time
 */
RouteTimer.prototype.getTime = function getTime() {
  return this.time;
};


/**
 * Sets the time
 * @memberof RouteTimer
 * @instance
 * @param {number} time the time
 *
 * @returns {number} time
 */
RouteTimer.prototype.setTime = function setTime(time) {
  return this.time = time;
};


/**
 * Clears the timer
 * @memberof RouteTimer
 * @instance
 * @returns {undefined}
 */
RouteTimer.prototype.clearTimer = function clearTimer() {
  clearInterval(this.timer);
};

/**
 * Calc percentages
 * @memberof RouteTimer
 * @instance
 * @returns {number} the percent
 */
RouteTimer.prototype.calculatePercentage = function calculatePercentage() {
  this.clearTimer();
  return this.events.map((e, i) => {
    if (i !== 0) {
      return {
        percentage: Math.round(((e.time - this.events[i - 1].time) / this.time) * 10000) / 100,
        event: e.event,
      };
    }
    return null;
  }).splice(1);
};

module.exports = RouteTimer;
