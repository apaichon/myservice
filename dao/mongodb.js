module.exports = function mongodb(){
  var self = this;

  // initial database configurarion.
  this.init = function(options){
   self.MongoClient = require('mongodb').MongoClient;
   self.config = require('config');
   self.url = 'mongodb://' + self.config.DB_HOST +':' + self.config.DB_PORT +'/'+self.config.DB_DATABASE;
   self.results =[];
   self.errors=[];
   if(options.params)
     self.params = options.params;
   if(options.collection)
     self.collection = options.collection;

   return new Promise(function(resolve,reject){
     resolve(true);
   });
 }
  // open database connection.
  this.open = function(){
    return new Promise( function(resolve, reject) {
      self.MongoClient.connect(self.url,function(err,db){
        if(err){reject(err);}

        self.isOpen = true;
        self.db= db;
        resolve(true)
      });
    });
  }
  // close database connection.
  this.close = function(){
    return new Promise(function(resolve,reject){
      self.db.close();
      self.isOpen = false;
      resolve(true);
    });
  }
  // get one record.
  this.get = function(){
    return new Promise(function(resolve,reject){
      var collection = self.db.collection(self.collection);
      collection.findOne(self.params,function(err, doc) {
        if(err){reject(err);}

        if(doc){
          self.results.push(doc);
          resolve(true);
        }
        else{
          self.errors.push("Data is not found!");
          reject(false);
        }
      });
    });

  }
  // get multiples records.
  this.getMany = function(){
    return new Promise(function(resolve,reject){
      var collection = self.db.collection(self.collection);
      console.log('Get Meny');
      collection.find(self.params).toArray(function(err, docs) {
        if(err){reject(err);}
        console.log(docs);
        if(docs){
          self.results.push(docs);
          resolve(true);
        }
        else{
          self.errors.push("Data is not found!");
          reject(false);
        }
      });
    });
  }
  //insert data.
  this.insert = function(){
    return new Promise(function(resolve,reject){
       var ObjectID = require('mongodb').ObjectID;
       var id = new ObjectID();
       self.params._id = id.toHexString();
       self.db.collection(self.collection).insert(self.params
    ,function(err,doc){
         if(err){reject(err);}
         self.results.push(doc);
         resolve(true);
       });
     });
  }
  //set parameters.
  this.setParams = function(params){
    self.params = params;
    return new Promise(function(resolve,reject){
      resolve(true);
    });
  }
  // update data
  this.update = function(){
    return new Promise(function(resolve,reject){
      self.db.collection(self.collection).update(self.params.criteria
        ,self.params.data,self.params.opts,function(err,doc){
        if(err){reject(err);}
        self.results.push(doc);
        resolve(true);
      });
    });
  }
  // remove data
  this.remove = function(){
    return new Promise(function(resolve,reject){
      self.db.collection(self.collection).remove(self.params
        ,function(err,doc){
        if(err){reject(err);}
        self.results.push(doc);
        resolve(true);
      });
    });
  }
}
