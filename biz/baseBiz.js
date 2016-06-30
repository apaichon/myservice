module.exports = function(options){
  var baseDAO = require('dao/baseDAO');
  var db = new baseDAO();
  console.log(db);
  db.init(options);
  var self = this;
  this.db = db;

  this.getMessage = function(code,result){
    switch(code){
      case 200:
        return {code:code,status:"completed",results:result};
      case 500:
        return {code:code,status:"error",results:result};
      default:
        return {code:100,status:"unknown"};
    }
  }

  this.get = function(params,callback){
      db.setParams(params)
      .then(db.open)
      .then(db.get)
      .then(db.close)
      .then(function(){
        callback(self.getMessage(200,db.results));
      })
      .catch(function(err){
        callback(self.getMessage(500,err));
      })
  }

  this.getMany = function(params,callback){
      db.setParams(params)
      .then(db.open)
      .then(db.getMany)
      .then(db.close)
      .then(function(){
        callback(self.getMessage(200,db.results));
      })
      .catch(function(err){
        callback(self.getMessage(500,err));
      })
  }

  this.add =function(params,callback){
    db.setParams(params)
    .then(db.open)
    .then(db.insert)
    .then(db.close)
    .then(function(){
      callback(self.getMessage(200,db.results));
    })
    .catch(function(err){
      callback(self.getMessage(500,err));
    })
  }

  this.edit =function(params,callback){
    db.setParams(params)
    .then(db.open)
    .then(db.update)
    .then(db.close)
    .then(function(){
      callback(self.getMessage(200,db.results));
    })
    .catch(function(err){
      callback(self.getMessage(500,err));
    })
  }

  this.delete =function(params,callback){
    db.setParams(params)
    .then(db.open)
    .then(db.remove)
    .then(db.close)
    .then(function(){
      callback(self.getMessage(200,db.results));
    })
    .catch(function(err){
      callback(self.getMessage(500,err));
    })
  }

}
