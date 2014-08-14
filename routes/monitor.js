var Monitor = require('../models/monitor').Monitor;
var Model = require('../models/model').Model;
var Directory = require('../models/directory').Directory;

var index = function(req, res){
	if(req.body.monitor.type == 'edit'){
		var monitor = new Monitor(parseInt(req.body.monitor.id), req.body.monitor.name, req.body.monitor.description, 'a', req.body.monitor.idmodel);
		monitor.update(function(error, resul){
			if(error){
				req.session.error = error;				
			};
		});
	}else{
		console.log('add new monitor');
		var monitor = new Monitor(null, req.body.monitor.name, req.body.monitor.description, 'a', req.body.monitor.idmodel);
		monitor.add(function(err, res){
			if(err) {
				req.session.error = err;
			};	
		});
	}
	res.redirect('/');		
};

var getById = function(req, res){
	Monitor.find({id:req.params.id}, 1, function(error, result){
		if (error){
			req.session.error = error;
			res.redirect('/');
		}else {
			res.send(result[0]);		
		}
	});
};

var disable = function(req, res){
	Monitor.find({id:req.params.id}, 1, function(error,result){
		if(error){
			req.session.error=error;
			res.redirect('/');
		}else {
			var monitor = result[0];
			if(result[0].status==='a'){
				monitor = new Monitor(monitor.id, monitor.name, monitor.description, 'i', monitor.idmodel);
			}else {
				monitor = new Monitor(monitor.id, monitor.name, monitor.description, 'a', monitor.idmodel);
			};
			monitor.update(function(err, result){
				if(err){
					req.session.error = err;
					res.redirect('/');
				}else {
					res.send(monitor.status);
				};
			});
		};
	});
};

exports.disable = disable;
exports.getById = getById;
exports.index = index;

