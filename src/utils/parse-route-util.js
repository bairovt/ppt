const { routeParser } = require('../parse/parser.js');

async function main () {
  let route = await routeParser(
    'Едет кто с Улан удэ до мухоршибиря сегодня часов в 6? Возьмите пожалуйста одного пассажира с оплатой'
  );
  console.log(route);
}

main();