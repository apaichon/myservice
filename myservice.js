var express = require("express");

var app = express();

require('rootpath')();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var session = require('express-session')
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 300000 }}));


var centralApi = require('api/centralApi');
var restApi = new centralApi.restApi();
var logger = new centralApi.apiLogger();
var authorize = require('api/security/authorize');
var auth = new authorize();
app.all('/api/*',auth.validateSession,logger.getGuid
  ,logger.writeReqLog,restApi.executeApi,logger.writeResLog);


app.listen(3000);
console.log("My Service is listening to port 3000.");

process.on('uncaughtException', function (err) {
  console.error((new Date).toISOString() + ' uncaughtException:', err.message);
});
