module.exports = function(){
  var config = require('config');
  var baseDAO ={};

  switch (config.DB_PROVIDER) {
    case "OrientDB":
        var orientdb = require('dao/orientdb');
        baseDAO = new orientdb();
      break;
    case "MongoDB":
        var mongodb = require('dao/mongodb');
        baseDAO = new mongodb();
      break;
  }
  return baseDAO;
}
