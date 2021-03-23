'use strict';
const fs = require('fs');

const points = require('./data/points.js');

const msgs = require('./data/msgs.js');

const recs = [];

for (let msg of msgs) {
  let rec = {txt: null, role: null, tels: null, from: null, to: null};
  rec.txt = msg.txt;
  if (msg.txt.match(/маршрут/i)) {
    rec.role = 'M';
    recs.push(rec);
    continue;  
  }

  rec.role = parseRole(msg.txt);
  rec.tels = parseTel(msg.txt);

  rec.from = parseDirection('from', msg.txt);
  rec.to = parseDirection('to', msg.txt);

  recs.push(rec);
}

function parseDirection(direction, msg) {
  let dirRegEx = '';
  switch (direction) {
    case 'from':
      dirRegEx = /(с|из|от)\s+[А-Яа-я]+/i;
      break;
    case 'to':
      dirRegEx = /(в|до)\s+[А-Яа-я]+/i;
      break;
  }

  let dirMatch = msg.match(dirRegEx);
  if (dirMatch) {
    let token = dirMatch[0].split(/\s+/)[1];
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
  const driverRegex = /еду|возьму|ищу\s+пас./i;
  const passRegex = /ищу|ищем|пас+ажир/i;
  // ищем сначала водителей из-за "ищу пас"
  if (msg.match(driverRegex)) return 'D';
  if (msg.match(passRegex)) return 'P';

  if (msg.match(/есть(\s*\d*\s*)мест.*\?/i)) return 'P';
  if (msg.match(/есть(\s*\d*\s*)мест/i)) return 'D';
  return null;
}

let recsJson = JSON.stringify(recs, null, 2);

fs.writeFileSync('./result_recs.json', recsJson);
