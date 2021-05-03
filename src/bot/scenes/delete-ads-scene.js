const db = require('../../lib/arangodb.js');
const { aql } = require('arangojs');
const {
  Telegraf,
  session,
  Markup,
  Scenes: { BaseScene, Stage },
} = require('telegraf');

const removeKbMarkup = Markup.removeKeyboard();

const cancelOrDeleteAdsKbi = Markup.inlineKeyboard(
  [
    Markup.button.callback('Да', 'confirm_delete_ads'),
    Markup.button.callback('Отмена', 'cancel_delete_ads'),
  ],
  { columns: 1 }
);

const deleteAdsScene = new BaseScene('deleteAdsScene');

deleteAdsScene.enter(async (ctx) => {
  // await ctx.deleteMessage();
  const user = ctx.state.user;
  if (!(user.tel1 && user.tel1)) {
    ctx.reply('Для удаления объявлений необходимо привязать номер Вашего телефона');
    return ctx.scene.leave();
  };
  ctx.reply(
    `Подтверждаете удаление всех объявлений, содержащих номера телефонов: 
      ${user.tel1}${user.tel2 ? ', '+user.tel2 : ''}?`,
    cancelOrDeleteAdsKbi.resize()
  );
});

deleteAdsScene.leave((ctx) => {});

deleteAdsScene.action('confirm_delete_ads', async (ctx) => {
  const user = ctx.state.user;
  await Promise.all([ctx.answerCbQuery(), ctx.deleteMessage()]);
  const userTels = [user.tel1, user.tel2];
  await db
    .query(
      aql`
    FOR rec IN Recs
    FILTER LENGH(INTERSECTION(rec.tels, ${userTels})) != 0    
    REMOVE rec IN Recs`
    );
  ctx.reply('Ваши объявления успешно удалены');
  ctx.scene.leave();
});

deleteAdsScene.action('cancel_delete_ads', async (ctx) => {
  await Promise.all([ctx.answerCbQuery(), ctx.deleteMessage()]);
  ctx.scene.leave();
});

const deleteAdsStage = new Stage([deleteAdsScene]);

module.exports = deleteAdsStage;
