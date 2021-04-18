import {findRoute} from '../findRoute.js'
import fs from 'fs';

async function main() {
  let res1 = await findRoute('D', 'Краснокаменск', 'Чита');
  let res2 = await findRoute('D', 'Краснокаменск', 'Агинское');
  let res = res1.concat(res2);
  console.log('res ', res);
  fs.writeFileSync('./result_recs.json', JSON.stringify(res, null, 2));
}

main();
