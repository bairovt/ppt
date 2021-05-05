const { routeParser } = require('../parse/parser.js');

async function main () {
  let route = await routeParser('Есть 3 места с Богини Янжимы до Улан-Удэ 89246596622');
  console.log(route);
}

main();