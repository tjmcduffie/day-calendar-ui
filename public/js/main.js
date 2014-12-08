/* jshint browser: true, sub: true */
/* global TMCD */
/**
 * DayCalendar creates the UI behaviors and logic for managing the day view of the Calendar.
 *
 * @module DayCalendar
 * @requires TMCD
 * @main
 */
 'use strict';

(function() {
  TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.ERROR);

  var calendar = new TMCD.Calendar('day', document.querySelector('.events'));
  TMCD.dayCalendar = calendar; // exposing for debugging

  var observer = new TMCD.EventEmitter();
  observer.listen('Calendar.event.add', calendar.createEvents.bind(calendar));

  // Global API
  /**
   * Create a series of events based based on the supplied array. This method calls through to the
   * internal interface responsible for managing the calendar.
   *
   * @method layOutDay
   * @param Array.<Object>.number events List of event configurations used to create events on the
   *                                     calendar view.
   */
  window['layOutDay'] = function (events) {
    observer.broadcast('Calendar.event.add', events);
  };
}());


window['layOutDay']([
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
]);