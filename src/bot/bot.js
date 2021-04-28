const { Telegraf, Markup } = require('telegraf');
const { routeParser } = require('../parse/clean-body-parser.js');
const { findRoute } = require('../findRoute.js');
const { setUser, getUser, setUserRole, logToDb } = require('../bot/user.js');
const { errorLog } = require('../lib/error-log.js');
const { writeFileSync } = require('fs');
const config = require('config');
const path = require('path');
const { getStats } = require('./funcs/get-stats.js');

const bot = new Telegraf(config.get('bot.token'));

const helpTxt = `
Примеры поиска объявлений:

✅ Найти по направлению:
  Чита Улан-Удэ
  Забайкальск Чита

✅ Найти в оба направления:
  Чита & УУ
  & Збк Чита

❗️ При подаче объявлений (в группах) населенные пункты указывать последовательно движению:
  правильно - "Ищу машину с Читы до Улан-Удэ"
  неправильно - "Ищу машину до Улан-Удэ из Читы";
  правильно - "Возьму пассажиров из Забайкальска, Борзи до Читы"
  неправильно - "Возьму пассажиров из Забайкальска до Читы, попутно из Борзи";
  Обратный маршрут указываать в отдельном сообщении.

❗️ Обязательно указывать номер телефона.
   Внимательно смотрите на дату/время, уточняйте маршрут.

/help - показать это сообщение`;

const setRoleMarkup = Markup.keyboard([['Ищу машину', 'Еду/Везу']])
  .oneTime()
  .resize();

bot.catch((error, ctx) => {
  ctx.reply('ошибка');
  writeFileSync(
    path.join(config.get('root'), 'log', Date.now() + '-bot.error'),
    errorLog(error, {update: ctx.update, state: ctx.state, botInfo: ctx.botInfo})
  );
  throw(error);
});

bot.start(async (ctx) => {
  // first time: updateType: my_chat_member;
  let userData = ctx.update.message.from;
  userData._key = String(ctx.update.message.from.id);
  userData.chat_id = ctx.update.message.chat.id;
  userData.startDate = ctx.update.message.date;
  await setUser(userData);

  // ctx.reply(helpTxt)
  ctx.reply(
    helpTxt,
    setRoleMarkup
  );
});

// set user mw
bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  ctx.state.user = await getUser(String(ctx.update.message.from.id));
  await next();
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.command('st', async (ctx) => {
  if (ctx.state.user.approle !== 'admin') {
    return ctx.reply('forbidden');
  } else {
    const stats = await getStats(ctx);
    return ctx.reply(JSON.stringify(stats, null, 2));
  }
});

bot.help((ctx) => ctx.reply(helpTxt));

bot.on('text', async (ctx, next) => {
  const user = ctx.state.user;
  const msgText = ctx.update.message.text;
  if (msgText.match(/err/i)) {
    throw(new Error('test_bot_error'));
  }  
  if (msgText.match(/еду/i)) {
    await setUserRole(user._key, 'D');    
    return ctx.reply(
      'Вы - водитель, поиск будет показывать объявления пассажиров.'
    );
  } else if (msgText.match(/ищу/i)) {
    await setUserRole(user._key, 'P');    
    return ctx.reply('Вы - пассажир, поиск будет показывать объявления водителей.');
  } else if (!user.role) {
    return ctx.reply(
      'Укажите свою роль: \n"Ищу машину" - для пассажиров, \n"Еду" - для водителей',
      setRoleMarkup
    );
  }

  const route = routeParser(msgText);
  if (route.length < 2) {
    ctx.reply(
      'По маршруту ' + JSON.stringify(route) + '\nничего не найдено.\nНеобходимо 2 нас. пункта'
    );
  } else {
    let direction = 1;
    if (msgText.match(/&/i)) {
      direction = 2;
    }
    const roleToFind = user.role === 'D' ? 'P' : 'D';
    const recs = await findRoute(roleToFind, direction, route[0], route[1]);
    let resp = '';
    if (recs.length === 0) {
      ctx.reply('не найдено')
    } else {
      for (let rec of recs) {
        resp = rec.Time + ' | ' + rec.Body;
        if (user.approle === 'admin') resp = `${rec.src}: ${rec.ChatName}\n` + resp;
        await ctx.telegram.sendMessage(ctx.message.chat.id, resp); // ctx.reply();
      }
    }
  }

  const logData = {
    user: {
      _key: user._key,
      name: user.first_name,
      username: user.username,
      approle: user.approle
    },
    ts: Date.now(),
    time: new Date(),
    msgText: msgText,
    route
  };  
  await logToDb(logData);
  
  return next();
});

// bot.on('message', async (ctx) => {
//   ctx.reply(`on message`);
// });

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
