import _ from 'underscore';
import CronGroup from 'cron-group';
// import fs from 'fs';
// import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { createLogger } from '../logger';

const logger = createLogger('jobs');

type JobWorkerOptions = {
  jobsDir: string;
  name: string;
};

type CreateWorkerOptions = {
  jobs: Record<string, unknown>;
  timezone: string;
  jobsDir: string;
};

function getJobWorker({ jobsDir, name }: JobWorkerOptions) {
  return () =>
    new Promise<void>((resolve, reject) => {
      const child: ChildProcessWithoutNullStreams = spawn(
        process.argv[0],
        [`${jobsDir}/worker`],
        {
          stdio: 'inherit',
          // @ts-expect-error: Types conflict , spawn args definition don't see another process env vars, but they passed with spread operator
          env: {
            ..._(process.env).omit('NODE_WORKER_NAME', 'NODE_WORKER_ID'),
            NODE_WORKER_NAME: `${name} job`,
            NODE_JOB_NAME: name
          }
        }
      );

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

export const create = ({ jobs, timezone, jobsDir }: CreateWorkerOptions) => {
  const group = new CronGroup({ timezone });

  const init = () => {
    // const files = _(fs.readdirSync(jobsDir))
    //   .chain()
    //   .map((file) => path.basename(file, '.js'))
    //   .difference(['index', 'worker'])
    //   .value();

    // _(files)
    //   .chain()
    //   .difference(_(jobs).keys())
    //   .each((name) => {
    //     throw new Error(`Job "${name}" config is absent`);
    //   });

    // _(jobs)
    //   .chain()
    //   .keys()
    //   .difference(files)
    //   .each((name) => {
    //     throw new Error(`Job "${name}" config is extraneous`);
    //   });

    // @ts-expect-error expected collection, but it object, underscore can work with object in each method
    _(jobs).each(({ enabled, schedule }, name: string) => {
      console.log(name, enabled);
      if (enabled) {
        logger.info(`enabling ${name}`);

        group.add({
          name,
          schedule,
          worker: getJobWorker({ jobsDir, name })
        });
      }
    });

    group.on('run', ({ name, runnedBy }: { name: string; runnedBy: string }) => {
      logger.log(`${name} is runned by ${runnedBy}`);
    });

    group.on(
      'complete',
      ({
        name,
        runnedAt,
        completedAt
      }: {
        name: string;
        runnedAt: number;
        completedAt: number;
      }) => {
        const prettyTime = Math.floor((completedAt - runnedAt) / 1000);
        logger.log(`${name} successfully completed in ${prettyTime}s`);
      }
    );

    group.on('error', ({ name, err }: { name: string; err: Error }) => {
      logger.error(`${name} is completed with error\n${err.stack || err}`);
    });

    group.start();
  };

  return {
    init,
    stop: () => group.stop(),
    run: (...args: string[]) => group.run(...args),
    jobs: group.jobs
  };
};
