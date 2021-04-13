
import {cleanBody} from '../clean-body-parser.js';
import msgs from './msgs.js'


test('cleanBodyParser', () => {
  for (let msg of msgs) {
    expect(cleanBody(msg.body)).toBe(msg.cleanedBody);
  }
});