const fillSubs = require('../utils/fill-subscriptions.js');
const { parseMsg } = require('../parse/parser.js');
const db = require('../lib/arangodb.js');
const axios = require('axios').default;
const config = require('config');

async function handleViberMsg(viberMsg, subs, stat) {
  // skip spam
  if (/выигр|продам|купл(ю|им)|сниму/i.test(viberMsg.Body)) {
    stat.spamMsgsCnt++;
    return 'SPAM';
  }

  const recData = await parseMsg(viberMsg);
  recData.src = 'viber';

  const collRecs = db.collection('Recs');
  const collUnroutedRecs = db.collection('UnroutedRecs');

  if (recData.route.length < 2) {
    stat.unroutedRecsCnt++;
    recData.ur = true;
    try {
      await collUnroutedRecs.save(recData);
    } catch (err) {
      // unique constraint violated
      if (err.code === 409 && err.errorNum === 1210) {
        // let existingRec = await collUnroutedRecs
        //   .byExample({ Body: recData.Body })
        //   .then((cursor) => cursor.next());
        // recData.dupl = existingRec.dupl ? existingRec.dupl + 1 : 1;
        // await collUnroutedRecs.update(existingRec._id, recData);
      } else {
        throw err;
      }
    }
  } else {    
    try {
      stat.newRecsCnt++;
      await collRecs.save(recData); //may throw unique constraint violated error (Body)
      stat.savedRecsCnt++;
      // nofify satisfying subscriptions
      const subsToNotify = fillSubs(recData, subs);
      stat.notifySubsCnt = stat.notifySubsCnt + subsToNotify.length;
      
      await Promise.all(
        subsToNotify.map((sub) => {                    
          axios.post(`${config.get('BOT_HTTP_URL')}/notify`, sub).catch((err) => {
            stat.axiosErrors[err.code] =
              err.code in stat.axiosErrors ? ++stat.axiosErrors[err.code] : 1;
            // throw err // // todo: who not catched in outer catch??
          });
        })
      );
    } catch (err) {
      // unique constraint violated
      if (err.code === 409 && err.errorNum === 1210) {
        stat.duplRecsCnt++;
        let existingRec = await collRecs
          .byExample({ Body: recData.Body })
          .then((cursor) => cursor.next());
        recData.dupl = existingRec.dupl ? existingRec.dupl + 1 : 1;
        await collRecs.update(existingRec._id, recData);
      } else {
        throw err;
      }
    }
  }

}

module.exports = handleViberMsg;