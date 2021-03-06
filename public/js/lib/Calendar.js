/* global TMCD */
'use strict';


/**
 * The calendar oject manages the calendar's public API and View states.
 *
 * @class Calendar
 * @requires Logger
 * @requires CalendarEvent
 * @requires DayView
 * @param {HTMLElement} domElement
 * @param {String} viewType
 * @constructor
 */
TMCD.Calendar = function (viewType, domElement) {

  /**
   * Calendar container element.
   *
   * @property _elem
   * @type {HTMLElement}
   * @private
   */
  this._elem = domElement;

  /**
   * View module type.
   *
   * @property _view
   * @type {Mixed}
   * @private
   */
  this._view = null;

  /**
   * List of events contained in the view.
   *
   * @property _events
   * @type {Array.CalendarEvent}
   * @private
   */
  this._events = [];

  var err;

  if (viewType === 'day') {
    this._setView(TMCD.Calendar.views.DAY);
  } else {
    err = new Error('Calendar does not have a ' + viewType + ' view');
    TMCD.Logger.error(err.message);
    throw err;
  }
};


/**
 * Views enum. Contains a mapping of view types to view objects.
 *
 * @property views
 * @readOnly
 * @type {Enum}
 * @static
 */
TMCD.Calendar.views = {
  DAY: TMCD.DayView
};


/**
 * Set the current view for the calenday. If additional tasks are associated with setting a view such as
 * rendering a container template, this is where those calls should happen.
 *
 * @method _setView
 * @param {Mixed} ViewConstructor View constructor stored on the views enum.
 * @private
 */
TMCD.Calendar.prototype._setView = function (ViewConstructor) {
  this._view = new ViewConstructor(this._elem);
};


/**
 * Creates calendar events based on the supplied configurations and broadcasts a notification of their
 * creation for sub or external modules to respond.
 *
 * @method createEvents
 * @param {Array} events A list of configurations used to create events and add them to the calendar.
 */
TMCD.Calendar.prototype.createEvents = function (events) {
  var err, calevent;

  if (this._view === null) {
    err = new Error('A valid view must be set before events can be added');
    TMCD.Logger.error(err.message);
    throw err;
  }

  this._events = this._events.concat(events);

  for (var i = 0; i < events.length; i++) {
    TMCD.Logger.debug('Calendar.CreateEvent', events[i]);

    calevent = new TMCD.CalendarEvent(events[i]);
    this._view.addEventToLayout(calevent);
  }
};

