const db = require('./lib/arangodb.js');
const {errorLog} = require('./lib/error-log.js');
const config = require('config');
const { fetchViberDb, getStartEventId } = require('./viber/fetchdb.js');
const { writeFileSync } = require('fs');
const path = require('path');
const axios = require('axios').default;
const ViberChat = require('./classes/viber-chat.js')
const Subscription = require('./classes/subscription.js');
const Rec = require('./classes/record.js');
const handleViberMsg = require('./utils/handle-viber-msg.js')

const root = config.get('root');

async function fetchParseLoad() {
  let startTime = Date.now();  
  
  const stat = {
    viberMsgsCnt: 0,
    spamMsgsCnt: 0,
    unroutedRecsCnt: 0,
    newRecsCnt: 0,
    savedRecsCnt: 0,
    duplRecsCnt: 0,
    notifySubsCnt: 0,
    axiosErrors: {
      ENOTFOUND: 0,
    },
    handleViberMsgErrors: {
      ERR1200: 0,
    },
  };  

  const [
    chats,
    subs  // todo: refactor - problem if many subs
  ] = await Promise.all([
    ViberChat.getChats(),
    Subscription.getSubs()
  ]);  

  try {
    let viberLastEventId = await Rec.getViberLastEventId();
    
    if (!viberLastEventId) {
      viberLastEventId = getStartEventId(24 * 3);
    }

    const viberMsgs = fetchViberDb(chats, viberLastEventId, 10000); // sync from SQLite
    stat.viberMsgsCnt = viberMsgs.length;

    // for (let viberMsgData of viberMsgs) {
    //   await handleViberMsg(viberMsgData, subs, stat);
    // }

    await Promise.all(viberMsgs.map((viberMsg) => {
      return handleViberMsg(viberMsg, subs, stat).then(res => 'OK').catch(err => {        
        if (err.code === 409 && err.errorNum === 1200) {
          stat.handleViberMsgErrors.ERR1200++; 
        } else {
          throw err;
        }
      });
    }));    

  } catch (error) {
    writeFileSync(
      path.join(root, config.get('LOGS_DIR'), Date.now() + '-viber-fetch.error'),
      errorLog(error, { stat })
    );    
    console.error('ERROR!', error);
    // throw error;
  }

  if (stat.axiosErrors.ENOTFOUND || stat.handleViberMsgErrors.ERR1200) {    
    axios.post(`${config.get('BOT_HTTP_URL')}/alert/admin`, stat).catch((err) => {
      console.error(err);
      throw err;
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('stat: ', stat);
    console.log(Date.now() - startTime + ' мс\n-----');
  }
}

function delaySec(sec) {
  return new Promise((resolve) => {
    setTimeout(resolve, sec * 1000)
  })
}

async function main() {  
  while (true) {
    await fetchParseLoad();
    await delaySec(10);
  }
}

main();

// Enable graceful stop
function gracefulStop(msg) {
  console.log(msg);
  db.close();
  process.exit();
}
process.once('SIGINT', () => gracefulStop('\nSIGINT'));
process.once('\nSIGTERM', () => gracefulStop('\nSIGTERM'));
