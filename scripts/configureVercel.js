const fse = require('fs-extra');
const path = require('path');

const publicDir = path.join(process.cwd(), 'serverless', 'public');
const distDir = path.join(process.cwd(), 'dist');

async function run() {
   if (fse.existsSync(publicDir)) {
      fse.rmSync(publicDir, { recursive: true });
   }
   fse.moveSync(distDir, publicDir, { overwrite: true });
}
run();
