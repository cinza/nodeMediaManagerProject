var Monitor = require('../models/monitor').Monitor;
var Model = require('../models/model').Model;

/* GET home page monitors*/ 
var index = function(req, res) {
  Monitor.find({}, null, function(err, results){
    if (err) {
      res.render('index', {friendlyError: err.friendlyError});
    }else{
    	 Model.find({},null, function(error, resultsModel){
				if (error) {
		      res.render('index', {friendlyError: err.friendlyError});
		    }else{
          var error = '';
          if (req.session && req.session.error) {
            error = req.session.error;
            console.log('Session error: '+ JSON.stringify(error));
          };
          res.render('index', {monitors:results, models:resultsModel, friendlyError: error.friendlyError});		    	
		    };
			});   
    };
  });
};




exports.index = index;
