var Playlist = require('../models/playlist').Playlist;
var Monitor = require('../models/monitor').Monitor;
var Directory = require('../models/directory').Directory;

var index = function(req, res){	
	if(req.body.playlist.type == "edit"){
		console.log('update a playlist');
		var playlistUpdate = new Playlist(parseInt(req.body.playlist.id),  req.body.playlist.name, req.body.playlist.description, req.body.playlist.startdate, req.body.playlist.finishdate, 'a', parseInt(req.body.playlist.iddirectory), parseInt(req.body.playlist.idmonitor) )
		playlistUpdate.update(function(error, resul){
			if(error){
				req.session.error = error;
			};
			res.redirect('/');
		}); 
	}
	else {
		var playlist = new Playlist(null, req.body.playlist.name, req.body.playlist.description, req.body.playlist.startdate, req.body.playlist.finishdate, 'a', parseInt(req.body.playlist.iddirectory), parseInt(req.body.playlist.idmonitor));
		playlist.add(function(err, id) {
			if(err) {      
      	req.session.error = err;
			};
			res.redirect('/');	
		});
	}
};

var getById = function(req, res){
	Playlist.find({id:req.params.id}, 1, function(error, result){
		if (error){
			req.session.error = error;
			res.redirect('/');
		}else {			
			res.send({playlist: result[0], FTPURL: global.FTPHost +'/'+ global.FTPFolder +'/'});		
		}
	});
};

var disable = function(req, res){
	Playlist.find({id:req.params.id}, 1, function(error,result){
		if(error){
			req.session.error=error;
			res.redirect('/');
		}else {
			var playlist = result[0];
			if(result[0].status==='a'){
				playlist = new Playlist(playlist.id, playlist.name, playlist.description, playlist.startdate, playlist.finishdate, 'i', playlist.iddirectory, playlist.idmonitor);
			}else {
				playlist = new Playlist(playlist.id, playlist.name, playlist.description, playlist.startdate, playlist.finishdate, 'a', playlist.iddirectory, playlist.idmonitor);
			};
			playlist.update(function(err, result){
				if(err){
					req.session.error = err;
					res.redirect('/');
				}else {
					res.send(playlist.status);
				};
			});
		};
	});
};

var remove = function(req, res){
	var playlist = new Playlist(req.params.id, null, null, null, null, null, null, null);
	playlist.remove(function(err, result){
		if(err){
			req.session.error = err;
			res.redirect('/');
		}else {
			res.send(true);
		};
	});
}; 

exports.remove = remove;
exports.getById = getById;
exports.disable = disable;
exports.index = index;
