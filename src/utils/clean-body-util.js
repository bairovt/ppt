const { cleanBody } = require('../parse/clean-body-parser.js');

let cleanedBody = cleanBody(
  'Ищу машину  с Читы до Агинска, в 22-00, на сегодня, на данный момент в пути.  89244535332'
);

console.log(cleanedBody);
