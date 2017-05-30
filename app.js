var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('vendorapp', ['users']);

var app = express();

app.set('view engine', "ejs");
app.set("views", path.join(__dirname, 'views'));

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


//Express Validator Middleware
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

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next(); 
})

var users = [
    {
        first_name: "Anish",
        last_name: "Kumar",
        email: "akumar@gmail.com"
    },
    {
        first_name: "Bikash",
        last_name: "Joshi",
        email: "bjoshi@gmail.com"
    },
    {
        first_name: "Sandeep",
        last_name: "Chittam",
        email: "schittam@gmail.com"
    },
]

app.get('/', function(req, res){
    
    db.users.find(function (err, docs) {
        
         res.render('index',{
        title: "Node Application",
        people: docs
    });
	   
    })
    
})

app.post('/users/add', function(req, res){
    
    req.checkBody('first_name', 'First name is Required').notEmpty();
     req.checkBody('last_name', 'Last name is Required').notEmpty();
     req.checkBody('email', 'Email is Required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('index',{
            title: "Node Application",
            people: users,
            errors: errors
        });
    }else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        
        db.users.insert(newUser, function(err, docs){
            if(err){
                console.log("Error");
            }else{
                res.redirect('/');
            }
        })
    }
    
})

app.listen(3000, function(){
    console.log("Server started on port 3000...");
})