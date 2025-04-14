/**
 * Simple logging utility
 */

const logLevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

class Logger {
  constructor() {
    this.logLevel = isDev ? logLevels.DEBUG : logLevels.INFO;
  }

  /**
   * Log an error with additional context
   */
  async logError(error, context = {}) {
    console.error(`[ERROR] ${error?.message || 'Unknown error'}`, {
      stack: error?.stack,
      ...context
    });
    
    // In a real app, you might send this to a logging service
    return true;
  }

  /**
   * Log a warning
   */
  async logWarning(message, data = {}) {
    if (this.shouldLog(logLevels.WARN)) {
      console.warn(`[WARN] ${message}`, data);
    }
    return true;
  }

  /**
   * Log general information
   */
  async logInfo(message, data = {}) {
    if (this.shouldLog(logLevels.INFO)) {
      console.info(`[INFO] ${message}`, data);
    }
    return true;
  }

  /**
   * Log detailed debug information (only in development)
   */
  async logDebug(message, data = {}) {
    if (this.shouldLog(logLevels.DEBUG)) {
      console.log(`[DEBUG] ${message}`, data);
    }
    return true;
  }

  /**
   * Log a system event
   */
  async logSystemEvent(event = {}) {
    const { type, status, message, data } = event;
    console.info(`[SYSTEM] ${type} - ${status}${message ? ': ' + message : ''}`, data || {});
    return true;
  }

  /**
   * Check if we should log at this level
   */
  shouldLog(level) {
    const levels = Object.values(logLevels);
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const targetLevelIndex = levels.indexOf(level);
    
    return targetLevelIndex <= currentLevelIndex;
  }

  /**
   * Set the log level
   */
  setLogLevel(level) {
    if (Object.values(logLevels).includes(level)) {
      this.logLevel = level;
    }
  }
}

// Create and export a single instance
export const logger = new Logger();