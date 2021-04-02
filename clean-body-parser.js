export function cleanBody(body) {
  let tmpstr = ' ' + body + ' ';  
  
  let regexList = [
    /[\.,\?:\\\/\(\)\+]|\n|\sс\s|\sв\s|\sдо\s|\sиз\s|\sи\s|\sили\s|\sпо\s|\w/gi,
    /\sищу\s|машин\S|\возьм\S*|пас+аж\S*|\d|\s(по|вы)ед(у|ет|ит|ем|им)|выез\S*|(у|по|за)ехать/gi,
    /\sс(ей|е|и|ий)час|\sч.?\s|сегод\S*|завтра|утр\S*|дн(е|ё)м|вечер(ом)?|дни|день/gi,
    /\sв?т(е|и)чен\S*|час\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*/gi,
    /\sкто\s|мож(е|и)т|ближ\S*|врем\S*|нужн\S*|увeз\S*|п(о|а)пут\S*|есть|мест\S*/gi,
    /\sод(но|ин)\S*|дв(а|ое)|тр(и|ое)|на\s+|номер\S*|\sтел\S*\s|\sзвонит.\s/gi,
    /декбр\S*|январ\S*|март\S*|апрел\S*|мая\s|июн\S*|июл\S*|август\S*|сентябр\S*|ноябрь\S*/gi,
    /\sЗдрав\S*\s|личк.|\sлс\s|реб(е|ё)н\S*|дет(и|ей)/gi,
  ];

  for (let regex of regexList) {    
    tmpstr = tmpstr.replace(regex, ' ');
    // tmpstr = tmpstr.replace(/(-|-)\s*$/g, '');
    // let dashRoute = body.match(/[А-Яа-я]+\s*-\s*[А-Яа-я]+/i);
  }
  return tmpstr.trim();
}

export function cleanBodyParser(msg) {
  let cleanedBody = cleanBody(msg.Body);
  let words = cleanBody.split(/\s+/);
  for (let word of words) {
  }
  return cleanedBody.trim();
}
