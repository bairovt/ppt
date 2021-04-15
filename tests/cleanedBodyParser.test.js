
import {cleanedBodyParser} from '../clean-body-parser.js';
import msgs from './msgs.js';

describe('cleanedBodyParser suite', ()=> {

  test('cleanedBodyParser', () => {
    for (let msg of msgs) {
      expect(cleanedBodyParser(msg.body)).toEqual(msg.route);
    }
  });
});