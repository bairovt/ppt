const db = require('../lib/arangodb.js');
const {aql} = require('arangojs');

class Rec {
  static getViberLastEventId() {
    const lastEventId = db
      .query(
        aql`
      FOR rec in Recs
        FILTER rec.EventID
        SORT rec.EventID DESC
        LIMIT 1
        RETURN rec.EventID
    `
      )
      .then((cursor) => cursor.next());

    return lastEventId;
  }
}

module.exports = Rec;