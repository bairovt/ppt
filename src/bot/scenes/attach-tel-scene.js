const db = require('../../lib/arangodb.js');
const { aql } = require('arangojs');
const {
  Telegraf,
  session,
  Markup,
  Scenes: { BaseScene, Stage },
} = require('telegraf');

const removeKbMarkup = Markup.removeKeyboard();

const cancelAttachTelKbi = Markup.inlineKeyboard(
  [Markup.button.callback('Отмена', 'cancel_attach_tel')],
  { columns: 1 }
);

const attachTelScene = new BaseScene('attachTelScene');

attachTelScene.enter(async (ctx) => {
  await ctx.deleteMessage();
  ctx.reply(
    'Отправьте номер Вашего телефона в формате 89241234567, чтобы привязать его к себе. Возможно привязать 2 номера',
    cancelAttachTelKbi.resize()
  );
});

attachTelScene.on('text', async (ctx) => {
  if (ctx.message.text === 'меню' || ctx.message.text === 'справка') {
    return ctx.deleteMessage();
  }
  const user = ctx.state.user;
  const telTxt = ctx.message.text;
  let telNum = telTxt.replace(/\D/g, '');
  if (!(/^8\d{10}$/).test(telNum)) {
    return ctx.reply('Неверный формат');
  }

  const userWithTheTel = await db.query(aql`
    FOR user IN Users
    FILTER user.tel1 == ${telNum} OR user.tel2 == ${telNum}
    RETURN user`).then(cursor => cursor.next());
  if (userWithTheTel) {
    return ctx.reply('Указанный номер уже привязан');
  }
  let upd = {};
  if (user.tel1) upd.tel2 = String(telNum);
  else upd.tel1 = String(telNum);
  await db.collection('Users').update(ctx.state.user._key, upd)

  ctx.reply(`Телефон ${telNum} привязан`);
  return ctx.scene.leave();
});

attachTelScene.leave(ctx => {});

attachTelScene.action('cancel_attach_tel', async ctx => {
  await Promise.all([ctx.deleteMessage(), await ctx.answerCbQuery()]);
  ctx.scene.leave();
});

const attachTelStage = new Stage([attachTelScene]);

module.exports = attachTelStage;


