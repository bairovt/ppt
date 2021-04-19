import {Telegraf} from 'telegraf';
import { routeParser } from './clean-body-parser.js';
import { findRoute } from './findRoute.js';

const botToken = '1641333989:AAG1Qj7QiVLG8TPmjMVF8tnVE0C_ZUScWqQ';

const bot = new Telegraf(botToken);

const helpTxt = `Для начала установите себя в качестве водителя либо пассажира.
Эту настройку можно изменить командами -
Для водителя:
    еду
Для пассажира:
    ищу

Показать объявления по направлению:
    Чита Улан-Удэ
    Борзя Чита
Показать объявления в оба направления:
    2 Чита Забайкальск`;

bot.start((ctx) => {
  // first time: updateType: my_chat_member;
  console.log(JSON.stringify(ctx, null, 2));  
  ctx.reply(helpTxt)
});

bot.use(async (ctx, next) => {
  console.log(JSON.stringify(ctx, null, 2));
  // await ctx.reply('message of updateType:\n' + ctx.updateType + '\nrecieved')
  return next();
})

bot.help((ctx) => ctx.reply(helpTxt));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.on('message', async (ctx, next) => {
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
    await ctx.reply(resp);
  }
  
});
// bot.on('edited_message', ctx => ctx.reply('inside on edited_message\n' + ctx.update.edited_message.text));      

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
