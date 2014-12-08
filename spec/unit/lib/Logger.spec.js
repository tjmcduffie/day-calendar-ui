describe('the Logger', function () {

  var nativeConsole = console;

  beforeEach(function () {
    spyOn(console, 'log');
    spyOn(console, 'warn');
    spyOn(console, 'error');

    if (!!(typeof console.log.and)) {
      window.console = jasmine.createSpyObj('console', ['log', 'warn', 'error']);
    }
  });

  afterEach(function () {
    window.console = nativeConsole;
  });

  describe('communicates various levels of messages to the system', function () {

    describe('messages are passed through to the system console', function () {
      beforeEach(function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.DEBUG);
      });

      it('and calles the corresponding method based on severity', function () {
        TMCD.Logger.debug('this is a debug test');
        expect(console.log.calls.count()).toEqual(1);
        expect(console.log).toHaveBeenCalledWith('this is a debug test');

        TMCD.Logger.warn('this is a warn test');
        expect(console.warn.calls.count()).toEqual(1);
        expect(console.warn).toHaveBeenCalledWith('this is a warn test');

        TMCD.Logger.error('this is a error test');
        expect(console.error.calls.count()).toEqual(1);
        expect(console.error).toHaveBeenCalledWith('this is a error test');
      });
    });

    describe('and can suppress messages based on severity', function () {
      it('by setting the report level', function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.DEBUG);
        expect(TMCD.Logger.options.REPORT_LEVEL).toEqual(TMCD.Logger.reportLevel.DEBUG);

        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.WARN);
        expect(TMCD.Logger.options.REPORT_LEVEL).toEqual(TMCD.Logger.reportLevel.WARN);

        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.ERROR);
        expect(TMCD.Logger.options.REPORT_LEVEL).toEqual(TMCD.Logger.reportLevel.ERROR);

        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.NONE);
        expect(TMCD.Logger.options.REPORT_LEVEL).toEqual(TMCD.Logger.reportLevel.NONE);
      });

      it('when set to debug, no messages should be suppressed', function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.DEBUG);
        TMCD.Logger.debug('this is a debug test');
        TMCD.Logger.warn('this is a warn test');
        TMCD.Logger.error('this is a error test');

        expect(console.log).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });

      it('when set to warn, messges with severity lower than warning should be suppressed', function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.WARN);
        TMCD.Logger.debug('this is a debug test');
        TMCD.Logger.warn('this is a warn test');
        TMCD.Logger.error('this is a error test');

        expect(console.log).not.toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });

      it('when set to error, messges with severity lower than error should be suppressed', function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.ERROR);
        TMCD.Logger.debug('this is a debug test');
        TMCD.Logger.warn('this is a warn test');
        TMCD.Logger.error('this is a error test');

        expect(console.log).not.toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });

      it('when set to none, all messges should be suppressed', function () {
        TMCD.Logger.setOption('REPORT_LEVEL', TMCD.Logger.reportLevel.NONE);
        TMCD.Logger.debug('this is a debug test');
        TMCD.Logger.warn('this is a warn test');
        TMCD.Logger.error('this is a error test');

        expect(console.log).not.toHaveBeenCalled();
        expect(console.warn).not.toHaveBeenCalled();
        expect(console.error).not.toHaveBeenCalled();
      });
    });

  });
});