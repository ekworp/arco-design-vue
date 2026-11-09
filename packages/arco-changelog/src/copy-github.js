import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

export const run = ({ gitlab }) => {
  if (gitlab) {
    fs.copySync(
      path.resolve(currentDir, '.gitlab'),
      path.resolve(process.cwd(), '.gitlab'),
      {
        overwrite: true,
      }
    );
  } else {
    fs.copySync(
      path.resolve(currentDir, '.github'),
      path.resolve(process.cwd(), '.github'),
      {
        overwrite: true,
      }
    );
  }
};
