const {Markup } = require('telegraf');

const menuBtnKb = Markup.keyboard(['Меню']);

const setRoleKbi = Markup.inlineKeyboard(
  [
    Markup.button.callback('  Ищу машину  ', 'i_am_passenger'),
    Markup.button.callback('  Еду, возьму  ', 'i_am_driver'),
  ],
  { columns: 2 }
);

const menuItemsKbi = Markup.inlineKeyboard(
  [
    Markup.button.callback('Изменить роль', 'role'),
    Markup.button.callback('Удалить мои объявления', 'delete'),
    Markup.button.callback('Справка', 'help'),
    Markup.button.callback('Обратная связь', 'feedback'),
  ],
  { columns: 1 }
);

module.exports = { menuBtnKb, setRoleKbi, menuItemsKbi };
