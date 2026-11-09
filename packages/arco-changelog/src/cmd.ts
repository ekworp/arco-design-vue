#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { changelog } from './index.js';
import { run } from './copy-github.js';

const program = new Command();

const packageContent = fs.readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../package.json'),
  'utf8'
);
const packageData: any = JSON.parse(packageContent);

program
  .name('arco-changelog')
  .version(packageData.version)
  .action(async () => {
    await changelog();
  })
  .command('template')
  .option('--gitlab', 'generate gitlab template')
  .action(async ({ gitlab }) => {
    run({ gitlab });
  });

program.parse(process.argv);
