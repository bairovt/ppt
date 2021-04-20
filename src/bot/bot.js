import {Telegraf} from 'telegraf';
import { routeParser } from '../clean-body-parser.js';
import { findRoute } from '../findRoute.js';

const botToken = '1641333989:AAG1Qj7QiVLG8TPmjMVF8tnVE0C_ZUScWqQ';

const bot = new Telegraf(botToken); //todo^ use process.env.BOT_TOKEN

const helpTxt = `- Этот бот создан для удобства поиска попутчиков.
- Для начала установите себя в качестве водителя или пассажира, отправив сообщение:
  для водителя:
      возьму
  для пассажира:
      ищу
Эту настройку можно изменить отправив соотв. сообщение.

Примеры:
- Показать объявления по направлению между 2 населенными пунктами:
    Чита Улан-Удэ
    Борзя Чита
- Показать объявления в оба направления:
    Чита & УУ`;

bot.start((ctx) => {
  // first time: updateType: my_chat_member;
  // console.log(JSON.stringify(ctx.update, null, 2));  
  console.log(ctx.update.message.from.id);  
  ctx.reply(helpTxt)
});

bot.use(async (ctx, next) => {
  //todo: set ctx.state.role
  console.time(`Processing update ${ctx.update.update_id}`);
  // console.log(JSON.stringify(ctx.update, null, 2));
  // await ctx.reply('message of updateType:\n' + ctx.updateType + '\nrecieved')
  await next();
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.help((ctx) => ctx.reply(helpTxt));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


bot.on('text', async (ctx, next) => {
  const msgText = ctx.update.message.text;
  const route = routeParser(msgText);
  if (route.length < 2) {    
    return ctx.reply(
      'По маршруту ' + JSON.stringify(route) + '\nничего не найдено.\nНеобходимо 2 нас. пункта'
    );
  }
  const recs = await findRoute('D', 2, route[0], route[1]);
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
