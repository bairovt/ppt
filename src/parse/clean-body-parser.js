const { aql } = require('arangojs');
const db = require('../lib/arangodb.js');

//todo: сделать проверку городов на cleanBody
async function checkRegexPoints(body) {
  // todo: optimize this
  let newBody = body;  
  let regexPoints = await db.query(aql`
  FOR point IN Points
  FILTER TO_BOOL(point.regex)
  RETURN point
  `).then(cursor => cursor.all());
  for (let point of regexPoints) {
    newBody = newBody.replace(new RegExp(point.regex, 'g'), ' ' + point.names[0] + ' ');
  }
  return newBody;
}

async function cleanBody(body) {
  let str = ' ' + body.toLocaleLowerCase() + ' ';

  str = str.replace(/‐|—/g, '-');

  let regexList = [
    /[\.,\?？:!\\\/\(\)\+&_"]|\w|\d|\n/g,
    /здрав\S*|пр(и|е)ве(т|д)\S*|добр(ый|ое)|ч(е|и)л(о|а)век\S*|\sчел\s/g,
    /\sищу\s|машин\S|\возь?м\S*|пас+аж\S*|меня|\s(по|вы)?ед(у|ет|ит|ем|им)|выез\S*|(у|по|за)ехать/g,
    /могу|взять|(не)?больш(ой|ие|ые)|посылк\S*|сумк\S*|туда|(о|а)братно|чере(з|с)|дан+ый|момент\S*|срочно/g,
    /\sс(ей|е|и|ий)час|сегод\S*|после|обед\S*|завтра|утр\S*|дн(е|ё)м|вечер(ом)?|дн(и|я)|день|\S*ночь\S*/g,
    /\sв?т(е|и)чен\S*|час\S*|\sмин\s|минут\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*/g,
    /\sкто\s|(кто)?\-?\s*нибудь|мож(е|и)т|ближ\S*|врем\S*|увeз\S*|в?пут(ь|и)|п(о|а)пут\S*|есть|мест\S*/g,
    /\sод(но|ин)\S*|дв(а|ое)|тр(и|ое)|номер\S*|\sтел\S*\s|\sзвонит.\s|прям\S*/g,
    /декбр\S*|январ\S*|март\S*|апрел\S*|мая\s|июн\S*|июл\S*|август\S*|сентябр\S*|ноябрь\S*/g,
    /\sпн\s|\sвт\s|\sср\s|\sчт\s|\sпт\s|\sсб\s|\sвс\s|ч(и|е)сл\S*/g,
    /п(о|а)н(е|и)д\S*|вторн\S*|сред\S*|ч(е|и)тв\S*|пятн\S*|суб+от\S|в(о|а)скр\S*/g,
    /личк.|\sлс\s|реб(е|ё)н\S*|дет(и|ей)|цена|\S*плат\S*|\sруб\S*|писать|п(и|е)ш(и|ы)те/g,
    /нужн\S*|жела\S*|н(е|и)обх\S*|остал\S*|сторон\S*|заран(е|и)|(от|раз)дельн\S*/g,
    /в(а|о)тсап\S*|вайбер\S*|телеграм\S*|тел(\s|$)|первой|второй|п(о|а)л(о|а)вин\S*/g,
    /п(о|а)жалуй?ста\S*|легк\S*|авто\S*|багаж\S*|груз\S*|водител\S*/g,
    /можно|чуть|(по)?раньше/g,
    /тойот\S*|нис+ан\S*|хонд\S*|комфорт\S*/g,
    /\sили\s|\sдля\s|\sбез\s/g,
  ];

  for (let regex of regexList) {
    str = str.replace(regex, ' ');
  }

  // str = str.replace(/\s{2,}/g, ' ');
  str = str.replace(/\s*\-\s*/g, '-'); // убираем пробелы рядом с тире
  str = await checkRegexPoints(str);
  str = str.replace(/\-/g, ' '); // все тире на пробелы, т.к. парные назв уже обработаны

  str = str.replace(/\s\S{1,2}\s/g, ' '); // 1-2 буквы между пробелами
  str = str.trim();
  str = str.replace(/(^\S{1,2}\s)|(\s\S{1,2}$)/g, ''); // одиночные буквы между пробелами или тире
  str = str.replace(/\s{2,}/g, ' ');

  return str.trim();
}

module.exports = { checkRegexPoints, cleanBody };
