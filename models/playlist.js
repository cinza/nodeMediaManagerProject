/*Playlist model
 */

var mediamanagerDB = require('mysqlMediaManager');
var Monitor = require('./monitor').Monitor;
var Directory = require('./directory').Directory;
var parseString = require('xml2js').parseString;
var shortId = require('shortid');
var Playlist = function(id, name, description, startdate, finishdate, status, iddirectory, idmonitor){
  this.id = id;
  this.name = name;
  this.description = description;
  this.startdate = formatDate(startdate);
  this.finishdate = formatDate(finishdate);
  this.status = status;
  this.iddirectory = iddirectory;
  this.idmonitor = idmonitor;

  var self = this;

  this.add = function(next){
    var url = shortId.generate();
    var directory = new Directory(null, url);
    directory.add(function(err, iddirectory) {
      if(err) {      
        next(err, null);
      };
      self.iddirectory = iddirectory;
      mediamanagerDB.pool.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
          err.friendlyError = global.err1;
          next(err, null);
        }else{
          var query = 'insert into playlist set ?';
          connection.query(query, self, function(err, result){
            if (err) {
              console.log(err);
              err.friendlyError = global.err15;
              next(err);
            }else{
              self.id = result.insertId;
              next(err, 0);              
            };
            connection.release();
          });
        };
      });
    });
  };

  this.update = function(next){
    mediamanagerDB.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        err.friendlyError = global.err1;
        next(err, null);
      }else{
        var query = 'update playlist set ';
        query += 'name = "'+ name +'", ';
        query += 'description = "'+ description +'", ';
        query += 'startdate = "'+ formatDate(startdate) +'", ';
        query += 'finishdate = "'+ formatDate(finishdate) +'", ';
        query += 'status = "'+ status +'", ';
        query += 'iddirectory = "'+ iddirectory +'", ';
        query += 'idmonitor = "'+ idmonitor +'" ';      
        query += 'where id = '+ self.id
        connection.query(query, function(err, result){
          if (err) {            
            console.log(err);     
            err.friendlyError = global.err16
            next(err, false);
          }else{
            next(err, true);
          };
          connection.release();
        });
      };
    });
  };

  this.remove = function(next){
    mediamanagerDB.pool.getConnection(function(err, connection){
      if (err) {
        console.log(err);
        err.friendlyError = global.err1;
        next(err, null);
      }else{
        var query = 'delete from playlist ';
        query += 'where id =' + self.id
        connection.query(query, function(err, result){
          if(err){            
            console.log(err);
            err.friendlyError = global.err17
            next(err, false);
          }else{
            next(err, true);
          };
          connection.release();
        });
      };
    });
  };
};

Playlist.find = function(playlist, limit, next){
  mediamanagerDB.pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      err.friendlyError = global.err1;
      next(err, null);
    }else{
      var query = 'select ';
      query += 'p.id, p.name, p.description, DATE_FORMAT(p.startdate, "%Y-%m-%d") AS startdate, DATE_FORMAT(p.finishdate, "%Y-%m-%d") AS finishdate, p.status, p.iddirectory, p.idmonitor from playlist p where ';
      
      if (playlist && playlist.id) {
        query +='p.id = '+ connection.escape(playlist.id) +' and ';
      };
      if (playlist && playlist.name) {
        query +='p.name = '+ connection.escape(playlist.name) +' and ';
      };
      if (playlist && playlist.description) {
        query +='p.description = "'+ connection.escape(playlist.description) +'" and ';
      };
      if (playlist && playlist.startdate) {
        query +='p.startdate = "'+ connection.escape(playlist.startdate) +'" and ';
      };
      if (playlist && playlist.finishdate) {
        query +='p.finishdate = "'+ connection.escape(playlist.finishdate) +'" and ';
      };
      if (playlist && playlist.status) {
        query +='p.status = "'+ connection.escape(playlist.status) +'" and ';
      };
      if (playlist && playlist.iddirectory) {
        query +='p.iddirectory = "'+ connection.escape(playlist.iddirectory) +'" and ';
      };
      if (playlist && playlist.idmonitor) {
        query +='p.idmonitor = "'+ connection.escape(playlist.idmonitor) +'" and ';
      };
      if (limit) {
        query +=' true limit '+ limit +';';
      }else{
        query +=' true;';
      };   
      connection.query(query, function(err, results) {  
        if (err) {          
          console.log(err);
          err.friendlyError = global.err18
          next(err, null);
        }else{
          if ((!results) || (results.length == 0)) {
            next(null, results);
          }else{
            (function(done){          
              var x = 0;
              for (var i = results.length - 1; i >= 0; i--) {
                results[i] = new Playlist(results[i].id, results[i].name, results[i].description, results[i].startdate, results[i].finishdate, results[i].status, results[i].iddirectory,  results[i].idmonitor);
                (function(doneFindingDirectory,j){
                  Directory.find({id: results[j].iddirectory}, 1, function(error, directories){
                    if(error){
                      next(error);
                    }
                    else {
                      doneFindingDirectory(directories[0],j);
                    }
                  });
                })(function(directory,k){
                  results[k].directory = directory || [];
                  x++;
                  if(x==results.length){
                    done();
                  }
                },i);
              }; 
            })(function(){
              next(null, results);
            });
          };
        };    
        connection.release();
      });
    };
  });
};

//formatDate function for DB
function formatDate(date){
  if(date){
    var splitDate = date.split('-');
    return splitDate[2] + '-' + splitDate[1] + '-' + splitDate[0]; 
  };
};
/*
 *Exports
*/
exports.Playlist = Playlist;
