import {aql} from 'arangojs';
import fs from 'fs';
import db from './lib/arangodb.js';


import {fetchViberDb, getStartEventId} from './fetchdb.js';
import {parseMsg} from './parser.js';


// setInterval(() => {
//   fetchViberDb()
// }, 60*1000)

async function main(){
  try {
    let lastEventId = await db.query(aql`
      FOR r in Recs
        SORT r.eventId DESC
        LIMIT 1
        RETURN r.eventId
    `).then(cursor => cursor.next());
    if (!lastEventId) {
      lastEventId = getStartEventId(24*3);
    }
    const msgs = fetchViberDb(lastEventId, 10000);
    fs.writeFileSync('./recstmp.json', JSON.stringify(msgs, null, 2));
    const recsCollection = db.collection('Recs');
    let counter = 0;
    for (let msg of msgs) {
      const rec = parseMsg(msg);
      if (rec) {
        await recsCollection.save(rec);
        counter++;
        console.log('added');
      }      
    }
    console.log('counter: ', counter);
  } catch (err) {
    console.error(err)
  }
};

main();

