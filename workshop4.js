var fs = require('fs');
function readTotalLines(filePath,callback){
  var fileBuffer =  fs.readFileSync(filePath);
  var to_string = fileBuffer.toString();
  var split_lines = to_string.split("\n");
  callback(split_lines.length);
}
readTotalLines('./resources/contacts.txt',function(totalLines1){
  readTotalLines('./resources/contacts2.txt',function(totalLines2){
    readTotalLines('./resources/contacts3.txt',function(totalLines3){
      console.log(totalLines1 + totalLines2 + totalLines3);
    });
  });
})
