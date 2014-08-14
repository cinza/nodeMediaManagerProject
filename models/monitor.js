/*Monitor model
 */

var mediamanagerDB = require('mysqlMediaManager');
var Model = require('./model').Model;
var Playlist = require('./playlist').Playlist;
var parseString = require('xml2js').parseString;
var Monitor = function(id, name, description, status, idmodel){
  this.id = id;
  this.name = name;
  this.description = description;
  this.status = status;

  this.idmodel = idmodel;

  var self = this;

  this.add = function(next){
    mediamanagerDB.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        err.friendlyError = global.err1;
        next(err, null);
      }else{
        var query = 'insert into monitor set ?';
        connection.query(query, self, function(err, result){
          if (err) {            
            console.log(err);
            err.friendlyError = global.err4;
            next(err, null);
          };
          self.id = result.insertId;
          next(err, self.id);
          connection.release();
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
        var query = 'update monitor set ';
        query += 'name = "'+ name +'", ';
        query += 'description = "'+ description +'", ';
        query += 'status = "'+ status +'", ';
        query += 'idmodel = "'+ idmodel +'" ';      
        query += 'where id = '+ self.id
        connection.query(query, function(err, result){
          if (err) {            
            console.log(err);     
            err.friendlyError = global.err5;
            next(err, false);
          };
          next(err, true);
          connection.release();
        });
      };
    });
  };
};

Monitor.find = function(monitor, limit, next){
  mediamanagerDB.pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      err.friendlyError = global.err1;
      next(err, null);
    }else{
      var query = 'select ';
      query += 'm.id, m.name, m.description, m.status, m.idmodel from monitor m where ';

      if (monitor && monitor.id) {
        query +='m.id = '+ connection.escape(monitor.id) +' and ';
      };
      if (monitor && monitor.name) {
        query +='m.name = '+ connection.escape(monitor.name) +' and ';
      };
      if (monitor && monitor.description) {
        query +='m.description = "'+ connection.escape(monitor.description) +'" and ';
      };
      if (monitor && monitor.status) {
        query +='m.status= "'+ connection.escape(monitor.status) +'" and ';
      };
      if (monitor && monitor.idmodel) {
        query +='m.idmodel = "'+ connection.escape(monitor.idmodel) +'" and ';
      };
      if (limit) {
        query +=' true limit '+ limit +';';
      }else{
        query +=' true;';
      }; 
      connection.query(query, function(err, results) {  
        if (err) {
          console.log(err);
          err.friendlyError = global.err3;
          next(err, null);
        }else{
          if ((!results) || (results.length == 0)) {
            next(null, results);
          } else{
            (function(done){          
              var x = 0;
              for (var i = results.length - 1; i >= 0; i--) {
                results[i] = new Monitor(results[i].id, results[i].name, results[i].description, results[i].status, results[i].idmodel);
                (function(doneFindingPlaylist,j){
                  Playlist.find({idmonitor: results[j].id}, null, function(error, playlists){
                    if(error){
                      next(error);
                    }
                    else {
                      doneFindingPlaylist(playlists,j);
                    }
                  });
                })(function(playlists,k){
                  results[k].playlists = playlists || [];
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

/*
 *Exports
*/
exports.Monitor = Monitor;
