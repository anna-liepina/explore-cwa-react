/**
 * this file is written only for purpose, be not bound to 'unix' enviroment, in case if you want execute tests in windows
 */
const fs = require('fs-extra');

console.info(`clearing old reports...`);

fs.emptyDirSync(`${process.cwd()}/report`);
