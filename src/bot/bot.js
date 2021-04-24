import {Telegraf} from 'telegraf';
import { routeParser } from '../parse/clean-body-parser.js';
import { findRoute } from '../findRoute.js';
import { setUser, getUser, setUserRole } from '../bot/user.js';
import config from 'config';

const bot = new Telegraf(config.get('bot.token'));

const helpTxt = `Данный бот создан для удобства поиска попутчиков.

- Для начала установите себя в качестве водителя или пассажира, отправив сообщение: 
  "еду" для водителей,
  "ищу" для пассажиров.
  Эту настройку можно изменить в любое время отправив соотв. сообщение.

Примеры:
- Поиск объявлений по направлению между 2 населенными пунктами:
    Чита Улан-Удэ
    Борзя Чита
- Поиск объявлений в оба направления:
    Чита & УУ
    & Забайкальск Чита

- При подаче объявлений (в группах) населенные пункты указывать последовательно движению:
  правильно - "Ищу машину с Читы до Улан-Удэ"
  неправильно - "Ищу машину до Улан-Удэ из Читы";
  правильно - "Возьму пассажиров из Забайкальска, Борзи до Читы"
  неправильно - "Возьму пассажиров из Забайкальска до Читы, попутно из Борзи";
  Обратный маршрут указываать в отдельном сообщении.

- При подаче объявления обязательно указывать номер телефона.
- Не вносить предоплату - мошенники.

/help - показать это сообщение`;

bot.catch((err, ctx) => {
  console.error(err);
  ctx.reply('ошибка');
});

bot.start(async (ctx) => {
  // first time: updateType: my_chat_member;
  console.log(JSON.stringify(ctx.update.message, null, 2));
  let userData = ctx.update.message.from;
  userData._key = String(ctx.update.message.from.id);
  userData.chat_id = ctx.update.message.chat.id;
  userData.startDate = ctx.update.message.date;

  const user =  await setUser(userData);

  console.log(ctx.update.message.from.id);
  ctx.reply(helpTxt)
});

bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  ctx.state.user = await getUser(String(ctx.update.message.from.id));
  await next();
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.help((ctx) => ctx.reply(helpTxt));

bot.on('text', async (ctx, next) => {  
  const msgText = ctx.update.message.text;
  if (msgText.match(/еду/i)) {
    await setUserRole(ctx.state.user._key, 'D');
    ctx.reply('Вы установлены в качестве водителя. Поиск будет показывать объявления пассажиров.');
    return next();
  }
  if (msgText.match(/ищу/i)) {
    await setUserRole(ctx.state.user._key, 'P');
    ctx.reply(
      'Вы установлены в качестве пассажира. Поиск будет показывать объявления водителей.'
    );
    return next();
  }
  const route = routeParser(msgText);
  if (route.length < 2) {    
    return ctx.reply(
      'По маршруту ' + JSON.stringify(route) + '\nничего не найдено.\nНеобходимо 2 нас. пункта'
    );
  }
  let direction = 1;
  if (msgText.match(/&/i)) {
    direction = 2;
  }
  const roleToFind = ctx.state.user.role === 'D' ? 'P' : 'D';
  const recs = await findRoute(roleToFind, direction, route[0], route[1]);
  let resp = '';
  for (let rec of recs) {
    resp = rec.Time + ': ' + rec.Body;
    await ctx.telegram.sendMessage(ctx.message.chat.id, resp); // ctx.reply();
  }
  return next();
});

// bot.on('message', async (ctx) => {
//   ctx.reply(`on message`);
// });

// bot.on('edited_message', ctx => ctx.reply('inside on edited_message\n' + ctx.update.edited_message.text));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
