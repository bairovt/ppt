'use strict';

import points from './data/points.js';

function parseSpaceRoute(body) {
  let cleanedBody = body.replace(
    /\d|еду|ищу|машин\S*|возьм\S*|пас+аж\S*|п(о|а)пут\S*|есть|мест\S*|од(но|ин)|дв(а|ое)|тр(и|ое)|выез\S*|сегод\S*|завтра|утро.|день|дн(е|ё)м|вечер(ом)?|т(е|и)чен\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*|час\S*|на\s+|в\s+|[\.,\?:\\\/\(\)]|\w|\n|тел\S*/gi,
    ''
  );
  cleanedBody = cleanedBody.replace(/(-|-)\s*$/g, '');
  return cleanedBody.trim();
}

function parseDashRoute(body) {
  let dashRoute = body.match(/[А-Яа-я]+\s*-\s*[А-Яа-я]+/i);
  return dashRoute;
}

function parseDirection(direction, body) {
  let dirRegEx = '';
  switch (direction) {
    case 'from':
      dirRegEx = /\s+(с|из|от)\s+([А-Яа-я]+)/i;
      break;
    case 'to':
      dirRegEx = /\s+(в|до)\s+([А-Яа-я]+)/i;
      break;
  }

  let dirMatch = body.match(dirRegEx);
  if (dirMatch) {
    let token = dirMatch[2]; // берем вторую скобочную группу
    let point = points.find((point) => {
      return point.names.includes(token.toLocaleLowerCase());
    });
    return point ? point.name : null;
  }
  return null;
}

function parseTel(msg) {
  // todo tests
  let tels = [];
  const deleteSymbolsRegex = /[-\+\(\)\s]/g;
  let tmp = msg.replace(deleteSymbolsRegex, '');
  const onlyTelsRegex = /[78]\d{10}/g;
  tels = tmp.match(onlyTelsRegex);
  return tels === null ? null : tels.map((tel) => tel.replace(/^7/, 8));
}

function parseRole(msg) {
  // todo tests
  const driverRegex = /еду|в(о|а)зьм(у|ем|ём)|ищу\s+пас|ищу\s+попутчик/i;
  const passRegex = /ищу|ищем|пас+ажир|ед(е|и|у)т/i;
  // ищем сначала водителей из-за "ищу пас / попутчик"
  if (msg.match(driverRegex)) return 'D';
  if (msg.match(passRegex)) return 'P';

  if (msg.match(/есть(\s*\d*\s*)мест.*\?/i)) return 'P';
  if (msg.match(/есть(\s*\d*\s*)мест/i)) return 'D';
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

  if (msg.Body.match(/маршрут/i)) return null;

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
  if (rec === null) console.log('null rec: ', msg);
  return rec;
}
