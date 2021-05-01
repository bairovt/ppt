const db = require('../../lib/arangodb.js');
const { aql } = require('arangojs');
const {
  Telegraf,
  session,
  Markup,
  Scenes: { BaseScene, Stage },
} = require('telegraf');

const feedbackScene = new BaseScene('feedbackScene');

feedbackScene.enter((ctx) => {
  ctx.reply(
    'Отправьте сообщение с Вашим вопросом, предложением или замечанием, оно будет обработано администрацией бота'
  );
});
feedbackScene.on('text', async (ctx) => {
  if (ctx.message.text === 'меню' || ctx.message.text === 'справка') {
    return ctx.deleteMessage();
  }
  const collFbs = db.collection('Fbs');
  await collFbs.save({user_key: ctx.from.id, text: ctx.message.text, createdAt: new Date()});  
  ctx.reply('Благодарим за обращение!');
  return ctx.scene.leave();
});
feedbackScene.leave(ctx => {
  ctx.reply('feedbackScene.leave');
});

const feedbackStage = new Stage([feedbackScene]);

module.exports = feedbackStage;


