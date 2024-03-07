#! /usr/bin/env node

const figlet = require('figlet');
const { Command } = require('commander');
const { PrismaClient } = require('@prisma/client');

const jobs = {
  bindTabelToUserJob: {
    name: 'bindTabelToUserJob',
    schedule: '* * * * *'
  },
  copyVideoToOperativeStorage: {
    name: 'copyVideoToOperativeStorage',
    schedule: '* * * * *'
  }
};

const program = new Command();

console.log(figlet.textSync('AS VI'));

program
  .version('1.0.0')
  .description('An example CLI for managing ASVI daemons')
  .option('-jl, --job-list', 'List of ASVI jobs')
  .option('-m, --mkdir <value>', 'Create a directory')
  .option('-t, --touch <value>', 'Create a file')
  .parse(process.argv);

// program.version(process.env.npm_package_version);

const options = program.opts();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

async function run() {
  if (options.jobList) {
    console.table([jobs.bindTabelToUserJob, jobs.copyVideoToOperativeStorage]);
  }
}

run();
