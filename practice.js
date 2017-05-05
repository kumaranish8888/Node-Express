var express = require('express');
var bodyParser  = require('body-parser');
var path = require('path');

var app = express();

aap.get(3000, function(req, res){
    res.send('Hello world');
})

app.listen('/', function(){
    console.log("Server started at port 3000...");
})


app.set('user view', path.login(__dirname, 'views'));