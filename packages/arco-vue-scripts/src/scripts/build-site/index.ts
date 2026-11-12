import { build } from 'vite';
import config from '../../configs/vite.site.prod.js';

async function run() {
  await build(
    await (config as any)({ command: 'build', mode: 'production' }),
  );
}

export default run;
