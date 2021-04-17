
import {routeParser} from '../clean-body-parser.js';
import { parseRole } from '../parser.js';
import { cleanBody } from '../clean-body-parser.js';
import msgs from './msgs.js';

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

