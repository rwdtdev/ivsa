// import _ from 'underscore';
// import { createLogger } from '../logger';
// import { JobConfig } from '@/cli/jobs/worker';
// import { setUncaughtHandlers } from '@/lib/setUncaughtHandlers';

// type WorkerOptions = {
//   config: JobConfig;
//   jobsDir: string;
//   db: {
//     init: () => any;
//     close: () => any;
//   };
// };

// export const create = async ({ config, jobsDir }: WorkerOptions) => {
//   if (!_(process.env).has('NODE_JOB_NAME')) {
//     console.error('NODE_JOB_NAME is unset, exit');
//     process.exit(-1);
//   }

//   import('../extendMoment');

//   const name = process.env.NODE_JOB_NAME as string;
//   const logger = createLogger('main');

//   setUncaughtHandlers({ logger });

//   logger.info('pid:', process.pid);

//   try {
//     // TODO Open db connection for every job, add db to destructives params
//     // await db.init();
//     // logger.info('connection to PostgreSQL has been established');

//     await require(`${process.cwd()}/${jobsDir}/${name}`)(logger, config[name].options);

//     // await db.close();
//   } catch (err: any) {
//     logger.error(err.stack || err);
//     process.exit(1);
//   }
// };
