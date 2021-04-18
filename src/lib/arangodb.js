'use strict';

import config from 'config';

import { Database, aql} from 'arangojs';

const url = config.get('db.url');
const databaseName = config.get('db.databaseName');
const username = config.get('db.username');
const password = config.get('db.password');

const db = new Database({
  url,
  databaseName,
  auth: { username, password},
});

export default db;