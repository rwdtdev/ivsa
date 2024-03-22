const figlet = require('figlet');
const { Command } = require('commander');
const { jobs } = require('../lib/jobs');

if (!process.env.JOBS) {
  throw new Error('Process env variable JOBS is not defined');
}

const jobsConfig = JSON.parse(process.env.JOBS);

const program = new Command();

console.log(figlet.textSync('AS VI'));

program
  .version('1.0.0')
  .description('An example CLI for managing ASVI daemons')
  .option('-jl, --job-list', 'List of ASVI jobs')
  .parse(process.argv);

// program.version(process.env.npm_package_version);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

async function run() {
  if (options.jobList) {
    const group = jobs.create({
      jobs: jobsConfig,
      timezone: 'Europe/Moscow',
      jobsDir: './jobs'
    });

    group.init();
  }
}

run();
