/* global TMCD */
'use strict';


/**
 * DayView constructor
 *
 * @class  DayView
 * @requires Logger
 * @param {HTMLElement} domElement HTML container of the view.
 * @constructor
 */
TMCD.DayView = function (domElement) {
  var domStyles = window.getComputedStyle(domElement, null);

  /**
   * The HTML element containing the event elements.
   *
   * @property _elem
   * @type HTMLElement
   * @private
   */
  this._elem = domElement;

  /**
   * List of events contained within the layout.
   *
   * @property _events
   * @type Array
   * @private
   */
  this._events = [];

  /**
   * Meta information used to make layout calculations
   *
   * @property _layoutMeta
   * @type {Object}
   * @type {Number} _layoutMeta.yBase Base unit with wich to calculate y axis values.
   * @type {Number} _layoutMeta.yOffset Distance to offset the vertical placement of events.
   * @type {Number} _layoutMeta.xBase Base unit with wich to calculate x axis values.
   * @type {Number} _layoutMeta.xOffset distance to offset the horizontal placement of events.
   * @private
   */
  this._layoutMeta = {
    yBase: parseInt(domStyles.height, 10) / (60 * 12), // container height / minutes * hours
    yOffset: parseInt(domStyles.paddingTop, 10),
    xBase: parseInt(domStyles.width, 10),
    xOffset: parseInt(domStyles.paddingLeft, 10)
  };

};


/**
 * Process events to identify other events in the row and the columns they occupy and store the relationships.
 *
 * @param  {Object} eventMeta Event specific layout data.
 * @private
 * @return {Object} the updated eventMeta.
 */
TMCD.DayView.prototype._getNewEventRowData = function (eventMeta) {
  var parallelEvent;

  for (var i = 0; i < this._events.length; i++) {
    parallelEvent = this._events[i];
    // proceed only if the compared events are parallel and we're not comparing the new event to itself
    if (this._events[i] !== eventMeta.event && this._isParallel(eventMeta.event, parallelEvent.event)) {
      // Update the neighbor lists in both events.
      eventMeta.neighbors.push(i);
      parallelEvent.neighbors.push(eventMeta.id);

      // Store the occupied offset. If the the parallel items offset is available or the current iterations
      // parallel item is wider than the already stored item's width.
      if (!(eventMeta.availableColumns[parallelEvent.column]) ||
          this._events[eventMeta.availableColumns[parallelEvent.column]].width <= parallelEvent.width) {
            eventMeta.availableColumns[parallelEvent.column] = i;
      }
    }
  }

  return eventMeta;
};


/**
 * Process the available columns to determine the first available column for the event to occupy and the total
 * number of columns in this event's row.
 *
 * @param  {Object} eventMeta Event specific layout data.
 * @private
 * @return {Object} the updated eventMeta.
 */
TMCD.DayView.prototype._getNewEventColumnData = function (eventMeta) {
  // Add a slot to the end of the array to guarantee at least 1 available slot.
  eventMeta.availableColumns.push(undefined);
  for (var i = 0; i < eventMeta.availableColumns.length; i++) {
    if (typeof eventMeta.availableColumns[i] === 'undefined') {
      eventMeta.column = i;
      eventMeta.availableColumns[i] = eventMeta.id;
      break;
    }
  }

  // If the available offset increases the number of available slots, update the neighbors' widths.
  if (eventMeta.column === eventMeta.availableColumns.length - 1) {
    eventMeta.neighbors = this._updateNeighborColumns(eventMeta.neighbors, eventMeta.id);
  }

  if (typeof eventMeta.availableColumns[eventMeta.availableColumns.length - 1] === 'undefined') {
    eventMeta.availableColumns.splice(eventMeta.availableColumns.length - 1, 1);
  }

  return eventMeta;
};


/**
 * @TODO this function is a misnomer. the info is used to set the width, but this doesn't represent the width
 *       itself. Maybe the event property name needs to be changed.
 *
 * @param  {Array.CalendarEvent} neighbors List of events neighboring the newly added event.
 * @param  {Number} id Id of the newly added event .
 * @private
 * @return {Array.CalendarEvent} the updated neighbors array.
 */
TMCD.DayView.prototype._updateNeighborColumns = function (neighbors, id) {
  for (var i = 0; i < neighbors.length; i++) {
    TMCD.Logger.debug('CalendarLayout.updateNeighborWidth', this._events[neighbors[i]]);
    this._events[neighbors[i]].availableColumns.push(id);
  }
  return neighbors;
};


/**
 * Update the column display for the layout. This iterates over all events and sets their width and position
 * left based on the column structure.
 *
 * @private
 */
TMCD.DayView.prototype._updateColumnDisplay = function () {
  var left, updatedWidth;

  for (var i = 0; i < this._events.length; i++) {
    updatedWidth = (this._layoutMeta.xBase - this._layoutMeta.xOffset * 2) /
        this._events[i].availableColumns.length ;
    left = updatedWidth * (this._events[i].column) + this._layoutMeta.xOffset;

    this._events[i].event.setDisplay('width', updatedWidth + 'px');
    this._events[i].event.setDisplay('left', left + 'px');
  }
};


/**
 * Comparison function to determine whether two events overlap.
 *
 * @param  {CalendarEvent}  a First calendar event to compare.
 * @param  {CalendarEvent}  b Second calendar event to compare.
 * @private
 * @return {Boolean} returns true if the two events are parallel.
 */
TMCD.DayView.prototype._isParallel = function (a, b) {
  return (a.start >= b.start && a.start < b.end ||
          a.start < b.start && a.end >= b.start ||
          a.start === b.start && a.end === b.end);
};


/**
 * Add an event to the layout by calculating the necessary spacial values.
 *
 * @param {CalendarEvent} newEvent Event to add to the layout.
 */
TMCD.DayView.prototype.addEventToLayout = function (newEvent) {
  // Set the new event's ID to the next available index and add it to the event list at the index value.
  var eventIndex = this._events.length;
  var eventMeta = {
    event: newEvent,       // event object
    column: 0,             // offsetX
    availableColumns: [],  // width
    neighbors: [],         // neighbors
    id: eventIndex         // event id
  };

  // Set the event meta based on the neighbor data.
  eventMeta = this._getNewEventRowData(eventMeta);

  // Set the horizontal offset based on the first available slot.
  eventMeta = this._getNewEventColumnData(eventMeta);

  this._events[eventIndex] = eventMeta;

  newEvent.setDisplay('height', (newEvent.end - newEvent.start) * 1 + 'px');
  newEvent.setDisplay('top', newEvent.start * 1 + 'px');

  this._updateColumnDisplay();

  // Add the new event to the DOM only after the layout is updated to prevent any visible collisions.
  this._elem.appendChild(newEvent.dom);
};

