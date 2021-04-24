'use strict';

const config = require('config');

const { Database} = require('arangojs');

const url = config.get('db.url');
const localUrl = config.get('db.localhost');
const databaseName = config.get('db.databaseName');
const username = config.get('db.username');
const password = config.get('db.password');

const db = new Database({
  url: process.env.NODE_ENV === 'production' ? url : localUrl,
  databaseName,
  auth: { username, password},
});

module.exports = db;