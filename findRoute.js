import fs from 'fs';

import { aql } from 'arangojs';
import db from './lib/arangodb.js';

export async function findRoute(role, from, to) {
  const recs = await db
    .query(
      aql`
    FOR rec IN Recs
    FILTER rec.role == ${role}
    LET a = POSITION(rec.route, ${from}, true)
    LET b = POSITION(rec.route, ${to}, true)
    FILTER a != -1 AND b != -1
    FILTER b > a
    SORT rec.TimeStamp DESC
    RETURN {role: rec.role, Body: rec.Body, Chat: rec.ChatName, TimeStamp: rec.TimeStamp }`
    )
    .then((cursor) => cursor.all());
  return recs;
}

export async function findFromTo(direction) {
  const recs = await db
    .query(
      aql`
    FOR rec IN Recs
    FILTER rec.from == ${direction.from}
    FILTER rec.to == ${direction.to} OR IS_NULL(rec.to) 
    RETURN rec
    `
    )
    .then((cursor) => cursor.all());
  return recs;
}

// console.log('============= Found From To ===============');
// let found = await findFromTo({from: 'Могойтуй', to: 'Агинское'});
// console.log(JSON.stringify(found, null, 2));

async function main() {
  let res = await findRoute('D', 'Краснокаменск', 'Чита');
  console.log('res ', res);
  fs.writeFileSync('./result_recs.json', JSON.stringify(res, null, 2));
}

main();
