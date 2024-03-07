require('../ajv');

const _ = require('underscore');
const createLogger = require('../logger');

module.exports = async ({ config, db, jobsDir }) => {
  if (!_(process.env).has('NODE_JOB_NAME')) {
    // eslint-disable-next-line no-console
    console.error('NODE_JOB_NAME is unset, exit');
    process.exit(-1);
  }

  require('../extendMoment');

  const name = process.env.NODE_JOB_NAME;
  const logger = createLogger('main');

  require('../setUncaughtHandlers')({ logger });

  logger.info('pid:', process.pid);

  try {
    await db.init();
    logger.info('connection to mongodb has been established');

    await require(`${jobsDir}/${name}`)(logger, config.jobs[name].options);

    await db.close();
  } catch (err) {
    logger.error(err.stack || err);
    process.exit(1);
  }
};
