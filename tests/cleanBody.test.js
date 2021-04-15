
import {cleanBody} from '../clean-body-parser.js';
import msgs from './msgs.js'

describe('cleanBody func', () => {  

  for (let msg of msgs) {
    if (msg.cleanedBody) {
      test(msg.body, () => {
        expect(cleanBody(msg.body)).toBe(msg.cleanedBody);
      });
    }    
  }

});