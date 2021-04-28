const {aql} = require('arangojs');
const db = require('../lib/arangodb.js');

const usersColl = db.collection('Users');
const logsColl = db.collection('Logs');

async function setUser(userData) {  
  const user = await usersColl.save(userData, { returnNew: true, overwriteMode: 'update' });
  return user;
}

async function getUser(ctx) {
  let user_key = '';      
  const updateTypes = ['message', 'callback_query', 'edited_message', 'my_chat_member'];
  for (let updateType of updateTypes) {
    if (ctx.update[updateType]) {
      user_key = String(ctx.update[updateType].from.id);
      break;
    }
  }
  if (user_key) {
    const user = await usersColl.document(user_key);
    return user;
  } else {
    throw(new Error('myerr: getUser - update type - from.id'));  
  }
}


async function setUserRole(user_key, role) {  
  const user = await usersColl.update(user_key, { role });
  // return user;
}

async function logToDb(data) {
  const log = await logsColl.save(data);  
}

module.exports = { setUser, getUser, setUserRole, logToDb };