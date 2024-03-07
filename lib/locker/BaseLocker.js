class BaseLocker {
  constructor(options, logger) {
    this.options = options;
    this.logger = logger;
    this.locks = new Map();
    this.maxUnlockAttempt = 100;
  }

  getNumberUnlockRetries(id) {
    return this.getLockCounter(id) || this.maxUnlockAttempt;
  }

  getLockCounter(id) {
    return this.locks.has(id) ? this.locks.get(id) : 0;
  }

  incLockCounter(id) {
    this.locks.set(id, this.getLockCounter(id) + 1);
  }

  decrLockCounter(id) {
    const n = this.getLockCounter(id);

    if (n > 1) {
      this.locks.set(id, n - 1);
    } else {
      this.clearLockCounter(id);
    }
  }

  clearLockCounter(id) {
    if (this.locks.has(id)) {
      this.locks.delete(id);
    }
  }

  reportLog(message) {
    if (this.logger) {
      this.logger.log(message);
    }
  }

  reportInfo(message) {
    if (this.logger) {
      this.logger.info(message);
    }
  }

  reportError(message, error) {
    if (this.logger) {
      if (error) {
        this.logger.error(`${message}\n${error.message}\n${error.stack || error}`);
      } else {
        this.logger.error(message);
      }
    }
  }
}

module.exports = BaseLocker;
