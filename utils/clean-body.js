import {cleanBody} from '../clean-body-parser.js'

let cleanedBody = cleanBody(
  'завтра после 10.30 кто-нибудь едит с Читы до Борзи ?？возьмите двух пасажиров（один ребенок кресло есть）'
);

console.log(cleanedBody);
