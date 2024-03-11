const PgAdvisoryLocker = require('./PgAdvisoryLocker');

let locker = null;

class Locker {
  /**
   * Получение экземпляра блокировщика, singleton
   * @param params - {options, logger}
   * - options: параметры подключения к БД
   * - logger: сервис логирования
   * @return {null}
   */
  static getInstance(params) {
    const { options, logger, ping } = params;

    if (!locker) {
      locker = new PgAdvisoryLocker(options, logger, ping);
    }

    return locker;
  }
}

module.exports = Locker;
