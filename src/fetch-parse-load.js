import { aql } from 'arangojs';
import db from '../src/lib/arangodb.js';

import { fetchViberDb, getStartEventId } from './fetchdb.js';
import { parseMsg } from '../src/parse/parser.js';

let ECONNRESET_error_cnt = 0;

const recsCollection = db.collection('Recs');

async function fetchParseLoad() {
  let startTime = Date.now();
  let msgs = [];
  const recs = [];
  const dupls = {
    allCount: 0,
    M: 0,
  };
  
  const chats = await db
    .collection('Chats')
    .all()
    .then((cursor) => cursor.all());

  try {
    let lastEventId = await db
      .query(
        aql`
      FOR rec in Recs
        SORT rec.EventID DESC
        LIMIT 1
        RETURN rec.EventID
    `
      )
      .then((cursor) => cursor.next());
    if (!lastEventId) {
      lastEventId = getStartEventId(24 * 3);
    }
    
    msgs = fetchViberDb(chats, lastEventId, 10000);    

    for (let msg of msgs) {
      const rec = parseMsg(msg);
      if (rec) {
        rec.src='viber';
        try {
          const newRec = await recsCollection.save(rec, { returnNew: true });
          recs.push(newRec);
        } catch(err) {
          // unique constraint violated
          if (err.code === 409 && err.errorNum === 1210) {
            let existingRec = await recsCollection.byExample({ Body: rec.Body })
              .then((cursor) => cursor.next());

            if (existingRec.TimeStamp < rec.TimeStamp) {
              await recsCollection.update(existingRec._id, rec);
            }
            
            dupls.allCount ++;
            if (existingRec.role == 'M') {
              dupls.M ++;
              // console.log(existingRec.Body);
            }
            
            
          } else {            
            throw(err);
          }
        }
      }
    }   

  } catch (err) {
    // todo: log errors
    if (err.code === 'ECONNRESET') {
      ECONNRESET_error_cnt++;
    } else {
      console.error('Unhandled ошибка: ', err);
      throw(err);
    }
  }
  console.log('new msgs count: ', msgs.length);
  console.log('new recs count: ', recs.length);
  console.log('existing recs count: ', dupls.allCount);
  console.log('existing M recs count: ', dupls.M);

  // db.close();
  console.log('ECONNRESET_error_cnt : ', ECONNRESET_error_cnt);
  console.log(Date.now() - startTime + ' мс\n-----');
}

function delay(sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

async function main() {
  // await recsCollection.truncate();
  while (true) {
    await fetchParseLoad();
    await delay(60);
  }
}

main();

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('\nSIGINT');
  if (ECONNRESET_error_cnt) {
    console.log('ECONNRESET_error_cnt : ', ECONNRESET_error_cnt);
  };
  db.close();
  process.exit();
})
process.once('\nSIGTERM', () => {
  console.log('SIGTERM');
  if (ECONNRESET_error_cnt) {
    console.log('ECONNRESET_error_cnt : ', ECONNRESET_error_cnt);
  }
  db.close();
  process.exit();
})
