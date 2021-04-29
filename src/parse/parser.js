'use strict';

const points = require('../../data/points.js');
const {cleanBody, routeParser} = require('./clean-body-parser.js');

function parseDirection(direction, body) {
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
  if (directionMatch) {
    let token = directionMatch[2]; // берем вторую скобочную группу
    let point = points.find((point) => {
      return point.names.includes(token.toLocaleLowerCase());
    });
    return point ? point.name : null;
  }
  return null;
}

function parseTel(body) {
  // todo tests
  let tels = [];
  const deleteSymbolsRegex = /[-\+\(\)\s]/g;
  let tmp = body.replace(deleteSymbolsRegex, '');
  const onlyTelsRegex = /[78]\d{10}/g;
  tels = tmp.match(onlyTelsRegex);
  return tels === null ? null : tels.map((tel) => tel.replace(/^7/, 8));
}

function cargoParser(body) {
  const cargoRegex = /груз/i;
  return cargoRegex.test(body);
}

function parseRole(body) {  
  const minibusRegex = /расписани/i;
  const driverRegex = /(по)?ед(у|ем|им)|в(о|а)зь?м(у|ем|ём)|ищу\s+пас|ищу\s+попутчик|выезжа(ю|ем)|выезд|нужен\s+пас+ажир/i;
  const passengerRegex = /(и|е)щ(у|ю)|ище(м|т)|пас+ажир|ед(е|и|у)т|нужн.|хочу\s(у|по|вы)?ехат|отправ(лю|ить|им)|пер(е|и)дам|чел/i;
  if (minibusRegex.test(body)) return 'M';
  if ((/уеду/i).test(body)) return 'P';
  if ((/надо\.*ув(е|и)(з|с)ти/i).test(body)) return 'P';
  // ищем сначала водителей из-за "ищу пас / попутчик"
  if (driverRegex.test(body)) return 'D';
  if (passengerRegex.test(body)) return 'P';
  // если роль не найдена
  if ((/есть(\s*\d*\s*)мест.*\?/i).test(body)) return 'P';
  if ((/есть(\s*\d*\s*)мест/i).test(body)) return 'D';
  return null;
}

function parseMsg(msg) {
  let rec = {
    role: null,
    from: null,
    to: null,
    tels: null,
    ...msg,
  };
  
  rec.role = parseRole(msg.Body);
  if (rec.role === 'M') return rec;
  rec.cargo = cargoParser(msg.Body);
  rec.tels = parseTel(msg.Body);

  rec.from = parseDirection('from', msg.Body);
  rec.to = parseDirection('to', msg.Body);

  rec.cleanedBody = cleanBody(msg.Body);
  rec.route = routeParser(msg.Body);  

  return rec;
}

module.exports = { parseDirection, parseTel, parseRole, parseMsg, cargoParser };
