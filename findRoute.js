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
    RETURN {
      role: rec.role, Body: rec.Body, Chat: rec.ChatName, 
      Time: DATE_FORMAT(rec.TimeStamp+32400000, "%hh:%ii %dd.%mm.%yy"),
      TimeStamp: rec.TimeStamp,
      route: rec.route
    }`
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

async function main() {
  let res1 = await findRoute('D', 'Краснокаменск', 'Чита');
  let res2 = await findRoute('D', 'Краснокаменск', 'Агинское');
  let res = res1.concat(res2);
  console.log('res ', res);
  fs.writeFileSync('./result_recs.json', JSON.stringify(res, null, 2));
}

main();
