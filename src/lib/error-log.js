const { serializeError } = require('serialize-error');

function errorLog(error, ...params) {
  let log = JSON.stringify(serializeError(error), null, 2);
  log += `\n\nstack:\n${error.stack}`;
  log += `\n\nparams:\n${JSON.stringify(serializeError(params), null, 2)}`;
  return log
}

module.exports = { errorLog };
