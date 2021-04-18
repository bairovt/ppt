import { parseMsg, parseRole, parseTel, parseDirection, parseSpaceRoute } from '../parser.js';

const body =
  // '29.03. в районе 8-9 утра нужно одно место с Читы до Краснокаменска. Звонить на 89148026706 Срочно!';
  '29.03  в районе 8-9 утра нужно одно место с Читы до Краснокаменска';

  let rec = {};
  rec.role = parseRole(body); 

  rec.from = parseDirection('from', body);
  rec.to = parseDirection('to', body);
  rec.Body = body;
  rec.tels = parseTel(body);
  // if(!(rec.from && rec.to)) {
  //   rec.dashRoute = parseDashRoute(body);
  // }

  if (!(rec.from && rec.to)) {
    rec.spaceRoute = parseSpaceRoute(body);
  }

console.log(rec);