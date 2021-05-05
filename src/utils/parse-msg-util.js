const { roleParser, telParser, routeParser } = require('../parse/parser.js');
const { cleanBody } = require('../parse/clean-body-parser.js');

async function main () {
  const body =
  // '29.03. в районе 8-9 утра нужно одно место с Читы до Краснокаменска. Звонить на 89148026706 Срочно!';
  '29.03  в районе 8-9 утра нужно одно место с Читы до Краснокаменска';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body);   
  rec.tels = telParser(body);
  rec.cleaedBody = await cleanBody(body);
  rec.route = await routeParser(body);

  console.log(rec);
}

main();