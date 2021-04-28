const db = require('../../lib/arangodb');
const {aql} = require('arangojs');

async function getStats(ctx) {
  const minTime = Date.now() - 2 * 24 * 3600 * 1000; // days
  const lastRec = await db
    .query(
      aql`FOR rec IN Recs 
    SORT rec.TimeStamp DESC
    LIMIT 1 
    RETURN {time: DATE_FORMAT(rec.TimeStamp+32400000, "%dd.%mm.%yy %hh:%ii:%ss"),
      src: rec.src, ChatName: rec.ChatName, Body: rec.Body, role: rec.role, ClientName: rec.ClientName, cargo: rec.cargo,
      cleanedBody: rec.cleanedBody, route: rec.route, tels: rec.tels
    }`
    )
    .then((cursor) => cursor.next());

  const usersCnt = await db.query(aql`RETURN LENGTH(Users)`).then((cursor) => cursor.next());
  const recsCnt = await db.query(aql`RETURN LENGTH(Recs)`).then((cursor) => cursor.next());
  const logsCnt = await db.query(aql`RETURN LENGTH(Logs)`).then((cursor) => cursor.next());

  const recsCnt2 = await db
    .query(
      aql`FOR rec IN Recs 
      FILTER rec.TimeStamp > ${minTime}
      COLLECT WITH COUNT INTO len
      RETURN len    
    `
    )
    .then((cursor) => cursor.next());
  
  return { recsCnt2, recsCnt, usersCnt, lastRec, logsCnt };
}

module.exports = {getStats};