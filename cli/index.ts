#! /usr/bin/env node

import figlet from 'figlet';
import { Command } from 'commander';
import { jobs } from '@/lib/jobs';
import { JobConfig } from '@/jobs/worker';

if (!process.env.JOBS) {
  throw new Error('Process env variable JOBS is not defined');
}

const jobsConfig: JobConfig = JSON.parse(process.env.JOBS);

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
