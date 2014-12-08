/* global TMCD */
'use strict';


/**
 * EventEmitter class constructor constructs a new instance of the class with a clean events array.
 *
 * @class EventEmitter
 * @requires  Logger
 * @constructor
 */
TMCD.EventEmitter = function() {

  /**
   * Map of events and their associated callbacks.
   *
   * @property _events
   * @type {Object}
   * @private
   */
  this._events = {};

};


/**
 * Associates a method to an event. Each method is added to the end of the events array.
 *
 * @param  {String} event Name of the event to which the method should be associated.
 * @param  {Function} callback The method to bind to the event.
 * @return {Array} An array containing the event name at key 0 and the subscribed method at key 1. This is
 *                 useful for ignoring an event/method combination.
 */
TMCD.EventEmitter.prototype.listen = function(event, callback) {
  var err;

  if (typeof event !== 'string') {
    err = new TypeError('Expected `event` to be a srting but received a ' + (typeof event));
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (typeof callback !== 'function') {
    err = new TypeError('Expected `callback` to be a function but received a ' + (typeof callback));
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (!(event in this._events)) {
    this._events[event] = [];
  }

  this._events[event].push(callback);

  return [event, callback];
};


/**
 * Disassociate a method from an event. The method received must match the bound method exactly. This can be
 * cause issues when passing anonymous metods. In this case use the results returned from the listen method.
 *
 * @param  {String} event Name of the event from which the method should be disassociated.
 * @param  {Function} callback The method to remove from the event.
 * @return {Array|Undefined} An array containing the event name at key 0 and the disassociated method at
 *                           key 1.
 */
TMCD.EventEmitter.prototype.ignore = function(event, callback) {
  var err;

  if (typeof event !== 'string') {
    err = new TypeError('Expected `event` to be a srting but received a ' + (typeof event));
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (typeof callback !== 'function') {
    err = new TypeError('Expected `callback` to be a function but received a ' + (typeof callback));
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (this._events[event] instanceof Array) {
    var callbackFound = false;
    this._events[event].forEach(function(elem, index, arr) {
      if (callback === elem) {
        arr.splice(index, 1);
        callbackFound = true;

        return [event, callback];
      }
    });
    if (!callbackFound) {
      TMCD.Logger.warn('The requested event/method combination cannot be ignored because it is not set');
    }
  } else {
    TMCD.Logger.warn('The event %s is either undefined or not an array.', event);
  }
};


/**
 * Trigger the specified event, executing any associated methods and passing data as only attribute.
 *
 * @param {String} event Name of the event to trigger.
 * @param {Mixed} [data] Optional argument containing data to pass to each associated method.
 */
TMCD.EventEmitter.prototype.broadcast = function(event, data) {
  var err;

  if (typeof event !== 'string') {
    err = new TypeError('Expected `event` to be a srting but received a ' + (typeof event));
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (this._events[event] instanceof Array) {
    this._events[event].forEach(function(elem) {
      elem(data);
    });
  } else {
    TMCD.Logger.warn('The event %s is either undefined or not an array.', event);
  }
};

