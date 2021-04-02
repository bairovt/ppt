import { aql } from 'arangojs';
import fs from 'fs';
import db from './lib/arangodb.js';

import { fetchViberDb, getStartEventId } from './fetchdb.js';
import { parseMsg } from './parser.js';
import { findFromTo } from './find.js';

async function main() {
  try {
    let lastEventId = await db
      .query(
        aql`
      FOR r in Recs
        SORT r.eventId DESC
        LIMIT 1
        RETURN r.eventId
    `
      )
      .then((cursor) => cursor.next());
    if (!lastEventId) {
      lastEventId = getStartEventId(24 * 3);
    }
    const msgs = fetchViberDb(lastEventId, 10000);

    const recsCollection = db.collection('Recs');
    await recsCollection.truncate();

    const recs = [];

    console.log('msgs count: ' + msgs.length);

    for (let msg of msgs) {
      const rec = parseMsg(msg);
      if (rec) {
        try {
          const newRec = await recsCollection.save(rec, { returnNew: true });
          recs.push(newRec);
        } catch(err) {
          // unique constraint violated
          if (err.code === 409 && err.errorNum === 1210) {
            let existingRec = await recsCollection.byExample({ Body: rec.Body })
              .then((cursor) => cursor.next());
            console.log('existingRec', existingRec);
            if (existingRec.TimeStamp < rec.TimeStamp) {
              await recsCollection.update(existingRec._id, rec);
            }
          } else {
            console.error('ошибка', err);
          }
        }
      }
    }

    console.log('recs count: ' + recs.length);    
    fs.writeFileSync('./result_recs.json', JSON.stringify(recs, null, 2));
    
    console.log('============= Found From To ===============');
    let found = await findFromTo({from: 'Агинское', to: 'Чита'});
    // let found = await findFromTo({ from: 'Чита', to: 'Агинское' });
    console.log(JSON.stringify(found, null, 2));
  } catch (err) {
    console.error(err);
  }
}

main();
