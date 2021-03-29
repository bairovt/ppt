'use strict';

import points from './data/points.js';

export function parseSpaceRoute(body) {
  let cleanedBody = body.replace(
    /\d|еду|ищу|машин\S*|возьм\S*|пас+аж\S*|п(о|а)пут\S*|есть|мест\S*|од(но|ин)|дв(а|ое)|тр(и|ое)|выез\S*|сегод\S*|завтра|утро.|день|дн(е|ё)м|вечер(ом)?|т(е|и)чен\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*|час\S*|на\s+|в\s+|[\.,\?:\\\/\(\)]|\w|\n|тел\S*/gi,
    ''
  );
  cleanedBody = cleanedBody.replace(/(-|-)\s*$/g, '');
  return cleanedBody.trim();
}

export function parseDashRoute(body) {
  let dashRoute = body.match(/[А-Яа-я]+\s*-\s*[А-Яа-я]+/i);
  return dashRoute;
}

export function parseDirection(direction, body) {
  let directionRegEx = '';
  switch (direction) {
    case 'from':
      directionRegEx = /\s+(с|из|от)\s+([А-Яа-я]+)/i;
      break;
    case 'to':
      directionRegEx = /\s+(в|до)\s+([А-Яа-я]+)/i;
      break;
  }

  let directionMatch = body.match(directionRegEx);
  console.log('directionMatch: ' + directionMatch);
  if (directionMatch) {
    let token = directionMatch[2]; // берем вторую скобочную группу
    let point = points.find((point) => {
      return point.names.includes(token.toLocaleLowerCase());
    });
    return point ? point.name : null;
  }
  return null;
}

export function parseTel(body) {
  // todo tests
  let tels = [];
  const deleteSymbolsRegex = /[-\+\(\)\s]/g;
  let tmp = body.replace(deleteSymbolsRegex, '');
  const onlyTelsRegex = /[78]\d{10}/g;
  tels = tmp.match(onlyTelsRegex);
  return tels === null ? null : tels.map((tel) => tel.replace(/^7/, 8));
}

export function parseRole(body) {
  // todo tests
  const driverRegex = /еду|в(о|а)зьм(у|ем|ём)|ищу\s+пас|ищу\s+попутчик/i;
  const passRegex = /ищу|ищем|пас+ажир|ед(е|и|у)т|нужн.+мест|нужн.+машин/i;
  // ищем сначала водителей из-за "ищу пас / попутчик"
  if (body.match(driverRegex)) return 'D';
  if (body.match(passRegex)) return 'P';

  if (body.match(/есть(\s*\d*\s*)мест.*\?/i)) return 'P';
  if (body.match(/есть(\s*\d*\s*)мест/i)) return 'D';
  return null;
}

export function parseMsg(msg) {
  let rec = {
    role: null,
    from: null,
    to: null,    
    tels: null,
    ...msg
  };
  rec.len = msg.Body.length;

  if (msg.Body.match(/маршрут/i)) rec.role = 'M';

  rec.role = parseRole(msg.Body);
  rec.tels = parseTel(msg.Body);

  rec.from = parseDirection('from', msg.Body);
  rec.to = parseDirection('to', msg.Body);

  // if(!(rec.from && rec.to)) {
  //   rec.dashRoute = parseDashRoute(msg.Body);
  // }

  if (!(rec.from && rec.to)) {
    rec.spaceRoute = parseSpaceRoute(msg.Body);
  }
  return rec;
}
