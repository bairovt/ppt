'use strict';
// const path = require('path');
// const root = process.cwd();

module.exports = {
  // export default {
  // secret data can be moved to env variables
  // or a separate config
  env: 'development',
  root: '/path/to/project/dir',
  db: {
    url: 'http://127.0.0.1:8529',
    localhost: 'http://127.0.0.1:8529',
    databaseName: 'poputi_database_name',
    username: 'poputi_database_user',
    password: 'poputi_database_pass',
  },
  sqlite: {
    dbpath: '/path/to/.ViberPC/telnumber/viber.db',
  },
  bot: {
    token: 'bot-token-blah-blah',
    adsInterval: 2,
  },
  LOGS_DIR: 'logs',
  ADMIN_CHAT_ID: 123456789,
  BOT_HTTP_URL: 'http://localhost:3030'
};
