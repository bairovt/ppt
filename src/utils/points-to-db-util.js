const db = require('../lib/arangodb.js');
const points = require('../../data/points.js');

async function main(){
  console.log('points count:', points.length);
  const savePointsPromises = points.map(point => {
    point.regex = point.regex ? point.regex.source : null;
    return db.collection('Points').save(point);
  });
  await Promise.all(savePointsPromises);
  db.close();
}

main();
