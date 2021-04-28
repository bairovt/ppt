const {aql} = require('arangojs');
const db = require('../lib/arangodb.js');

const usersColl = db.collection('Users');
const logsColl = db.collection('Logs');

async function setUser(userData) {  
  const user = await usersColl.save(userData, { returnNew: true, overwriteMode: 'update' });
  return user;
}

async function getUser(ctx) {  
  let user_key = ctx.from.id;
  if (user_key) {
    user_key = String(user_key);
    const user = await usersColl.document(user_key);
    return user;
  } else {
    throw(new Error('myerr: getUser - empty - from.id'));
  }
}

async function setUserRole(user_key, role) {  
  await usersColl.update(user_key, { role });  
}

async function logToDb(data) {
  const log = await logsColl.save(data);  
}

module.exports = { setUser, getUser, setUserRole, logToDb };