var fs = require('fs');
function readTotalLines(filePath){
  return new Promise( function(resolve, reject) {
    fs.exists(filePath,function(exists){
    if(exists){
      var fileBuffer =  fs.readFileSync(filePath);
      var to_string = fileBuffer.toString();
      var split_lines = to_string.split("\n");
      console.log(split_lines.length);
      resolve(split_lines.length);
    }
    else {
      reject("Not found " + filePath );
    }
  });
  });
}

Promise.all([readTotalLines('./resources/contacts.txt')
,readTotalLines('./resources/contacts2.txt')
,readTotalLines('./resources/contacts3.txt')
,readTotalLines('./resources/contacts4.txt')
]
).then(function(values){
  console.log(values);
},function(errors){
  console.log(errors);
})
