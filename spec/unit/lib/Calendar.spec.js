describe('The Calendar', function() {
  var calendar, DayViewMock;
  var containerElem = document.createElement('ol');

  var mockEventData = {
    start: 0,
    end: 10
  };

  document.body.appendChild(containerElem);

  beforeEach(function() {
    spyOn(TMCD.Calendar.prototype, '_setView').and.callThrough();
    spyOn(TMCD.Calendar.prototype, 'createEvents').and.callThrough();

    spyOn(TMCD.Logger, 'error');
    spyOn(TMCD.Logger, 'warn');
    spyOn(TMCD.Logger, 'debug');

    DayViewMock = jasmine.createSpyObj('DayViewMock', ['addEventToLayout']);
    spyOn(TMCD.Calendar.views, 'DAY').and.returnValue(DayViewMock);
    // spyOn(TMCD, 'DayView');  // can't use the view object directly here becasue of how the constructor is
                                //called within the calendar object

    spyOn(TMCD, 'CalendarEvent').and.returnValue(mockEventData);
  });

  afterEach(function() {
  });

  describe('sets the current view based on supplied configuration', function () {
    it('requires a view type to function properly', function () {
      calendar = new TMCD.Calendar('day', containerElem);

      expect(TMCD.Calendar.prototype._setView).toHaveBeenCalled();
      expect(TMCD.Calendar.views.DAY).toHaveBeenCalled();
    });
  });

  describe('allows events to be added to the calendar', function() {
    beforeEach(function () {
      calendar = new TMCD.Calendar('day', containerElem);
    });

    it('can accept and create any number of events', function() {
      expect( function () { calendar.createEvents([]); }).not.toThrow();
      expect( function () { calendar.createEvents([mockEventData]); }).not.toThrow();
      expect( function () { calendar.createEvents([mockEventData, mockEventData, mockEventData,
          mockEventData, mockEventData]); }).not.toThrow();
      expect( function () { calendar.createEvents([mockEventData, mockEventData, mockEventData,
          mockEventData, mockEventData, mockEventData, mockEventData, mockEventData, mockEventData,
          mockEventData, mockEventData, mockEventData, mockEventData, mockEventData, mockEventData,
          mockEventData, mockEventData, mockEventData, mockEventData, mockEventData]); }).not.toThrow();
    });
  });

  describe('throws various errors which', function () {
    it('should be logged during instantiation', function () {
      expect(function() { new TMCD.Calendar(); }).toThrow();
      expect(TMCD.Logger.error).toHaveBeenCalled();
    });
    it('should be logged during event creation', function () {
      calendar = new TMCD.Calendar('day', containerElem);
      expect(function () { calendar.createEvents(); }).toThrow();

      calendar._view = null; // force the error state

      expect(function () { calendar.createEvents([]); }).toThrow();
      expect(TMCD.Logger.error).toHaveBeenCalled();
    });
  });
});
