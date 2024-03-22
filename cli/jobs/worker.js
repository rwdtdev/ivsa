const { worker } = require('../../lib/jobs');

if (!process.env.JOBS) {
  throw new Error('Process env variable JOBS is not defined');
}

// export type JobConfig = {
//   [key: string]: {
//     schedule: string;
//     enabled: boolean;
//     options: Record<string, unknown>;
//   };
// };

const config = JSON.parse(process.env.JOBS);

worker.create({
  jobsDir: 'jobs',
  config,
  // Заглушка, убрать, передать модуль по работе с postgre
  db: {
    init: () => {},
    close: () => {}
  }
});
