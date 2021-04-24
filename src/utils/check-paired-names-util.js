const {checkPairedNames} = require('../parse/clean-body-parser.js'

let str = checkPairedNames(
  'Сегодня с иркутска в ночь до у-удэ возьму 2 человек только звоните 89025624498'
);

console.log(str);