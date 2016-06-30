module.exports = function() {
  var biz = require('biz/baseBiz');
  var options = {collection:'contacts'};
  var contactsBiz = new biz(options);
  return contactsBiz;
}
