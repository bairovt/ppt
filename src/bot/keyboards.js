const {Markup } = require('telegraf');

const menuBtnKb = Markup.keyboard(['меню', 'справка'], { columns: 2 });

const setRoleKbi = Markup.inlineKeyboard(
  [
    Markup.button.callback('  Ищу машину  ', 'i_am_passenger'),
    Markup.button.callback('  Еду, возьму  ', 'i_am_driver'),
  ],
  { columns: 2 }
);

const menuItemsKbi = Markup.inlineKeyboard(
  [
    Markup.button.callback('Изменить роль', 'change_role'),
    Markup.button.callback('Удалить мои объявления', 'delete_ads'),
    Markup.button.callback('Привязать телефон', 'attach_tel'),
    Markup.button.callback('Обратная связь', 'feedback'),
  ],
  { columns: 1 }
);

module.exports = { menuBtnKb, setRoleKbi, menuItemsKbi };
