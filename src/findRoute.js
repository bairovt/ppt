const { aql } = require('arangojs');
const config = require('config');
const db = require('../src/lib/arangodb.js');

const minTime = Date.now() - 2*24*3600*1000; // days

async function findRoute(role, direction = 1, from, to) {
  const recs = await db
    .query(
      aql`
    FOR rec IN Recs    
    FILTER rec.TimeStamp > ${minTime}
    FILTER rec.role == ${role}    
    LET a = POSITION(rec.route, ${from}, true)
    LET b = POSITION(rec.route, ${to}, true)
    FILTER a != -1 AND b != -1
    FILTER ${direction} == 1 ? b > a : true
    SORT rec.TimeStamp ASC
    RETURN {
      name: rec.ClientName,
      role: rec.role, Body: rec.Body, Chat: rec.ChatName, 
      Time: DATE_FORMAT(rec.TimeStamp+32400000, "%dd.%mm/%hh:%ii"),
      TimeStamp: rec.TimeStamp,
      route: rec.route,
      src: rec.src,
      ChatName: rec.ChatName
    }`
    )
    .then((cursor) => cursor.all());
  return recs;
}

async function findFromTo(direction) {
  const recs = await db
    .query(
      aql`
    FOR rec IN Recs
    FILTER rec.= require(== ${direction.from}
    FILTER rec.to == ${direction.to} OR IS_NULL(rec.to) 
    RETURN rec
    `
    )
    .then((cursor) => cursor.all());
  return recs;
}

module.exports = { findRoute, findFromTo };