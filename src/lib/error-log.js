import { serializeError } from 'serialize-error';

export function errorLog(error) {
  let log = JSON.stringify(serializeError(error), null, 2);
  log += `\n\nstack:\n${error.stack}`;
  return log
}
