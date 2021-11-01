const db = require('../lib/arangodb.js');
const {aql} = require('arangojs');

class Subscription {

  static getSubs() {
    const subs = db
      .query(
        aql`
      FOR sub in Subs        
        RETURN sub`
      )
      .then((cursor) => cursor.all());
      
    return subs;
  }
}

module.exports = Subscription;