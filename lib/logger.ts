import chalk from 'chalk';
import { format } from 'util';

export class Logger {
  private name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }

  static getDate(): string {
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error ts believes that the subject may be undefined.
      return new Date().toISOString().split('T').pop().slice(0, -1);
    }

    return new Date().toUTCString();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  _format(color: Function, ...args: unknown[]) {
    return [
      chalk.gray(`[${Logger.getDate()}]`),
      chalk.magenta(`[${this.name}]`),
      color(format(...args))
    ].join(' ');
  }

  log(...args: unknown[]) {
    console.log(this._format(chalk.reset, ...args));
  }

  info(...args: unknown[]) {
    console.info(this._format(chalk.cyan, ...args));
  }

  warn(...args: unknown[]) {
    console.warn(this._format(chalk.yellow, ...args));
  }

  error(...args: unknown[]) {
    console.error(this._format(chalk.red, ...args));
  }
  /* eslint-enable no-console */
}

export const createLogger = (name: string) => new Logger({ name });
