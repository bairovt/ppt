const { roleParser, telParser, routeParser } = require('../parse/parser.js');
const { cleanBody } = require('../parse/clean-body-parser.js');

async function main () {
  const body = 'Возьму посылки с Уу до узона. 89140583802';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body);   
  rec.tels = telParser(body);
  rec.cleaedBody = await cleanBody(body);
  rec.route = await routeParser(body);

  console.log(rec);
}

main();