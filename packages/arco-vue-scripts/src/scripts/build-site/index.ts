import { build } from 'vite';
import config from '../../configs/vite.site.prod.js';

async function run() {
  await build(config);
}

export default run;
