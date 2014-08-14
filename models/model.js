/*Playlist model
 */

var mediamanagerDB = require('mysqlMediaManager');
var parseString = require('xml2js').parseString;
var Model = function(id, name){
  this.id = id;
  this.name = name;

  var self = this;

  this.add = function(next){
    mediamanagerDB.pool.getConnection(function(err, connection) {
      if (err) {
        console.log(err);
        err.friendlyError = global.err1;
        next(err, null);
      }else{
        var query = 'insert into model set ?';
        connection.query(query, self, function(err, result){
          if (err) {            
            console.log(err);
            err.friendlyError = global.err12;
            next(err);
          }else{
            self.id = result.insertId;
            next(err, self.id);
            connection.release();
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
        var query = 'update model set ';
        query += 'name = '+ name +', ';     
        query += 'where id = '+ self.id
        connection.query(query, function(err, result){
          if (err) {            
            console.log(err);     
            err.friendlyError = global.err13;
            next(err, false);
          };
          next(err, true);
          connection.release();
        });
      };
    });
  };
};

Model.find = function(model, limit, next){
  mediamanagerDB.pool.getConnection(function(err, connection) {
    if (err) {
      console.log(err);
      err.friendlyError = global.err1;
      next(err, null);
    }else{
      var query = 'select ';
      query += 'm.id, m.name from model m where ';

      if (model && model.id) {
        query +='m.id = '+ connection.escape(model.id) +' and ';
      };
      if (model && model.name) {
        query +='m.name = '+ connection.escape(model.name) +' and ';
      };
      if (limit) {
        query +=' true limit '+ limit +';';
      }else{
        query +=' true;';
      };
    
      connection.query(query, function(err, results) {  
        if (err) {
          console.log(err);
          err.friendlyError = global.err14;
          next(err, null);
        }else{
          for (var i = results.length - 1; i >= 0; i--) {
            results[i] = new Model(results[i].id, results[i].name);
          }; 
          next(null, results);
        };
        connection.release();
      });
    };
  });
};

/*
 *Exports
*/
exports.Model = Model;
