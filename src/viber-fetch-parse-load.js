const { aql } = require('arangojs');
const db = require('./lib/arangodb.js');
const {errorLog} = require('./lib/error-log.js');
const config = require('config');
const { fetchViberDb, getStartEventId } = require('./viber/fetchdb.js');
const { parseMsg } = require('./parse/parser.js');
const { writeFileSync } = require('fs');
const path = require('path');
const fillSubs = require('./utils/fill-subscriptions');
const axios = require('axios').default;

const root = config.get('root');

async function fetchParseLoad() {
  let startTime = Date.now();
  let viberMsgs = [];
  const recs = [];
  const subsToNotify = [];
  
  const [chats, subs] = await Promise.all([
    await db.query(
      aql`
      FOR chat in ViberChats        
        RETURN chat`
    )
    .then((cursor) => cursor.all()),
    await db.query(
      aql`
      FOR sub in Subs        
        RETURN sub`
    )
    .then((cursor) => cursor.all())
    ]);

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
    
    viberMsgs = fetchViberDb(chats, lastEventId, 10000);    

    for (let viberMsgData of viberMsgs) {
      if (/выигр|продам|купл(ю|им)|сниму/i.test(viberMsgData.Body)) continue; // skip spam

      const recData = await parseMsg(viberMsgData);
     
      const collRecs = db.collection('Recs');
      recData.src = 'viber';
      if (recData.route.length < 2) recData.ur = true;
      try {
        const rec = await collRecs.save(recData, { returnNew: true });
        recs.push(rec);
      } catch (err) {
        // unique constraint violated
        if (err.code === 409 && err.errorNum === 1210) {
          let existingRec = await collRecs
            .byExample({ Body: recData.Body })
            .then((cursor) => cursor.next());
          recData.dupl = existingRec.dupl ? existingRec.dupl + 1 : 1;                     
          await collRecs.update(existingRec._id, recData);  
        } else {
          throw err;
        }
      }

      if (recData.route.length >= 2) {
        subsToNotify.push(...fillSubs(recData, subs));
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
    console.log('new viberMsgs count: ', viberMsgs.length);
    console.log('new recs count: ', recs.length);    
    console.log(Date.now() - startTime + ' мс\n-----');
  }

  // notify subs
  await Promise.all(subsToNotify.map((sub) => {
    axios.post('http://localhost:3030/notify', sub);
  }));

}

function delaySec(sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

async function main() {
  // await collRecs.truncate();
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
