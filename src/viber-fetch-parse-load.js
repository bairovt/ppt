import { aql } from 'arangojs';
import db from './lib/arangodb.js';
import {errorLog} from './lib/error-log.js';
import config from 'config';
import { fetchViberDb, getStartEventId } from './viber/fetchdb.js';
import { parseMsg } from './parse/parser.js';
import { writeFileSync } from 'fs';
import path from 'path';

const root = config.get('root');

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
    .collection('ViberChats')
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

    // throw new Error();

    for (let msg of msgs) {
      const rec = parseMsg(msg);
      if (rec) {
        rec.src = 'viber';
        try {
          const newRec = await recsCollection.save(rec, { returnNew: true });
          recs.push(newRec);
        } catch (err) {
          // unique constraint violated
          if (err.code === 409 && err.errorNum === 1210) {
            let existingRec = await recsCollection
              .byExample({ Body: rec.Body })
              .then((cursor) => cursor.next());

            if (existingRec.TimeStamp < rec.TimeStamp) {
              await recsCollection.update(existingRec._id, rec);
            }

            dupls.allCount++;
            if (existingRec.role == 'M') {
              dupls.M++;
            }
          } else {
            throw err;
          }
        }
      }
      // throw new Error('bla bla err');
    }   

  } catch (error) {
    writeFileSync(
      path.join(root, 'log', Date.now() + '-viber-fetch.error'),
      errorLog(error)
    );
    throw(error);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('new msgs count: ', msgs.length);
    console.log('new recs count: ', recs.length);
    console.log('existing recs count: ', dupls.allCount);
    console.log('existing M recs count: ', dupls.M);
    console.log(Date.now() - startTime + ' мс\n-----');
  }
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
function gracefulStop(msg) {
  console.log(msg);
  db.close();
  process.exit();
}
process.once('SIGINT', () => {
  gracefulStop('\nSIGINT')
})
process.once('\nSIGTERM', () => {
  gracefulStop('\nSIGTERM'); 
})
