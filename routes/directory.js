var fs = require('fs');
var Directory = require('../models/directory').Directory;

var getFiles = function(req, res){
  var code = req.params.code;
  Directory.getFiles(code, function(err, files){        
    if (err){
      console.log(err);
      res.end();
    }else {
      res.send(files);
    };
  });  
};

var getFile = function(req, res){
  var code = req.params.code;
  var name = req.params.name;
  Directory.getFile(code, name, function(err, fileStream){
    if (err) {      
      console.log(err);
      res.end();
    }else{
      if (!res.getHeader('Cache-Control') || !res.getHeader('Expires')) {
        console.log('Caching enabled');
        res.setHeader("Cache-Control", "public, max-age=86400"); // ex. 4 days in seconds. 24h = 86400
        res.setHeader("Expires", new Date(Date.now() + 86400000).toUTCString());  // in ms.
      };        
      fileStream.pipe(res);
    };
  });  
};

exports.getFiles = getFiles;
exports.getFile = getFile;