const { roleParser, telParser, routeParser } = require('../parse/parser.js');
const { cleanBody } = require('../parse/clean-body-parser.js');

async function main () {
  const body = '7.05. Еду с Никольска в уу в 10 утра\nЕсть 2 места, 8914636029';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body);   
  rec.tels = telParser(body);
  rec.cleaedBody = await cleanBody(body);
  rec.route = await routeParser(body);

  console.log(rec);
}

main();