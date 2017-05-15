var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');

var db = mongojs('vendorapp', ['users'])

var app = express();

//Custom Middleware, Always keep it above the route handler
/*var logger = function(req, res, next){
    console.log("logging...");
    next();
}
app.use(logger); 
*/

//Body Parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Middleware for static resources
//app.use(express.static(path.join(__dirname, 'public')));

//Set up the view engine
app.set('view engine', 'ejs');

//Set up folder for the views
app.set('views', path.join(__dirname, 'views'));

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
}) 

//Middleware for express validators
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

var people = [
    {
        first_name:"Anish",
        last_name:"Kumar",
        email: "akumar@gmail.com"
    },
    {
        first_name:"Bikash",
        last_name:"Joshi",
        email: "bjoshi@gmail.com"
    },
    {
        first_name:"Sandeep",
        last_name:"Chittam",
        email: "schittam@gmail.com"
    }
]

app.get('/', function(req, res){
    
    db.users.find(function (err, docs) {
            // docs is an array of all the documents in mycollection
            res.render('index', {
        title: "Vendor Application",
        people: docs
    });
        })
})

app.post('/people/add', function(req, res){
    
    req.checkBody('first_name', 'First name required').notEmpty();
    req.checkBody('last_name', 'Last name required').notEmpty();
    req.checkBody('email', 'Email required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
       res.render('index', {
            title: "Vendor Application",
            people: docs,
            errors: errors
        });
    }else {
        var newUser = {
        first_name: req.body.first_name,
        last_name : req.body.last_name,
        email: req.body.email
        }
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }else{
                res.redirect('/');
            }
        })
        
    }
    
})

app.listen(8000, function(){
    console.log("Server started on port 8000...");
});