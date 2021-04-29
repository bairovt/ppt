
const { cleanBody, routeParser } = require('../src/parse/clean-body-parser.js');
const { parseRole, cargoParser } = require('../src/parse/parser.js');
const msgs = require('./test-msgs.js');

describe('cleanBody func', () => {
  for (let msg of msgs) {
    if (msg.cleanedBody) {
      test(msg.body, () => {
        expect(cleanBody(msg.body)).toBe(msg.cleanedBody);
      });
    }
  }
});

describe('routeParser', ()=> {
  for (let msg of msgs) {
    if (!msg.skip) {
      test(msg.body, () => {
        expect(routeParser(msg.body)).toEqual(msg.route);
      });
    }
  }   
});

describe('parseRole', () => {
  for (let msg of msgs) {
    if (!msg.skip && msg.role) {
      test(msg.body, () => {
        expect(parseRole(msg.body)).toEqual(msg.role);
      });
    }
  }
});

describe('cargo check', () => {
  for (let msg of msgs) {
    if (msg.cargo) {
      test(msg.body, () => {
        expect(cargoParser(msg.body)).toBe(msg.cargo);
      });
    }
  }
});

// todo test parseTel and remove tels = require(test-msgs

