'use strict';
import fs from 'fs';

import points from './data/points.js';
import msgs from './data/msgs.js';

const recs = [];

for (let msg of msgs) {
  let rec = { txt: null, role: null, from: null, to: null, tels: null };
  rec.txt = msg.txt;
  rec.len = msg.txt.length;
  if (msg.txt.match(/маршрут/i)) {
    continue;
    // rec.role = 'M';
    // recs.push(rec);
  }

  rec.role = parseRole(msg.txt);
  rec.tels = parseTel(msg.txt);

  rec.from = parseDirection('from', msg.txt);
  rec.to = parseDirection('to', msg.txt);

  // if(!(rec.from && rec.to)) {
  //   rec.dashRoute = parseDashRoute(msg.txt);
  // }

  if (!(rec.from && rec.to)) {
    rec.spaceRoute = parseSpaceRoute(msg.txt);
  }

  recs.push(rec);
}

function parseSpaceRoute(txt) {
  let cleanedTxt = txt.replace(
    /\d|еду|ищу|машин\S*|возьм\S*|пас+аж\S*|п(о|а)пут\S*|есть|мест\S*|од(но|ин)|дв(а|ое)|тр(и|ое)|выез\S*|сегод\S*|завтра|утро.|день|дн(е|ё)м|вечер(ом)?|т(е|и)чен\S*|пр(и|е)мер\S*|где(\s*-*\s*)то|(о|а)р(ие|и|е)нт(и|е)р\S*|час\S*|на\s+|в\s+|[\.,\?:\\\/\(\)]|\w|\n|тел\S*/gi,
    ''
  );
  cleanedTxt = cleanedTxt.replace(/(-|-)\s*$/g, '');  
  return cleanedTxt.trim();
}

function parseDashRoute(txt) {
  let dashRoute = txt.match(/[А-Яа-я]+\s*-\s*[А-Яа-я]+/i);
  return dashRoute;
}

function parseDirection(direction, txt) {
  let dirRegEx = '';
  switch (direction) {
    case 'from':
      dirRegEx = /\s+(с|из|от)\s+([А-Яа-я]+)/i;
      break;
    case 'to':
      dirRegEx = /\s+(в|до)\s+([А-Яа-я]+)/i;
      break;
  }

  let dirMatch = txt.match(dirRegEx);
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

let recsJson = JSON.stringify(recs, null, 2);

fs.writeFileSync('./result_recs.json', recsJson);
