/* jshint browser: true */
/* global TMCD */
'use strict';


/**
 * CalendarEvent constructor for individual calendar events
 *
 * @class CalendarEvent
 * @uses Logger
 * @uses EventEmitter
 * @param {Object} options Configuration options for the event.
 * @param {Object} options.start Event start time.
 * @param {Object} options.end Event end time.
 * @constructor
 */
TMCD.CalendarEvent = function (options) {
  var err;

  if (typeof options.start === 'undefined') {
    err = new Error('Calendar Events require a start time to be created');
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (typeof options.end === 'undefined') {
    err = new Error('Calendar Events require an end time to be created');
    TMCD.Logger.error(err.message);
    throw err;
  }

  if (options.end < options.start) {
    err = new Error('Calendar Events end time must occur after the start time');
    TMCD.Logger.error(err.message);
    throw err;
  }

  /**
   * Time at which the event starts. Time should be measured in number of minutes since the start of the day.
   *
   * @property start
   * @type Number
   */
  this.start = options.start;

  /**
   * Time at which the event ends. Time should be measured in number of minutes since the start of the day.
   *
   * @property end
   * @type Number
   */
  this.end = options.end;

  /**
   * The dom representation of the element.
   *
   * @property dom
   * @type HTMLElement
   */
  this.dom = this._render();

/*** Id of the event.* @type Number|Undefined*/
this.id = undefined;

/*** @TODO turn this into a number of columns available property. Should be used to calculate width. */
this.width = 1;

/*** @TODO turn this into a column to occupy property. Should be used to calculate width.*/
this.offsetX = 1;

/*** List of neighbor Ids.* @type Array.Numbers*/
this.neighbors = [];



  TMCD.CalendarEvent.observer.listen('calendar.layout.updated', function() {});
};


/**
 * Event emitter used to communicate events to internal (and potentially external) modules.
 *
 * @type EventEmitter
 * @property observer
 * @static
 */
TMCD.CalendarEvent.observer = TMCD.EventEmitter;


/**
 * Render the events HTML template. This only runs once and before returning the element, replaces itself
 * with a non operational function.
 *
 * @method _render
 * @return {HTMLElement} html representation of the calendar event
 * @private
 */
TMCD.CalendarEvent.prototype._render = function () {

  var dom = document.createElement('li');
  dom.setAttribute('class', 'event');
  dom.innerHTML = '';
  dom.innerHTML += '<h2>Sample Title</h2>';
  dom.innerHTML += '<span class="location">Sample Location</span>';

  // after execution the dom property should be accessed and manipulated directly, therfore we set this
  // function to a noop after first execution.
  this._render = function () {};

  return dom;
};


/**
 * Set the current view for the calenday. If additional tasks are associated with setting a view such as
 * rendering a container template, this is where those calls should happen
 *
 * @method setDisplay
 * @param {String} name Name of the display property to set. Should correspond to a style property.
 * @param {String|Number} value Value of the style property
 */
TMCD.CalendarEvent.prototype.setDisplay = function (name, value) {
  var err;

  if (typeof this.dom.style[name] === 'undefined') {
    err = new Error('cannot set property ' + name + ' on the element\'s style');
    TMCD.Logger.error(err.message);
    throw err;
  }

  this.dom.style[name] = value;
};

