import config from 'config';
import Database from 'better-sqlite3';

const db = new Database(config.get('sqlite.dbpath'), {
  readonly: true,
  fileMustExist: true,
  // verbose: console.log,
});
// todo проверка на наличие группы (на случай удаления из группы)


export function getStartEventId(hours) {
  const now = Date.now();
  const startTimestamp = now - hours * 3600 * 1000;

  const sqlStmt = db.prepare(
    `SELECT EventID FROM Events 
    WHERE TimeStamp >= ?    
    ORDER BY eventId ASC
    LIMIT 1`
  );
  const res = sqlStmt.get(startTimestamp);
  return res.EventID;
}

export function fetchViberDb(chats, eventId, limit) {  
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
      AND length(Body) > 20 
      AND length(Body) < 200 ` + 
      `ORDER BY EventID ASC ` + 
      `LIMIT $limit`
  );
  return sqlStmt.all(chatTokens, { eventId, limit });
}