/* eslint-disable max-classes-per-file */
const chalk = require('chalk');
const { format } = require('util');

class Logger {
  constructor({ name }) {
    this.name = name;
  }

  static getDate() {
    if (process.env.NODE_ENV === 'development') {
      return new Date().toISOString().split('T').pop().slice(0, -1);
    }

    return new Date().toUTCString();
  }

  _format(color, ...args) {
    return [
      chalk.gray(`[${Logger.getDate()}]`),
      chalk.magenta(`[${this.name}]`),
      color(format(...args))
    ].join(' ');
  }

  /* eslint-disable no-console */
  log(...args) {
    console.log(this._format(chalk.reset, ...args));
  }

  info(...args) {
    console.info(this._format(chalk.cyan, ...args));
  }

  warn(...args) {
    console.warn(this._format(chalk.yellow, ...args));
  }

  error(...args) {
    console.error(this._format(chalk.red, ...args));
  }
  /* eslint-enable no-console */
}

class DummyLogger {
  log() {}
  info() {}
  warn() {}
  error() {}
}

const isTest = process.env.TAP === '1';

module.exports = (name) => (isTest ? new DummyLogger() : new Logger({ name }));
module.exports.Logger = Logger;
