const points = require('../../data/points.js');

//todo: сделать проверку городов на cleanBody
function checkPairedNames(str) {
  // todo: optimize this in the future
  let newStr = str;
  let pairedNamePoints = points.filter((point) => !!point.regex);
  for (let point of pairedNamePoints) {
    newStr = newStr.replace(point.regex, ' ' + point.names[0] + ' ')
  }
  return newStr;
};

function cleanBody(body) {
  let str = ' ' + body + ' ';

  str = str.replace(/‐|—/g, '-');

  let regexList = [
    /[\.,\?？:!\\\/\(\)\+"]|\w|\d|\n/gi,
    /здрав\S*|пр(и|е)ве(т|д)\S*|добр(ый|ое)|ч(е|и)л(о|а)век\S*|\sчел\s/gi,
    /\sищу\s|машин\S|\возь?м\S*|пас+аж\S*|меня|\s(по|вы)?ед(у|ет|ит|ем|им)|выез\S*|(у|по|за)ехать/gi,
    /могу|взять|(не)?больш(ой|ие|ые)|посылк\S*|сумк\S*|туда|(о|а)братно|чере(з|с)|дан+ый|момент\S*|срочно/gi,
    /\sс(ей|е|и|ий)час|сегод\S*|после|обед\S*|завтра|утр\S*|дн(е|ё)м|вечер(ом)?|дн(и|я)|день|\S*ночь\S*/gi,
    /\sв?т(е|и)чен\S*|час\S*|\sмин\s|минут\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*/gi,
    /\sкто\s|(кто)?\-?\s*нибудь|мож(е|и)т|ближ\S*|врем\S*|увeз\S*|в?пут(ь|и)|п(о|а)пут\S*|есть|мест\S*/gi,
    /\sод(но|ин)\S*|дв(а|ое)|тр(и|ое)|номер\S*|\sтел\S*\s|\sзвонит.\s|прям\S*/gi,
    /декбр\S*|январ\S*|март\S*|апрел\S*|мая\s|июн\S*|июл\S*|август\S*|сентябр\S*|ноябрь\S*/gi,
    /\sпн\s|\sвт\s|\sср\s|\sчт\s|\sпт\s|\sсб\s|\sвс\s|ч(и|е)сл\S*/gi,
    /п(о|а)н(е|и)д\S*|вторн\S*|сред\S*|ч(е|и)тв\S*|пятн\S*|суб+от\S|в(о|а)скр\S*/gi,
    /личк.|\sлс\s|реб(е|ё)н\S*|дет(и|ей)|цена|\S*плат\S*|\sруб\S*|писать|п(и|е)ш(и|ы)те/gi,
    /нужн\S*|жела\S*|н(е|и)обх\S*|остал\S*|сторон\S*|заран(е|и)|(от|раз)дельн\S*/gi,
    /в(а|о)тсап\S*|вайбер\S*|телеграм\S*|тел(\s|$)|первой|второй|п(о|а)л(о|а)вин\S*/gi,
    /п(о|а)жалуй?ста\S*|легк\S*|авто\S*|багаж\S*|груз\S*|водител\S*/gi,
    /можно|чуть|(по)?раньше/gi,
    /тойот\S*|нис+ан\S*|хонд\S*|комфорт\S*/gi,
    /\sили\s|\sдля\s|\sбез\s/gi,
  ];

  for (let regex of regexList) {
    str = str.replace(regex, ' ');
  }

  str = str.replace(/\s*\-\s*/gi, '-'); // тире, окруженное пробелами, на тире
  str = checkPairedNames(str);
  str = str.replace(/\-/gi, ' '); // все тире на пробелы, т.к. парные назв уже обработаны

  str = str.replace(/\s\S{1,2}\s/gi, ' '); // 1-2 буквы между пробелами
  str = str.trim();
  str = str.replace(/(^\S{1,2}\s)|(\s\S{1,2}$)/gi, ''); // одиночные буквы между пробелами или тире
  str = str.replace(/\s{2,}/g, ' ');

  return str.trim();
}

function routeParser(body) {
  const route = [];
  let cleanedBody = cleanBody(body);
  let words = cleanedBody.split(/\s|\-/);  
  for (let word of words) {
    // todo: parse point names with dashes and spaces (dash: true)
    let point = points.find((point, idx, points) => {
      if (point.names.includes(word.toLocaleLowerCase())) return true;
      return false;
    });
    if (point) route.push(point.name);
  }
  return route;
}

module.exports = { checkPairedNames, cleanBody, routeParser };