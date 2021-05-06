const { roleParser, telParser, routeParser } = require('../parse/parser.js');
const { cleanBody } = require('../parse/clean-body-parser.js');

async function main () {
  const body =
    'завтра после 10.30 кто-нибудь едит с Читы до Борзи？возьмите двух пасажиров（один ребенок кресло есть）';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body);   
  rec.tels = telParser(body);
  rec.cleaedBody = await cleanBody(body);
  rec.route = await routeParser(body);

  console.log(rec);
}

main();