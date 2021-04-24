const {findRoute} = require('../findRoute.js'
const fs = require('fs');

async function main() {
  let res = await findRoute('D', 2, 'Агинское', 'Чита');
  // let res2 = await findRoute('D', 'Краснокаменск', 'Агинское');
  // let res = res1.concat(res2);
  console.log(`res ${res.length}`, res);
  fs.writeFileSync('./result_recs.json', JSON.stringify(res, null, 2));
}

main();
