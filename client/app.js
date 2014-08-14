
var express = require("express");
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

/* serves main page */
app.get("/", function(req, res) {
    res.sendfile('views/index.html')
});

/* serves play page */
app.get("/play", function(req, res) {
    res.sendfile('views/play.html')
});

var port = process.env.PORT || 3001;
app.listen(port, function() {
    console.log("Client listening on " + port);
});