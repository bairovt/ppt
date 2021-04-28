const howToSearchTxt = `
Примеры поиска объявлений:

✅ По направлению:
  Чита Улан-Удэ
  Забайкальск Чита

✅ В оба направления:
  Чита & УУ
  & Збк Чита`;

const helpTxt = howToSearchTxt + `\n
❗️ При подаче объявлений (в группах) населенные пункты указывать последовательно движению:
  правильно - "Ищу машину с Читы до Улан-Удэ"
  неправильно - "Ищу машину до Улан-Удэ из Читы";
  правильно - "Возьму пассажиров из Забайкальска, Борзи до Читы"
  неправильно - "Возьму пассажиров из Забайкальска до Читы, попутно из Борзи";
  Обратный маршрут указываать в отдельном сообщении.

❗️ Обязательно указывать номер телефона.
   Внимательно смотрите на дату/время, уточняйте маршрут.

/help - показать это сообщение`;

const selectActionTxt = 'Выберите действие:';
const setRoleTxt = 'Укажите свою роль. Ищу машину - для пассажиров, \nЕду, возьму - для водителей';

module.exports = { helpTxt, selectActionTxt, setRoleTxt, howToSearchTxt };