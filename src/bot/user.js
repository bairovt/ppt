const {aql} = require('arangojs');
const db = require('../lib/arangodb.js');

const usersColl = db.collection('Users');
const logsColl = db.collection('Logs');

async function setUser(userData) {  
  const user = await usersColl.save(userData, { returnNew: true, overwriteMode: 'update' });
  return user;
}

async function getUser(user_key) {  
  const user = await usersColl.document(user_key);
  return user;
}


async function setUserRole(user_key, role) {  
  const user = await usersColl.update(user_key, { role });
  // return user;
}

async function logToDb(data) {
  const log = await logsColl.save(data);  
}

module.exports = { setUser, getUser, setUserRole, logToDb };