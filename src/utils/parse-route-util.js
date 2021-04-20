import { routeParser } from '../parse/clean-body-parser.js';

let route = routeParser(
  'завтра после 10.30 кто-нибудь едит с Читы до Борзи？возьмите двух пасажиров（один ребенок кресло есть）'
);

console.log(route);
