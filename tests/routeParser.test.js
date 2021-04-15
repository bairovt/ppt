
import {routeParser} from '../clean-body-parser.js';
import msgs from './msgs.js';

describe('routeParser', ()=> {

  for (let msg of msgs) {
    if (!msg.skip) {
      test(msg.body, () => {
        expect(routeParser(msg.body)).toEqual(msg.route);
      });
    }
  }

  // test.each(msgs)('routeParser', (msg) => {
  //   expect(routeParser(msg.body)).toEqual(msg.route);
  // }); 
});