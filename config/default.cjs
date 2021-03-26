'use strict';
// const path = require('path');

const root = process.cwd();

module.exports = {
// export default {
  // secret data can be moved to env variables
  // or a separate config
  botToken: ['super creazy secret key'],
  root: root,  
  env: 'development',  
  db: {
    URL: 'http://127.0.0.1:8529',
    name: 'omog_database_name',
    user: 'omog_database_user',
    password: 'omog_database_pass'
  }  
};
