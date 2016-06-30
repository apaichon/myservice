function restApi(){
  this.executeApi=function(req,res,next){
    var params = req.params[0].split('/');
    //[0]-module,[1]-object,[2]-function
    var appParams = (req.method=="GET"?req.query:req.body);
    if(params.length <3)
      res.send({code:530,status:"error",message:"Invalid parameters!"});
    else
     execute(params,appParams,req,res,next);
  }
  function execute(urlParams,appParams,req,res,next){
    try{
        var obj = require('api/'+urlParams[0]+'/' + urlParams[1]);
        obj = new obj(req);
        var func =obj[urlParams[2]];
        func(appParams,function(result){
          res.result = result;
          res.send(result);
          next();
        });
    }
    catch(err){
      res.result = {code:500,status:"error",message:JSON.stringify(err) };
      res.send(res.result);
      next();
    }
  }
}

function apiLogger(){
  var winston = require('winston');
  var useragent = require('useragent');
  var Guid = require('guid');
  var _guid ="";
  function getReqLog(log,req){
    log.guid = req.guid;
    log.sessionID = req.sessionID;
    log.ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    log.url = req.params;
    log.method = req.method;
    var agent = useragent.parse(req.headers['user-agent']);
    log.os = agent.os;
    log.device = agent.device;
    log.browser = agent.toString();

    return log;
  }
  function getResLog(log,level,req,result){
    log.guid = req.guid;
    if(result.code !=200)
      log.level = 'error';
    else
      log.level = 'info';
    log.result  = result;
    return log;
  }
  function transformLog (level,step,req,result){
   var log ={};
   log.step = step;

   switch(step){
     case "start":
       log = getReqLog(log,req);
     break;
     case "end":
       log = getResLog(log,level,req,result);
     break;
   }
   log.timeStamp = new Date().getTime();
   return log;
 }
  function writeLogFile(level,step,req,result){
     var now = new Date();
     var fileName = now.toISOString().substring(0,10);
     var log = transformLog(level,step,req,result);
     var logger = new winston.Logger({
       level: level,
       transports: [
           new (winston.transports.File)({ filename: 'logs/'+fileName+ '.log' })
         ]
       });

     logger.log(level, log);
   }
   function writeLogDB (level,step,req,result){
       var logDB = require('api/admin/dbLogger')();
       var log = transformLog(level,step,req,result);

       logDB.add(log,function(err,result){
       });
  }
  function writeLog (level,step,req,result,next){
    writeLogFile(level,step,req,result);
    writeLogDB(level,step,req,result);
    next();
  }
  this.getGuid =function(req,res,next){
    _guid = Guid.create();
    req.guid = _guid.toString();
    next();
  }
  this.writeReqLog = function(req,res,next){
    writeLog('info','start',req,{},next);
  }
  this.writeResLog = function(req,res,next){
    var level ='info';
    if(res.result.code !=200)
      level ="error";
    writeLog(level,'end',req,res.result,next);
  }
}
 module.exports ={restApi:restApi,apiLogger:apiLogger};
