const { Telegraf, Markup } = require('telegraf');
const { routeParser } = require('../parse/clean-body-parser.js');
const { findRoute } = require('../findRoute.js');
const { setUser, getUser, setUserRole, logToDb } = require('../bot/user.js');
const { errorLog } = require('../lib/error-log.js');
const { writeFileSync } = require('fs');
const config = require('config');
const path = require('path');
const { getStats } = require('./funcs/get-stats.js');
const { helpTxt, setRoleTxt, howToSearchTxt } = require('./texts.js');
const { menuBtnKb, setRoleKbi, menuItemsKbi } = require('./keyboards.js');

const bot = new Telegraf(config.get('bot.token'));

const menuItemsTxt = 'выберите действие';

bot.catch((error, ctx) => {
  ctx.reply('ошибка!');
  writeFileSync(
    path.join(config.get('root'), 'log', Date.now() + '-bot.error'),
    errorLog(error, {update: ctx.update, state: ctx.state, botInfo: ctx.botInfo}, ctx)
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
  ctx.reply('меню', menuBtnKb.resize());
  ctx.reply(setRoleTxt, setRoleKbi.resize());
});

// set user mw
bot.use(async (ctx, next) => {
  // console.time(`Processing update ${ctx.update.update_id}`);
  ctx.state.user = await getUser(ctx);
  await next();
  // console.timeEnd(`Processing update ${ctx.update.update_id}`);
  // if (process.env.NODE_ENV === 'development') console.log('ctx: ', ctx);
})

bot.command('menu', async (ctx) => { 
  ctx.reply(menuItemsTxt, menuItemsKbi.resize());
});

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
  const text = ctx.update.message.text;  
  if (text.match(/err/i)) {
    throw new Error('test_bot_error');
  }
  if (text.match(/меню|menu/i)) {
    return ctx.reply(menuItemsTxt, menuItemsKbi.resize());
  }
  if (!ctx.state.user.role) {
    return ctx.reply(setRoleTxt, setRoleKbi);
  }
  await next();
});

bot.on('text', async (ctx, next) => {
  const user = ctx.state.user;
  const text = ctx.update.message.text;

  const route = routeParser(text);
  if (route.length < 2) {
    ctx.reply(
      'По маршруту ' + JSON.stringify(route) + '\nничего не найдено.\nНеобходимо 2 нас. пункта'
    );
  } else {
    let direction = 1;
    if (text.match(/&/i)) {
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
    text: text,
    route    
  };  
  await logToDb(logData);
  
  return next();
});

bot.action('i_am_passenger', async (ctx) => {
  await ctx.answerCbQuery();
  await setUserRole(ctx.state.user._key, 'P');
  ctx.reply('Вы - пассажир, поиск будет показывать объявления водителей');
  ctx.reply(howToSearchTxt);
});

bot.action('i_am_driver', async (ctx, next) => {
  await ctx.answerCbQuery();
  await setUserRole(ctx.state.user._key, 'D');
  ctx.reply('Вы - водитель, поиск будет показывать объявления пассажиров');
  ctx.reply(howToSearchTxt);
});

bot.action('role', async (ctx, next) => {
  await ctx.answerCbQuery();  
  ctx.reply(setRoleTxt, setRoleKbi.resize());
});

bot.action('help', async (ctx, next) => {
  await ctx.answerCbQuery();  
  ctx.reply(helpTxt);
});

// bot.on('message', async (ctx) => {
//   ctx.reply(`on message`);
// });

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
