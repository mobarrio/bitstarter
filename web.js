var express = require('express');
var fs = require('fs');
var port = process.env.PORT || 8080;
var app = express.createServer(express.logger());

app.use('/', express.static(__dirname + "/public"));

app.get('/', function(req, res){
    fs.readFile(__dirname + '/public/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.listen(port, function() { 
		console.log("Listening on " + port); 
});
