import fs from 'fs';
import msgs from './data/msgs.js';
import parse from './parser.js';

const recs = parse(msgs);

let recsJson = JSON.stringify(recs, null, 2);

fs.writeFileSync('./result_recs.json', recsJson);