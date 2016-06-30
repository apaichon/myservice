module.exports = function() {
  var biz = require('biz/baseBiz');
  var options = {collection:'apiSessions'};
  var apiSessions = new biz(options);
  apiSessions.register = function(user,callback){
    apiSessions.db.open()
    .then(function(){
      var collection =apiSessions.db.db.collection('apiSessions');
      collection.findOne(user,function(err,doc){
        if(err) callback(apiSessions.getMessage(500,err));
        if(!doc){
          doc =user;
          var ObjectID = require('mongodb').ObjectID;
          var id = new ObjectID();
          doc._id = id.toHexString();
        }
        doc.logon = new Date();
        collection.save(doc,function(err,result){
            if(err) callback(apiSessions.getMessage(500,err));
            apiSessions.db.close();
            callback(apiSessions.getMessage(200,doc));
        });

      });
    })
  }
  return apiSessions;
}
