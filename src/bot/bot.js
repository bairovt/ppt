const { Telegraf, session, Markup, Scenes: {Stage} } = require('telegraf');
const { routeParser } = require('../parse/parser.js');
const { findRoute } = require('../findRoute.js');
const { setUser, getUser, setUserRole, logToDb } = require('../bot/user.js');
const { errorLog } = require('../lib/error-log.js');
const { writeFileSync } = require('fs');
const config = require('config');
const path = require('path');
const { getStats } = require('./funcs/get-stats.js');
const { helpTxt, setRoleTxt, howToSearchTxt, menuItemsTxt } = require('./texts.js');
const { menuBtnKb, setRoleKbi, menuItemsKbi } = require('./keyboards.js');
const feedbackScene = require('./scenes/feedback-scene.js');
const attachTelScene = require('./scenes/attach-tel-scene.js');
const deleteAdsStage = require('./scenes/delete-ads-scene.js');
const fastify = require('fastify')({logger: true});

////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////

const bot = new Telegraf(config.get('bot.token'));
bot.use(session());

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
  ctx.state.startTime = Date.now();
  ctx.state.user = await getUser(ctx);
  await next();
  if (process.env.NODE_ENV === 'development') {
    console.log('duration: ', Date.now() - ctx.state.startTime);
  }
});

const stage = new Stage([feedbackScene, attachTelScene, deleteAdsStage]);
bot.use(stage.middleware());

bot.command('menu', async (ctx) => { 
  ctx.reply(menuItemsTxt, menuItemsKbi.resize());
});
bot.help((ctx) => ctx.reply(helpTxt));

bot.command('st', async (ctx) => {
  if (ctx.state.user.approle !== 'admin') {
    return ctx.reply('forbidden');
  } else {
    const stats = await getStats(ctx);
    return ctx.reply(JSON.stringify(stats, null, 2));
  }
});


bot.on('text', async (ctx, next) => {  
  const text = ctx.update.message.text;  
  if (text.match(/err/i)) {
    throw new Error('test_bot_error');
  }
  if (text.match(/меню|menu/i)) {
    return ctx.reply(menuItemsTxt, menuItemsKbi.resize());
  }
  if (text.match(/справка|help/i)) {
    return ctx.reply(helpTxt);
  }
  if (!ctx.state.user.role) {
    return ctx.reply(setRoleTxt, setRoleKbi);
  }
  await next();
});

bot.on('text', async (ctx, next) => {
  const user = ctx.state.user;
  const text = ctx.update.message.text;

  const route = await routeParser(text);
  if (route.length < 2) {
    ctx.reply(
      'По маршруту ' + JSON.stringify(route) + '\nничего не найдено.\nНеобходимо 2 нас. пункта'
    );
  } else {
    let direction = 1;    
    if (/&/i.test(text)) {
      direction = 2;
    }
    let cargo = false;
    if (/груз/i.test(text)) {
      cargo = true;
    }
    const roleToFind = user.role === 'D' ? 'P' : 'D';
    const recs = await findRoute(roleToFind, direction, route, cargo);
    let resp = '';
    if (recs.length === 0) {
      ctx.reply('не найдено')
    } else {
      for (let rec of recs) {
        resp = rec.Time + ' | ' + rec.Body;
        if (user.approle === 'admin') resp = `(${rec.src}: ${rec.ChatName})\n` + resp;
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
  await ctx.reply('Вы - пассажир, поиск будет показывать объявления водителей');
  ctx.reply(howToSearchTxt);
});

bot.action('i_am_driver', async (ctx) => {
  await ctx.answerCbQuery();
  await setUserRole(ctx.state.user._key, 'D');
  await ctx.reply('Вы - водитель, поиск будет показывать объявления пассажиров');
  ctx.reply(howToSearchTxt);
});

bot.action('change_role', async (ctx) => {
  await ctx.answerCbQuery();  
  ctx.reply(setRoleTxt, setRoleKbi.resize());
});

bot.action('attach_tel', async (ctx) => {
  await ctx.answerCbQuery();  
  ctx.scene.enter('attachTelScene');
});

bot.action('delete_ads', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.enter('deleteAdsScene');
});

bot.action('feedback', async (ctx) => {
  await ctx.answerCbQuery();
  ctx.scene.enter('feedbackScene');
});

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// Fastify 
fastify.get('/', async (req, reply) => {
  // await bot.telegram.sendMessage(429613736, req.body);
  console.log(typeof(req.body));
  return { hello: 'world' };
});

fastify.post('/notify', async (req, reply) => {
  await bot.telegram.sendMessage(req.body.chat_id, req.body.Body);
  return { status: 'OK' };
});

// run the fastify server!
const runFastify = async () => {
  try {
    await fastify.listen(3030)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
runFastify();