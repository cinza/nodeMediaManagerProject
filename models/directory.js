/*Playlist model
 */

var mediamanagerDB = require('mysqlMediaManager');
var parseString = require('xml2js').parseString;
var ftp = require('ftpMediaManager');

var Directory = function(id, url){
  this.id = id;
  this.url = url;

  var self = this;

  this.add = function(next){
    ftp.createDirectory(url, function(err, fullUrl){
      if (err) {
        console.log(err);
        err.friendlyError = global.err6 + url;
        next(err, null);
      }else{
        mediamanagerDB.pool.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
            err.friendlyError = global.err1;
            next(err, null);
          }else{
            var query = 'insert into directory set ?';
            connection.query(query, self, function(err, result){
              if (err) {                
                console.log(err);                
                err.friendlyError = global.err7 + url;
                next(err);
              }{
                self.id = result.insertId;
                next(err, self.id);
                connection.release();
              };
            });
          };
        });
      };
    });    
  };

  this.update = function(next){
    mediamanagerDB.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        err.friendlyError = global.err1;
        next(err, null);
      }else{
        var query = 'update directory set ';
        query += 'url = '+ name +', ';     
        query += 'where id = '+ self.id
        connection.query(query, function(err, result){
          if (err) {
            console.log(err);
            err.friendlyError = global.err8 + url;
            next(err, false);
          };
          next(err, true);
          connection.release();
        });
      };
    });
  };
};

Directory.find = function(directory, limit, next){
  mediamanagerDB.pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      err.friendlyError = global.err1;
      next(err, null);
    }else{
      var query = 'select ';
      query += 'd.id, d.url from directory d where ';

      if (directory && directory.id) {
        query +='d.id = '+ connection.escape(directory.id) +' and ';
      };
      if (directory && directory.url) {
        query +='m.url = '+ connection.escape(directory.name) +' and ';
      };
      if (limit) {
        query +=' true limit '+ limit +';';
      }else{
        query +=' true;';
      };
      console.log(query);    
      connection.query(query, function(err, results) {  
        if (err) {
          console.log(err);
          err.friendlyError = global.err9;
          next(err, null);
        }else{
            next(null, results);
        };  
        connection.release();
      });
    };
  });
};

Directory.getFiles = function(code, next){
  ftp.getFiles(code, function(err, list){
    if (err) {
      console.log(err);
      err.friendlyError = global.err10 + code;
      next(err, null);
    }else{
      var files = [];
      var url = '';    
      if (list) {
        for (var i = list.length - 1; i >= 0; i--) {
          url = global.MediaManagerServerURL +'/'+ global.imageRoute.replace(':code', code).replace(':name', list[i].name);      
          if (list[i].name) {        
            files.push({file: list[i].name, url: url});
          };      
        };
      };          
      next(err, files);
    };
  });
};

Directory.getFile = function(code, name, next){
  ftp.getFile(code, name, function(err, fileStream){    
    if (err) {
      console.log(err);
      err.friendlyError = global.err11 + name;
      next(err, null);
    }else{
      next(err, fileStream);
    };
  });
};

exports.Directory = Directory;
