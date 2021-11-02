const config = require('config');
const Database = require('better-sqlite3');

const db = new Database(config.get('sqlite.dbpath'), {
  readonly: true,
  fileMustExist: true,
  // verbose: console.log,
});
// todo проверка на наличие группы (на случай удаления из группы)


function getStartEventId(hours) {
  const date = new Date();
  const todayMidnight = date.setHours(0, 0, 0, 0);
  const startTimestamp = todayMidnight - hours * 3600 * 1000;

  const sqlStmt = db.prepare(
    `SELECT EventID FROM Events 
    WHERE TimeStamp >= ?    
    ORDER BY eventId ASC
    LIMIT 1`
  );
  const res = sqlStmt.get(startTimestamp);
  return res.EventID;
}

function fetchViberDb(chats, eventId, limit) {  
  const chatTokensParams = '?,'.repeat(chats.length).slice(0, -1);
  const chatTokens = chats.map((el) => el.Token);
  const sqlStmt = db.prepare(
    `SELECT Messages.EventID as EventID, ChatInfo.Name as ChatName,  
      Contact.ClientName, Events.TimeStamp, Messages.Body,
      Messages.Type as MType, Events.Type as EType, 
      Contact.ContactID, ChatInfo.Token as ChatToken
      FROM Messages 
      JOIN Events ON Messages.EventID = Events.EventID 
      JOIN Contact ON Events.ContactID = Contact.ContactID 
      JOIN ChatInfo ON Events.ChatID = ChatInfo.ChatID 
      WHERE Events.EventID > $eventId 
      AND ChatInfo.Token IN (${chatTokensParams}) 
      AND MType NOT IN (9, 2, 69) 
      AND Body IS NOT null 
      AND Body NOT LIKE '%http%'
      AND length(Body) > 20 
      AND length(Body) < 200 ` +
      `ORDER BY EventID ASC ` +
      `LIMIT $limit`
  );
  return sqlStmt.all(chatTokens, { eventId, limit });
}

module.exports = { getStartEventId, fetchViberDb };
