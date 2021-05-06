const { roleParser, telParser, routeParser } = require('../parse/parser.js');
const { cleanBody } = require('../parse/clean-body-parser.js');

async function main () {
  const body =
    'Из Мухора в город кто нибудь не едет в данное время, возьмите 2 пассажиров до Хошун Узура';

  let rec = {};
  rec.Body = body;
  rec.role = roleParser(body);   
  rec.tels = telParser(body);
  rec.cleaedBody = await cleanBody(body);
  rec.route = await routeParser(body);

  console.log(rec);
}

main();