const { cleanBody } = require('../parse/clean-body-parser.js');

let cleanedBody = cleanBody(
  'Завтра днем из Кяхты, в Бичуру, Мухоршибирь, возьму пассажиров, груз, посылку. 89146347949'
);

console.log(cleanedBody);
