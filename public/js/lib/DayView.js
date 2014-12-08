/* global TMCD */
'use strict';

/**
 * DayView constructor
 *
 * @class  DayView
 * @uses Logger
 * @uses EventEmitter
 * @param {HTMLElement} domElement
 * @constructor
 */
TMCD.DayView = function (domElement) {
  this.elem = domElement;
  this.events = [];

  this.layoutMeta = {
    yBase: this.elem.offsetHeight / (60 * 12),
    xBase: 600
  };

  TMCD.Calendar.observer.listen('calendar.event.create', this.addEventToLayout.bind(this));
};

TMCD.DayView.observer = TMCD.EventEmitter;

TMCD.DayView.prototype.addEventToLayout = function (newEvent) {
  var neighborData;

  // set the new event's ID to the next available index and add it to the event list at the index value.
  newEvent.id = this.events.length;
  this.events[newEvent.id] = newEvent;

  neighborData = this._getNeighborData(newEvent);

  // Set the appropriate width based on the number of sibling columns. Add 1 to the count to include itself.
  newEvent.width = neighborData.numberOfColumnsInRow + 1;

  // Set the horizontal offset based on the first available slot.
  this._updateHorizontalLayout(neighborData.offsetsStatus, newEvent);

  newEvent.setDisplay('height', (newEvent.end - newEvent.start) * 1 + 'px');
  newEvent.setDisplay('top', newEvent.start * 1 + 'px');

  this._updateEventClassNames(); // turn this into an observed event and let calendar events update themselves
  TMCD.DayView.observer.broadcast('calendar.layout.updated');

  // add the new event to the DOM only after the layout is updated to prevent any visible collisions.
  this.elem.appendChild(newEvent.dom);
};

TMCD.DayView.prototype._getNeighborData = function (newEvent) {
  var neighborData = {
    offsetsStatus: [undefined],
    numberOfColumnsInRow: 0
  };
  var parallelEvent;

  for (var i = 0; i < this.events.length; i++) {
    parallelEvent = this.events[i];
    // proceed only if the compared events are parallel and we're not comparing the new event to itself
    if (this.events[i] !== newEvent && this._isParallel(newEvent, parallelEvent)) {
      // Update the neighbor lists in both events.
      newEvent.neighbors.push(parallelEvent.id);
      parallelEvent.neighbors.push(newEvent.id);

      // Find the total number of unique occupied offsets amongst neighbors. Two neighbors both occupying the
      // first offsetX slot should only count as 1
      if (!(neighborData.offsetsStatus[parallelEvent.offsetX])) {
        neighborData.numberOfColumnsInRow++;
      }

      // Store the occupied offset. If the the parallel items offset is available or the current iterations
      // parallel item is wider than the already stored item's width.
      if (!(neighborData.offsetsStatus[parallelEvent.offsetX]) ||
          neighborData.offsetsStatus[parallelEvent.offsetX].width <= parallelEvent.offsetX.width) {
        neighborData.offsetsStatus[parallelEvent.offsetX] = parallelEvent;
      }
    }
  }

  return neighborData;
};

TMCD.DayView.prototype._updateHorizontalLayout = function (availableOffsets, newEvent) {
  TMCD.Logger.debug('CalendarLayout.settingHorizontaloffset', availableOffsets);

  // Add a slot to the end of the array to guarantee at least 1 available slot.
  availableOffsets.push(undefined);
  for (var i = 1; i < availableOffsets.length; i++) {
    if (!availableOffsets[i]) {
      newEvent.offsetX = i;
      break;
    }
  }

  // If the available offset increases the number of available slots, update the neighbors' widths.
  // @TODO theres a bug here, where if a
  if (newEvent.offsetX === availableOffsets.length - 1) {
    this._updateNeighborWidths(newEvent.neighbors);
  }
};

/**
 * @TODO this function is a misnomer. the info is used to set the width, but this doesn't represent the width
 *       itself. Maybe the event property name needs to be changed.
 * [_updateNeighborWidths description]
 * @param  {[type]} neighbors
 * @return {[type]}
 */
TMCD.DayView.prototype._updateNeighborWidths = function (neighbors) {
  for (var i = 0; i < neighbors.length; i++) {
    TMCD.Logger.debug('CalendarLayout.updateNeighborWidth', this.events[neighbors[i]]);
    this.events[neighbors[i]].width++;
  }
};

TMCD.DayView.prototype._updateEventClassNames = function () {
  var elemCurrentWidth, left, updatedWidth;

  for (var i = 0; i < this.events.length; i++) {
    elemCurrentWidth = this.events[i].width;
    left = this.layoutMeta.xBase / elemCurrentWidth * (this.events[i].offsetX - 1) + 10 + 'px';
    updatedWidth = this.layoutMeta.xBase / elemCurrentWidth + 'px';

    this.events[i].setDisplay('width', updatedWidth);
    this.events[i].setDisplay('left', left);
  }
};

TMCD.DayView.prototype._isParallel = function (a, b) {
  return (a.start >= b.start && a.start < b.end ||
          a.start < b.start && a.end >= b.start ||
          a.start === b.start && a.end === b.start);
};

