describe('The DayView', function() {
  var dayView, bareEventMeta, eventsArray;
  var setDisplayMock = jasmine.createSpy('setDisplay');
  var containerElem = document.createElement('ol');
  containerElem.style.height = '720px';
  containerElem.style.width = '620px';
  containerElem.style.padding = '0px 10px';
  containerElem.style.boxSizing = 'border-box';
  var eventElem = document.createElement('li');

  document.body.appendChild(containerElem);

  beforeEach(function() {
    dayView = new TMCD.DayView(containerElem);
    bareEventMeta = { event: {start: 100,  end: 300},  column: 0,  availableColumns: [],  neighbors: [],
        id: 4 };
    eventsArray = [
      { event: {start: 100,  end: 200,  setDisplay: setDisplayMock},  column: 0,  availableColumns: [0],
          neighbors: [1],  id: 0 },
      { event: {start: 150,  end: 250,  setDisplay: setDisplayMock},  column: 1,  availableColumns: [0, 1],
          neighbors: [0, 2],  id: 1 },
      { event: {start: 225,  end: 325,  setDisplay: setDisplayMock},  column: 0,  availableColumns: [2, 1],
          neighbors: [1],  id: 2 },
      { event: {start: 500,  end: 600,  setDisplay: setDisplayMock},  column: 0,  availableColumns: [3],
          neighbors: [],  id: 3 }
    ];

    spyOn(TMCD.DayView.prototype, '_getNewEventRowData').and.callThrough();
    spyOn(TMCD.DayView.prototype, '_getNewEventColumnData').and.callThrough();
    spyOn(TMCD.DayView.prototype, '_updateNeighborColumns').and.callThrough();
    spyOn(TMCD.DayView.prototype, '_updateColumnDisplay').and.callThrough();
    spyOn(TMCD.DayView.prototype, '_isParallel').and.callThrough();
    spyOn(TMCD.DayView.prototype, 'addEventToLayout').and.callThrough();
  });

  afterEach(function() {
  });

  describe('sets up the current view', function () {
    it('by gathering style information about the container', function () {
      expect(dayView._layoutMeta.yBase).toEqual(1);
      expect(dayView._layoutMeta.yOffset).toEqual(0);
      expect(dayView._layoutMeta.xBase).toEqual(620);
      expect(dayView._layoutMeta.xOffset).toEqual(10);
    });
  });

  describe('compares event data to determine if they intersect', function() {
    it('and can accept and create any number of events', function() {
      expect( dayView._isParallel({start: 90, end: 120}, {start: 90, end: 120}) ).toEqual(true);

      expect( dayView._isParallel({start: 90, end: 120}, {start: 130, end: 180}) ).toEqual(false);
      expect( dayView._isParallel({start: 130, end: 180}, {start: 90, end: 120}) ).toEqual(false);

      expect( dayView._isParallel({start: 80, end: 180}, {start: 80, end: 120}) ).toEqual(true);
      expect( dayView._isParallel({start: 80, end: 180}, {start: 100, end: 180}) ).toEqual(true);
    });
  });

  describe('retrieves row information for the new event', function () {
    it('when it is the only event', function () {
      processedEventMeta = dayView._getNewEventRowData(bareEventMeta);

      expect(processedEventMeta.neighbors.length).toEqual(0);
      expect(processedEventMeta.availableColumns.length).toEqual(0);
    });

    it('or when other events are present', function () {
      var processedEventMeta;
      dayView._events = eventsArray;
      processedEventMeta = dayView._getNewEventRowData(bareEventMeta);

      expect(processedEventMeta.neighbors.length).toEqual(3);
      expect(processedEventMeta.availableColumns.length).toEqual(2);
    });
  });

  describe('processes retrieved meta data to update column widths', function () {
    it('when it is the only event', function () {
      processedEventMeta = dayView._getNewEventRowData(bareEventMeta);
      processedEventMeta = dayView._getNewEventColumnData(processedEventMeta);

      expect(dayView._updateNeighborColumns).toHaveBeenCalled();
      expect(processedEventMeta.column).toEqual(0);
    });

    it('or when other events are present', function () {
      var processedEventMeta;
      dayView._events = eventsArray;
      processedEventMeta = dayView._getNewEventRowData(bareEventMeta);
      processedEventMeta = dayView._getNewEventColumnData(processedEventMeta);

      expect(dayView._updateNeighborColumns).toHaveBeenCalled();
      expect(processedEventMeta.column).toEqual(2);
      expect(dayView._events[0].availableColumns.length).toEqual(2);
      expect(dayView._events[1].availableColumns.length).toEqual(3);
      expect(dayView._events[2].availableColumns.length).toEqual(3);
      expect(dayView._events[3].availableColumns.length).toEqual(1);
    });
  });

  describe('converts column widths into styles', function () {
    it('based on the container layout', function () {
      dayView._events = eventsArray;
      dayView._updateColumnDisplay();

      expect(setDisplayMock.calls.count()).toEqual(8);
      expect(setDisplayMock.calls.argsFor(0)).toEqual(['width', '600px']);
      expect(setDisplayMock.calls.argsFor(1)).toEqual(['left', '10px']);
      expect(setDisplayMock.calls.argsFor(2)).toEqual(['width', '300px']);
      expect(setDisplayMock.calls.argsFor(3)).toEqual(['left', '310px']);
      expect(setDisplayMock.calls.argsFor(4)).toEqual(['width', '300px']);
      expect(setDisplayMock.calls.argsFor(5)).toEqual(['left', '10px']);
      expect(setDisplayMock.calls.argsFor(6)).toEqual(['width', '600px']);
      expect(setDisplayMock.calls.argsFor(7)).toEqual(['left', '10px']);
    });
  });

  describe('manages the layout and DOM tree via a single public method', function () {
    it('and handles one element at a time', function () {
      setDisplayMock.calls.reset();
      dayView.addEventToLayout({start: 100,  end: 300, setDisplay: setDisplayMock, dom: eventElem});
      expect(setDisplayMock.calls.argsFor(0)).toEqual(['height', '200px']);
      expect(setDisplayMock.calls.argsFor(1)).toEqual(['top', '100px']);
      expect(setDisplayMock.calls.argsFor(2)).toEqual(['width', '600px']);
      expect(setDisplayMock.calls.argsFor(3)).toEqual(['left', '10px']);
    });

    it('updating previously ceated events as necessary', function () {
      setDisplayMock.calls.reset();
      dayView.addEventToLayout({start: 100,  end: 300, setDisplay: setDisplayMock, dom: eventElem});
      dayView.addEventToLayout({start: 90,  end: 200, setDisplay: setDisplayMock, dom: eventElem});
      dayView.addEventToLayout({start: 125,  end: 225, setDisplay: setDisplayMock, dom: eventElem});
      // start with event 2
      expect(setDisplayMock.calls.argsFor(4)).toEqual(['height', '110px']);
      expect(setDisplayMock.calls.argsFor(5)).toEqual(['top', '90px']);
      // adjsut event 1
      expect(setDisplayMock.calls.argsFor(6)).toEqual(['width', '300px']);
      expect(setDisplayMock.calls.argsFor(7)).toEqual(['left', '10px']);
      // set event 2
      expect(setDisplayMock.calls.argsFor(8)).toEqual(['width', '300px']);
      expect(setDisplayMock.calls.argsFor(9)).toEqual(['left', '310px']);

      // set event 3
      expect(setDisplayMock.calls.argsFor(10)).toEqual(['height', '100px']);
      expect(setDisplayMock.calls.argsFor(11)).toEqual(['top', '125px']);
      // adjsut event 1
      expect(setDisplayMock.calls.argsFor(12)).toEqual(['width', '200px']);
      expect(setDisplayMock.calls.argsFor(13)).toEqual(['left', '10px']);
      // adjsut event 2
      expect(setDisplayMock.calls.argsFor(14)).toEqual(['width', '200px']);
      expect(setDisplayMock.calls.argsFor(15)).toEqual(['left', '210px']);
      // set event 3
      expect(setDisplayMock.calls.argsFor(16)).toEqual(['width', '200px']);
      expect(setDisplayMock.calls.argsFor(17)).toEqual(['left', '410px']);
    });
  });
});

