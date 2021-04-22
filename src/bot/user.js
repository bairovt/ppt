import {aql} from 'arangojs';
import db from '../lib/arangodb.js'

const usersColl = db.collection('Users');

export async function setUser(userData) {  
  const user = await usersColl.save(userData, { returnNew: true, overwriteMode: 'update' });
  return user;
}

export async function getUser(user_key) {  
  const user = await usersColl.document(user_key);
  return user;
}


export async function setUserRole(user_key, role) {  
  const user = await usersColl.update(user_key, { role });
  // return user;
}