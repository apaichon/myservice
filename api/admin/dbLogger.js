module.exports = function() {
  var biz = require('biz/baseBiz');
  var options = {collection:'logs'};
  var dbLogger = new biz(options);
  return dbLogger;
}
