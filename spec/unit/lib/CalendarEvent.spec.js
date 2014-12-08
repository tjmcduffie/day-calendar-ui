/* jshint unused:false */
describe('The Calendar Event', function () {
  var calendarEvent;

  beforeEach(function() {
    spyOn(TMCD.CalendarEvent.prototype, '_render').and.callThrough();
    spyOn(TMCD.CalendarEvent.prototype, 'setDisplay').and.callThrough();

    calendarEvent = new TMCD.CalendarEvent({
      start: 0,
      end: 90
    });
  });

  describe('communicate errors', function () {
    it('when configured improperly', function () {
      expect(function () { new CalendarEvent(); }).toThrow();
      expect(function () { new CalendarEvent({ start: 90 }); }).toThrow();
      expect(function () { new CalendarEvent({ end: 90 }); }).toThrow();
      expect(function () { new CalendarEvent({ start: 90, end: 0}); }).toThrow();
    });
  });

  describe('manages internal state', function() {
    it('including start and end times', function() {
      expect(calendarEvent.start).toEqual(0);
      expect(calendarEvent.end).toEqual(90);
    });

    it('including HTML representation', function() {
      expect(TMCD.CalendarEvent.prototype._render).toHaveBeenCalled();
      expect(calendarEvent.dom instanceof HTMLElement).toBe(true);
    });
  });

  describe('allows external objects to change its display', function () {
    it('by translating key value pairs into styles', function () {
      expect(calendarEvent.dom.style.height).toEqual('');
      expect(calendarEvent.dom.style.width).toEqual('');

      calendarEvent.setDisplay('height', '90px');
      calendarEvent.setDisplay('width', '180px');

      expect(calendarEvent.dom.style.height).toEqual('90px');
      expect(calendarEvent.dom.style.width).toEqual('180px');

      expect(function () { calendarEvent.setDisplay('foo', 'bar'); }).toThrow();
      expect(function () { calendarEvent.setDisplay('baz', 'bang'); }).toThrow();
    });
  });
});