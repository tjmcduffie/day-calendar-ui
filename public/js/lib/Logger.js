/* jshint sub: true */
/* global TMCD */
'use strict';

/**
 * Logger object allowing modules to send messages to the appropriate destination. Currently this only sends
 * messages to the console, however it can be easily extended to sed messages to a service for saving or
 * further communication.
 *
 * @class Logger
 * @static
 */
TMCD.Logger = function () {
};


/**
 * The report level matrix. This should be used for all log level setting or comparison. When changing the
 * reporting level, be aware that only messages with a greater or equal priority are output. The priority
 * order from lowest to high is as follows:
 * <ol>
 *   <li><strong>DEBUG</strong> - handle all messages</li>
 *   <li><strong>WARN</strong> - handle warnings and errors messages</li>
 *   <li><strong>ERROR</strong>- handle errors messages</li>
 *   <li><strong>NONE</strong> - suppress all messages</li>
 * </ol>
 *
 * @property reportLevel
 * @type {Enum}
 * @readonly
 */
TMCD.Logger.reportLevel = {
  DEBUG: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4
};


/**
 * Map of option properties and values. Property naems must be strings and refernced using array notation to
 * prevent issues from obfuscation.
 *
 * @property options
 * @type {Object}
 * @static
 */
TMCD.Logger.options = {
  'REPORT_LEVEL' : TMCD.Logger.reportLevel.DEBUG
};

TMCD.Logger.setOption = function (key, value) {
  if (!TMCD.Logger.options[key] && !!(console)) {
    console.warn(key + 'does not exist an an option for TMCD.Logger.');
  }
  TMCD.Logger.options[key] = value;
};


/**
 * Handles a message sent with a priority of 'debug'. Only executes if the priority is set to DEBUG.
 *
 * @method debug
 * @param {Mixed} [...args] Argments passed to console.log
 * @static
 */
TMCD.Logger.debug = function() {
  if (TMCD.Logger.options['REPORT_LEVEL'] <= TMCD.Logger.reportLevel.DEBUG && console) {
    console.log.apply(console, arguments);
  }
};


/**
 * Handles a message sent with a priority of 'warn'. Only executes if the priority is set to WARN or lower.
 *
 * @method warn
 * @param {Mixed} [...args] Argments passed to console.warn
 * @static
 */
TMCD.Logger.warn = function() {
  if (TMCD.Logger.options['REPORT_LEVEL'] <= TMCD.Logger.reportLevel.WARN && console) {
    console.warn.apply(console, arguments);
  }
};


/**
 * Handles a message sent with a priority of 'error'. Only executes if the priority is set to ERROR or lower.
 *
 * @method error
 * @param {Mixed} [...args] Argments passed to console.error
 * @static
 */
TMCD.Logger.error = function() {
  if (TMCD.Logger.options['REPORT_LEVEL'] <= TMCD.Logger.reportLevel.ERROR && console) {
    console.error.apply(console, arguments);
  }
};
