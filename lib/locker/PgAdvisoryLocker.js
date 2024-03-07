/*
https://postgrespro.ru/docs/postgrespro/9.5/functions-admin#functions-advisory-locks
*/

const { Client } = require('pg');
const BaseLocker = require('./BaseLocker');

class PgAdvisoryLocker extends BaseLocker {
  /**
   *
   * @param options - параметры подключения к posgresql
   * @param logger - логгер
   * @param ping - параметры пинга соединения:
   * {
   *   query, - запрос пинга соединения
   *   interval, - интервал запросов, ms
   *   log - выводить лог для пингов
   * }
   */
  constructor(options, logger, ping) {
    super(options, logger);

    this.ping = {
      query: 'SELECT 1;',
      interval: 60 * 1000,
      log: false
    };

    if (this.isValidPing(ping)) {
      this.ping = { ...this.ping, ...ping };
    }

    this.queries = {
      lock: {
        text: 'SELECT pg_try_advisory_lock($1) as "result";',
        result: 'result',
        default: false,
        error: 'PgAdvisoryLocker: lock error'
      },
      locked: {
        text:
          'SELECT COUNT(*) as result FROM pg_catalog.pg_locks ' +
          'WHERE locktype = $1 AND objid = $2;',
        result: 'result',
        default: 1,
        error: 'PgAdvisoryLocker: locked error'
      },
      unlock: {
        text: 'SELECT pg_advisory_unlock($1) as "result";',
        result: 'result',
        default: false,
        error: 'PgAdvisoryLocker: unlock error'
      }
    };

    this.pingTimeoutId = null;

    this.client = new Client(this.options);
    this.client
      .connect()
      .then(() => {
        this.reportLog('PgAdvisoryLocker has initialized successfully');
        this.schedulePing();
      })
      .catch((err) => this.reportError('PgAdvisoryLocker connection has failed', err));
  }

  /**
   * Эта функция либо немедленно получает блокировку и возвращает true,
   * либо сразу возвращает false, если получить её не удаётся.
   * @param id - идентификатор ресурса
   * @return {Promise<boolean>}
   */
  async lock(id) {
    if (this.getLockCounter(id) > 0) {
      return false;
    }

    this.incLockCounter(id);

    let result = false;
    try {
      result = await this.query(this.queries.lock, [id]);
    } catch (err) {
      this.decrLockCounter(id);
      throw err;
    }

    if (!result) {
      this.decrLockCounter(id);
    }

    return result;
  }

  /**
   * Освобождает ранее полученную исключительную блокировку на уровне сеанса.
   * @param id - идентификатор ресурса
   * @return {Promise<void>}
   */
  async unlock(id) {
    // Если блокировка освобождена успешна, эта функция возвращает true,
    // а если она не была занята — false,
    // при этом сервер выдаёт предупреждение SQL.
    // Если поступает сразу несколько запросов на блокировку,
    // они накапливаются.
    // Так что если один ресурс был заблокирован три раза,
    // его необходимо три раза разблокировать,
    // чтобы он был доступен в других сеансах.
    const numberUnlockRetries = this.getNumberUnlockRetries(id);

    for (let i = 0; i < numberUnlockRetries; i++) {
      const result = await this.query(this.queries.unlock, [id]);

      if (result) {
        this.decrLockCounter(id);
      } else {
        this.clearLockCounter(id);
        break;
      }
    }
  }

  /**
   * Проверяет установлена блокировка или нет
   * @param id - идентификатор ресурса
   * @return {Promise<boolean>}
   */
  async locked(id) {
    if (this.getLockCounter(id) > 0) {
      return true;
    }

    let result = await this.query(this.queries.locked, ['advisory', id]);
    result = parseInt(result, 10);

    return result > 0;
  }

  async query(query, values) {
    try {
      const { rows } = await this.client.query(query.text, values);

      if (!!rows && Array.isArray(rows) && rows.length) {
        return rows[0][query.result];
      } else {
        return query.default;
      }
    } catch (err) {
      this.reportError(query.error, err);
      throw err;
    }
  }

  isValidPing(ping) {
    if (!!ping && typeof ping == 'object') {
      return true;
    }

    return false;
  }

  /**
   * пинг для сохранения соединения
   * @param pingInterval - интервал пингов,
   * если 0, то пинг не выполняется
   */
  schedulePing() {
    if (this.ping.interval) {
      if (this.pingTimeoutId) {
        clearInterval(this.pingTimeoutId);
      }
      this.pingTimeoutId = setInterval(async () => {
        await this.pingHandler();
      }, this.ping.interval);

      if (this.ping.log) {
        this.reportLog(
          `PgAdvisoryLocker.ping scheduled: query ${this.ping.query}, interval  ${this.ping.interval}`
        );
      }
    }
  }

  async pingHandler() {
    await this.client.query(this.ping.query, []);
    if (this.ping.log) {
      this.reportLog(`PgAdvisoryLocker.ping OK`);
    }
  }
}

module.exports = PgAdvisoryLocker;
