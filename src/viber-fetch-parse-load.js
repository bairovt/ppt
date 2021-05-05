const { aql } = require('arangojs');
const db = require('./lib/arangodb.js');
const {errorLog} = require('./lib/error-log.js');
const config = require('config');
const { fetchViberDb, getStartEventId } = require('./viber/fetchdb.js');
const { parseMsg } = require('./parse/parser.js');
const { writeFileSync } = require('fs');
const path = require('path');

const root = config.get('root');

async function fetchParseLoad() {
  let startTime = Date.now();
  let msgs = [];
  const recs = [];  
  
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
      const recData = await parseMsg(msg);
      if (recData.route.length < 2) {
        const UnroutedRecsColl = db.collection('UnroutedRecs');
        try {
          await UnroutedRecsColl.save(recData);
        } catch (err) {
          if (err.code === 409 && err.errorNum === 1210) {
            const existingRec = await UnroutedRecsColl.byExample({
              Body: recData.Body,
            }).then((cursor) => cursor.next());
            recData.dupls = existingRec.dupls ? existingRec.dupls + 1 : 1;
            await UnroutedRecsColl.update(existingRec._id, recData);            
          } else {
            throw err;
          }
        }
      } else {
        const RecsColl = db.collection('Recs');
        recData.src = 'viber';
        try {
          const rec = await RecsColl.save(recData, { returnNew: true });
          recs.push(rec);
        } catch (err) {
          // unique constraint violated
          if (err.code === 409 && err.errorNum === 1210) {
            let existingRec = await RecsColl
              .byExample({ Body: recData.Body })
              .then((cursor) => cursor.next());

            if (existingRec.TimeStamp < recData.TimeStamp) {
              await RecsColl.update(existingRec._id, recData);
            }            
          } else {
            throw err;
          }
        }
      }      
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
    console.log(Date.now() - startTime + ' мс\n-----');
  }
}

function delaySec(sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

async function main() {
  // await RecsColl.truncate();
  while (true) {
    await fetchParseLoad();
    await delaySec(10);
  }
}

main();

// Enable graceful stop
function gracefulStop(msg) {
  console.log(msg);
  db.close();
  process.exit();
}
process.once('SIGINT', () => gracefulStop('\nSIGINT'));
process.once('\nSIGTERM', () => gracefulStop('\nSIGTERM'));
