/**
 * Logger Module
 * 
 * Provides centralized logging with timestamps for all services
 * Supports info, error, and warning levels
 * 
 * Author: Sparkle Bots
 * Version: 1.0.0
 */

/**
 * Logger Class
 * Handles all application logging with timestamps and service names
 */
class Logger {
  /**
   * Initialize logger
   * @param {string} serviceName - Name of the service using the logger
   */
  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  /**
   * Get formatted timestamp
   * @returns {string} ISO timestamp
   */
  getTimestamp() {
    return new Date().toISOString();
  }

  /**
   * Log info level messages
   * @param {string} message - Main message
   * @param {*} data - Additional data (optional)
   */
  info(message, data = '') {
    const timestamp = this.getTimestamp();
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      console.log(
        `\n[${timestamp}] ℹ️  [${this.serviceName}] ${message}`,
        data ? JSON.stringify(data, null, 2) : ''
      );
    } else {
      console.log(
        JSON.stringify({
          timestamp,
          level: 'INFO',
          service: this.serviceName,
          message,
          data: data || null,
        })
      );
    }
  }

  /**
   * Log error level messages
   * @param {string} message - Main message
   * @param {*} error - Error data
   */
  error(message, error = '') {
    const timestamp = this.getTimestamp();
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      console.error(
        `\n[${timestamp}] ❌ [${this.serviceName}] ${message}`,
        error ? JSON.stringify(error, null, 2) : ''
      );
    } else {
      console.error(
        JSON.stringify({
          timestamp,
          level: 'ERROR',
          service: this.serviceName,
          message,
          error: error || null,
        })
      );
    }
  }

  /**
   * Log warning level messages
   * @param {string} message - Main message
   * @param {*} data - Additional data (optional)
   */
  warn(message, data = '') {
    const timestamp = this.getTimestamp();
    const isDev = process.env.NODE_ENV !== 'production';

    if (isDev) {
      console.warn(
        `\n[${timestamp}] ⚠️  [${this.serviceName}] ${message}`,
        data ? JSON.stringify(data, null, 2) : ''
      );
    } else {
      console.warn(
        JSON.stringify({
          timestamp,
          level: 'WARNING',
          service: this.serviceName,
          message,
          data: data || null,
        })
      );
    }
  }
}

module.exports = { Logger };
