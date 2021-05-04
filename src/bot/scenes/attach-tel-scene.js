const db = require('../../lib/arangodb.js');
const { aql } = require('arangojs');
const {
  Telegraf,
  session,
  Markup,
  Scenes: { BaseScene },
} = require('telegraf');

const cancelAttachTelKbi = Markup.inlineKeyboard(
  [Markup.button.callback('Отмена', 'cancel_attach_tel')],
  { columns: 1 }
);

const attachTelScene = new BaseScene('attachTelScene');

attachTelScene.enter(async (ctx) => {
  const user = ctx.state.user;
  if (user.tel1 && user.tel2) {
    ctx.reply(`К учетной записи можно привязать не более 2 телефонов, к Вашей уже привязано 2: ${user.tel1}, ${user.tel2}`);
    return ctx.scene.leave();
  }
  await ctx.deleteMessage();
  ctx.reply(
    'Отправьте номер Вашего телефона в формате 89241234567, чтобы привязать его к себе. Можно привязать не более 2-х номеров',
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

  ctx.reply(`Телефон ${telNum} успешно привязан к Вашей учетной записи`);
  return ctx.scene.leave();
});

attachTelScene.leave(ctx => {});

attachTelScene.action('cancel_attach_tel', async ctx => {
  await Promise.all([ctx.deleteMessage(), await ctx.answerCbQuery()]);
  ctx.scene.leave();
});

module.exports = attachTelScene;


