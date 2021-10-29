
const { cleanBody } = require('../src/parse/clean-body-parser.js');
const { roleParser, cargoParser, routeParser } = require('../src/parse/parser.js');
const msgs = require('./msgs.js');

describe('cleanBody func', () => {
  for (let msg of msgs) {
    if (msg.cleanedBody) {
      test(msg.body, () => {
        // const cleanedBody = await cleanBody(msg.body);
        return expect(cleanBody(msg.body)).resolves.toBe(msg.cleanedBody);
      });
    }
  }
});

describe('routeParser', ()=> {
  for (let msg of msgs) {
    if (!msg.skip && msg.route) {
      test(msg.body, () => {
        // const route = await routeParser(msg.body);
        return expect(routeParser(msg.body)).resolves.toEqual(msg.route);
      });
    }
  }   
});

describe('roleParser', () => {
  for (let msg of msgs) {
    if (!msg.skip && msg.role) {
      test(msg.body, () => {
        expect(roleParser(msg.body)).toEqual(msg.role);
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

// todo test telParser and remove tels = require(test-msgs

