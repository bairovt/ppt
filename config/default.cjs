'use strict';
// const path = require('path');

const root = process.cwd();

module.exports = {
  // export default {
  // secret data can be moved to env variables
  // or a separate config
  root: root,
  env: 'development',
  db: {
    URL: 'http://127.0.0.1:8529',
    name: 'poputi_database_name',
    user: 'poputi_database_user',
    password: 'poputi_database_pass',
  },
  sqlite: {
    dbpath: '/path/to/.ViberPC/telnumber/viber.db',
  },
  bot: {
    token: 'bot-token-blah-blah',
  },
};
