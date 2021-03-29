import { aql } from 'arangojs';
import db from './lib/arangodb.js';

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

  for (let rec of recs) {
    rec.datetime = new Date(rec.TimeStamp);
    delete rec.ChatToken;
    delete rec.ContactID;
    delete rec.MType;
    delete rec.EType;
    delete rec.TimeStamp;
    delete rec.EventID;
    delete rec.tels;
  }

  return recs;
}
