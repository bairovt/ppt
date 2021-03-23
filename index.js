const {Telegraf} = require('telegraf');
const arangojs = require('arangojs');

const botToken = '1641333989:AAG1Qj7QiVLG8TPmjMVF8tnVE0C_ZUScWqQ';

const bot = new Telegraf(botToken);

bot.use(async (ctx, next) => {
  await ctx.reply('message of updateType:\n' + ctx.updateType + '\nrecieved')
  return next();
})

bot.on('message', ctx => ctx.reply('inside on message:\nСообщение update получено'));
bot.on('edited_message', ctx => ctx.reply('inside on edited_message\n' + ctx.update.edited_message.text));      

bot.launch()
