import config from 'config'

import Database from 'better-sqlite3';

const db = new Database(config.get('sqlite.dbpath'), {
  readonly: true,
  fileMustExist: true, 
  // verbose: console.log,
});

const groups = [
  { name: 'ПОПУТКА  80/75/03/38', Token: '5275694630505075174' },
  { name: 'Попутчики Забайкальский край', Token: '5225978192916092249' },
  { name: 'ПОПУТЧИКИ 03', Token: '5231316251132150843' },
  { name: 'Попутчики Регион -75', Token: '5546560442281758398' },
];

const chatTokens = '?,'.repeat(groups.length).slice(0, -1);

const sqlStmt = db.prepare(
  `SELECT ch.name as chName, m.EventID as evid, c.ClientName as name, e.TimeStamp as timestamp, 
    m.body as txt, m.Type as mtype, e.Type as etype FROM Messages as m 
    JOIN Events as e ON m.EventID = e.EventID 
    JOIN Contact as c ON e.ContactID = c.ContactID 
    JOIN ChatInfo as ch ON e.ChatID = ch.ChatID
    WHERE ch.Token IN (${chatTokens})
    AND m.Type NOT IN (9, 2, 69)
    AND m.body IS NOT null
    AND length(m.body) > 20
    AND length(m.body) < 200
    ORDER BY evid DESC
    LIMIT 20`
);

export default function fetchViberDb() {
  return sqlStmt.all(groups.map((el) => el.Token));   
}

// console.log(fetchViberDb())


