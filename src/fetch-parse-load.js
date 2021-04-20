import { aql } from 'arangojs';
import db from '../src/lib/arangodb.js';

import { fetchViberDb, getStartEventId } from './fetchdb.js';
import { parseMsg } from '../src/parse/parser.js';

async function main() {
  let startTime = Date.now();
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
              if (existingRec.role != 'M') {
                console.log('existingRec', {
                  role: existingRec.role,
                  Body: existingRec.Body,
                  from: existingRec.from,
                  to: existingRec.to,
                  ChatName: existingRec.ChatName,
                  ClientName: existingRec.ClientName,
                  TimeStamp: existingRec.TimeStamp,
                  cleanedBody: existingRec.cleanedBody,
                  route: existingRec.route,
                });
              }
            
            if (existingRec.TimeStamp < rec.TimeStamp) {
              await recsCollection.update(existingRec._id, rec);
            }
          } else {
            console.error('ошибка', err);
          }
        }
      }
    }

    console.log('msgs count: ' + msgs.length);
    console.log('recs count: ' + recs.length);    

  } catch (err) {
    console.error(err);
  }
  console.log(Date.now() - startTime + ' мс');
}

main();
