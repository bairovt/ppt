export function cleanBody(body) {
  let tmpstr = ' ' + body;
  let regex1 = /[\.,\?:\\\/\(\)]|\n|\sс\s|\sв\s|\sдо\s|\sиз\s|\sи\s|\sили\s|\sпо\s/gi;
  let regex2 = /\sищу\s|\sмашин\S*|\sвозьм\S*|\sпас+аж\S*|\d|\sед(у|ет|ит)|выез\S*/gi;
  let regex3 = /\sс(ей|е|и|ий)час|сегод\S*|завтра|утро.|дн(е|ё)м|вечер(ом)?|дни|день/gi;
  let regex4 = /\sв?т(е|и)чен\S*|час\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*/gi;
  let regex5 = /\sкто\s|мож(е|и)т|ближ\S*|нужн\S*|увeз\S*|п(о|а)пут\S*|есть|мест\S*/gi;
  let regex6 = /\sод(но|ин)|дв(а|ое)|тр(и|ое)|на\s+|\w|тел\S*/gi;
  let regexList = [regex1, regex2, regex3, regex4, regex5, regex6];

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
