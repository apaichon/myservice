module.exports = function() {
  var biz = require('biz/baseBiz');
  var options = {collection:'apiUsers'};
  var apiUsers = new biz(options);
  return apiUsers;
}
