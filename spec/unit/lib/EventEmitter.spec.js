describe('The EventEmitter', function() {
  var observer;
  var callbackMock;
  var origWarn = console.warn;

  beforeEach(function() {
    observer = TMCD.EventEmitter;
    callbackMock = jasmine.createSpyObj('callbackMock', ['one', 'two', 'three']);
    spyOn(console, 'warn').and.callThrough();
  });

  afterEach(function() {
    console.warn = origWarn;
    // reset events
    observer._events = {};
  });

  describe('should allow external objects to bind a callback to an event', function() {
    // this test is only accurate when working directly with a constructor. If using a singleton the test will
    // fail.
    xit('should start off with an empty object as the event map', function() {
      expect(observer._events).toEqual({});
    });
    it('should store bound events in the events object', function() {
      expect(observer._events.foo instanceof Array).toBe(false);
      expect(function() { observer.listen('foo', callbackMock.one); }).not.toThrow();
      expect(observer._events.foo instanceof Array).toBe(true);
      expect(observer._events.foo.length).toBe(1);
    });
    it('should allow multiple events to be bound to a single event', function() {
      observer.listen('foo', callbackMock.one);
      observer.listen('foo', callbackMock.two);
      observer.listen('foo', callbackMock.three);
      expect(observer._events.foo.length).toBe(3);
      expect(observer._events.foo[0]).toBe(callbackMock.one);
      expect(observer._events.foo[1]).toBe(callbackMock.two);
      expect(observer._events.foo[2]).toBe(callbackMock.three);
    });
    it('should throw an error if binding is attempted without the necessary params', function() {
      expect(function() { observer.listen(undefined, undefined); }).toThrow();
      expect(function() { observer.listen('foo', undefined); }).toThrow();
      expect(function() { observer.listen(undefined, callbackMock.one); }).toThrow();
    });
  });

  describe('should allow external objects to unbind a callback from an event', function() {
    it('should allow removal via the original event and method', function() {
      observer.listen('foo', callbackMock.one);
      observer.listen('foo', callbackMock.two);
      observer.listen('foo', callbackMock.three);

      expect(observer._events.foo.length).toBe(3);
      expect(function() { observer.ignore('foo', callbackMock.three); }).not.toThrow();
      expect(observer._events.foo.length).toBe(2);
      expect(observer._events.foo).not.toContain(callbackMock.three);

    });
    it('should allow removal via the returned event and method', function() {
      var one = observer.listen('foo', callbackMock.one);
      observer.listen('foo', callbackMock.two);
      observer.listen('foo', callbackMock.three);

      expect(observer._events.foo.length).toBe(3);
      expect(function() { observer.ignore(one[0], one[1]); }).not.toThrow();
      expect(observer._events.foo.length).toBe(2);
      expect(observer._events.foo).not.toContain(one[1]);

    });
    it('should throw an error if binding is attempted without the necessary params', function() {
      expect(function() { observer.ignore(undefined, undefined); }).toThrow();
      expect(function() { observer.ignore('foo', undefined); }).toThrow();
      expect(function() { observer.ignore(undefined, callbackMock.one); }).toThrow();
    });
  });

  describe('should execute bound callbacks when an event is triggered', function() {
    it('should only execute methods for a given event when that event is published', function() {
      observer.listen('one', callbackMock.one);
      observer.listen('two', callbackMock.two);
      observer.listen('three', callbackMock.three);

      expect(callbackMock.one).not.toHaveBeenCalled();
      expect(callbackMock.two).not.toHaveBeenCalled();
      expect(callbackMock.three).not.toHaveBeenCalled();

      observer.broadcast('one');

      expect(callbackMock.one).toHaveBeenCalled();
      expect(callbackMock.two).not.toHaveBeenCalled();
      expect(callbackMock.three).not.toHaveBeenCalled();
    });

    it('should execute all methods for a given event when that event is published', function() {
      observer.listen('one', callbackMock.one);
      observer.listen('one', callbackMock.two);
      observer.listen('three', callbackMock.three);

      expect(callbackMock.one).not.toHaveBeenCalled();
      expect(callbackMock.two).not.toHaveBeenCalled();
      expect(callbackMock.three).not.toHaveBeenCalled();

      observer.broadcast('one');

      expect(callbackMock.one).toHaveBeenCalled();
      expect(callbackMock.two).toHaveBeenCalled();
      expect(callbackMock.three).not.toHaveBeenCalled();
    });

    it('should pass the supplied data to assocaited methods when an event is published', function() {
      observer.listen('one', callbackMock.one);
      observer.listen('one', callbackMock.two);

      expect(callbackMock.one).not.toHaveBeenCalled();
      expect(callbackMock.two).not.toHaveBeenCalled();

      observer.broadcast('one', 'foo');

      expect(callbackMock.one).toHaveBeenCalledWith('foo');
      expect(callbackMock.two).toHaveBeenCalledWith('foo');
    });
    it('should throw an error if broadcasting is attempted without the necessary params', function() {
      expect(function() { observer.broadcast('foo', undefined); }).not.toThrow();
      expect(function() { observer.broadcast(undefined, undefined); }).toThrow();
      expect(function() { observer.broadcast(undefined, callbackMock.one); }).toThrow();
    });
  });
});