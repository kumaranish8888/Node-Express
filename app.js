var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();
/*
var logger = function(req, res, next){
    console.log("logging...");
    next();
}


app.use(logger);
*/
//View Engine
app.set('view engine', 'ejs');

//Spcify the folder where you need your views
app.set('views', path.join(__dirname, 'views'));

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static path, This path file will overwrite any data in app.js file while rendering
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
    res.render('index', {
        title: "Customers"
    });
})

app.listen(3000, function(){
    console.log("Server started on port 3000...");
});
