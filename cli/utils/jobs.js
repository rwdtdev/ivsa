const _ = require('underscore');
const CronGroup = require('cron-group');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const createLogger = require('./logger');

const logger = createLogger('jobs');

function getJobWorker({ jobsDir, name }) {
  return () =>
    new Promise((resolve, reject) => {
      const child = spawn(process.argv[0], [`${jobsDir}/worker`], {
        stdio: 'inherit',
        env: {
          ..._(process.env).omit('NODE_WORKER_NAME', 'NODE_WORKER_ID'),
          NODE_WORKER_NAME: `${name} job`,
          NODE_JOB_NAME: name
        }
      });

      child.on('error', (err) => {
        child.removeAllListeners('exit');
        reject(err);
      });

      child.on('exit', (code, signal) => {
        if (code !== 0) {
          const message = `${name} job died with ${code} code and ${signal} signal`;
          reject(new Error(message));
        } else {
          resolve();
        }
      });
    });
}

exports.create = ({ jobs, timezone, jobsDir }) => {
  const group = new CronGroup({ timezone });

  const init = () => {
    const files = _(fs.readdirSync(jobsDir))
      .chain()
      .map((file) => path.basename(file, '.js'))
      .difference(['index', 'worker'])
      .value();

    _(files)
      .chain()
      .difference(_(jobs).keys())
      .each((name) => {
        throw new Error(`Job "${name}" config is absent`);
      });

    _(jobs)
      .chain()
      .keys()
      .difference(files)
      .each((name) => {
        throw new Error(`Job "${name}" config is extraneous`);
      });

    _(jobs).each(({ enabled, schedule }, name) => {
      if (enabled) {
        logger.info(`enabling ${name}`);

        group.add({
          name,
          schedule,
          worker: getJobWorker({ jobsDir, name })
        });
      }
    });

    group.on('run', ({ name, runnedBy }) => {
      logger.log(`${name} is runned by ${runnedBy}`);
    });

    group.on('complete', ({ name, runnedAt, completedAt }) => {
      const prettyTime = Math.floor((completedAt - runnedAt) / 1000);
      logger.log(`${name} successfully completed in ${prettyTime}s`);
    });

    group.on('error', ({ name, err }) => {
      logger.error(`${name} is completed with error\n${err.stack || err}`);
    });

    group.start();
  };

  return {
    init,
    stop: () => group.stop(),
    run: (...args) => group.run(...args),
    jobs: group.jobs
  };
};
