const { roleParser, telParser, parseDirection } = require('../parse/parser.js');
const { cleanBody, routeParser } = require('../parse/clean-body-parser.js');

const body =
  // '29.03. в районе 8-9 утра нужно одно место с Читы до Краснокаменска. Звонить на 89148026706 Срочно!';
  '29.03  в районе 8-9 утра нужно одно место с Читы до Краснокаменска';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body); 
  // rec.from = parseDirection('from', body);
  // rec.to = parseDirection('to', body);
  rec.tels = telParser(body);
  rec.cleaedBody = cleanBody(body);
  rec.route = routeParser(body);

console.log(rec);