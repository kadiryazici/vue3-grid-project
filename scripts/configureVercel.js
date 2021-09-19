const fse = require('fs-extra');
const path = require('path');

// node v14.14.0 needed for fs.rm

const publicDir = path.join(process.cwd(), 'serverless', 'public');
const distDir = path.join(process.cwd(), 'dist');

async function run() {
   if (await fse.pathExists(publicDir)) {
      await fse.rm(publicDir, { recursive: true });
   }
   await fse.copy(distDir, publicDir, { overwrite: true });
}
run();
