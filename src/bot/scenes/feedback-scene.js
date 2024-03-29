const db = require('../../lib/arangodb.js');
const {
  Telegraf,
  Markup,
  Scenes: { BaseScene },
} = require('telegraf');


const cancelFeedbackKbi = Markup.inlineKeyboard(
  [Markup.button.callback('Отмена', 'cancel_feedback')],
  { columns: 1 }
);

const feedbackScene = new BaseScene('feedbackScene');

feedbackScene.enter((ctx) => {
  ctx.reply(
    'Отправьте сообщение с Вашим вопросом, предложением или замечанием, оно будет обработано администрацией бота',
    cancelFeedbackKbi
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

feedbackScene.leave(ctx => {});

feedbackScene.action('cancel_feedback', async (ctx) => {
  await Promise.all([ctx.deleteMessage(), await ctx.answerCbQuery()]);
  ctx.scene.leave();
});

module.exports = feedbackScene;


