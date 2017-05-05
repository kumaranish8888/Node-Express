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


//An array of Objects
var users = [
    {
        id: 1,
        first_name: "Anish",
        last_name: "Kumar",
        email:'anish@gmail.com'
    },
    {
        id: 2,
        first_name: "Bikash",
        last_name: "Joshi",
        email: "bikash@gmail.com"
    },
    {
        id: 3,
        first_name: "Anchal",
        last_name: "Singour",
        email: "anchal@gmail.com"
    },
    {
        id: 4,
        first_name: "Joyab",
        last_name: "Kadiwal",
        email: 'joyab@gmail.com'
    }
]


app.get('/', function(req, res){
    res.render('index', {
        title: "Customers",
        users: users
    });
})



/*
app.get('/', function(req, res){
    res.json(users);
})
*/



app.listen(3000, function(){
    console.log("Server started on port 3000...");
});
