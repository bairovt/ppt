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
    const recsCollection = db.collection('Recs');
    const recs = [];
    let counter = 0;
    
    console.log('msgs count: ' + msgs.length);
    for (let msg of msgs) {
      const rec = parseMsg(msg);
      if (rec) {
        const newRec = await recsCollection.save(rec, {returnNew: true});
        const newRecPart = {
          ChatName: newRec.new.ChatName,
          role: newRec.new.role,
          from: newRec.new.from,
          to: newRec.new.to,
          Body: newRec.new.Body,
          ClientName: newRec.new.ClientName,
          tels: newRec.new.tels,
        };
        recs.push(newRecPart);
      }      
    }

    // recs = await Promise.all(msgs.map(msg => {
    //   const rec = parseMsg(msg);
    //   return recsCollection.save(rec, {returnNew: true});
    // }));

    console.log('recs count: ' + recs.length);    
    fs.writeFileSync('./result_recs.json', JSON.stringify(recs, null, 2));
  } catch (err) {
    console.error(err)
  }
};

main();

