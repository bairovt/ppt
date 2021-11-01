const db = require('./../lib/arangodb.js');
const {aql} = require('arangojs');

class ViberChat {

  static getChats() {
    const chats = db
      .query(
        aql`FOR chat in ViberChats 
        RETURN chat`
      )
      .then((cursor) => cursor.all());
      
    return chats;
  }
}

module.exports = ViberChat;