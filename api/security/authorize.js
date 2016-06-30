function authorize(req){
  var self = this;
  var message = {code:504,status:'error',message:"Unauthorized!"};

  this.login = function(user,callback){
    self.validateFormat(user)
    .then(self.validateUserPassword)
    .then(self.registerSession)
    .then(function(result){
      callback(result);
    }).catch(function(err){
      callback(err);
    })
  }
  this.validateFormat = function(user){
      return new Promise(function(resolve,reject){
          if(!user.name || user.name.length ==0 || !user.password
            || user.password.length ==0){
              reject(message);
            }
        resolve(user);
      });
    }
    this.validateUserPassword = function(user){
       return new Promise(function(resolve,reject){
         var apiUser = require('api/admin/apiUsers')();
         apiUser.get({"name":user.name},function(result){
             if(result.code!=200) reject(message);
             var CryptoJS = require('crypto-js');
             var config = require('config');
             var password = CryptoJS.Rabbit.decrypt(result.results[0].password,
                config.SECRET_KEY).toString(CryptoJS.enc.Utf8);
             if(password == user.password) resolve(result);
             else reject(message);
         });
       });
     }
     this.registerSession = function(result){
      return new Promise(function(resolve,reject){
        var apiSessions = require('api/admin/apiSessions')();
        var user ={};
        user.sessionID = req.session.id;
        user.name = result.results[0].name;

        apiSessions.register(user,function(session){
            if(result.code!=200) reject(message);
            resolve(session);
        });
      });
    }
    this.validateSession = function(req,res,next){
       if(req.params[0] =='security/authorize/login'){
         next();
         return;
       }
         var apiSessions = require('api/admin/apiSessions')();
         apiSessions.get({sessionID:req.session.id},function(result){

           if(result.code!=200){
             res.send(message);return;
           }
           next();
         });
     }

}

module.exports = authorize;
