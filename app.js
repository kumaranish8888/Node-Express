var express = require('express');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('vendorapp', ['users']);

var app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser middleware
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

var user = [
    {
        name: "Anish",
        age: 20,
        email: "akumar@gmail.com"
    },
    {
        name:"Bikash",
        age:30,
        email:"bkumar@gmail.com"
    },
    {
        name:"Snadeep",
        age:35,
        email:"skumar@gmail.com"
    }
]


app.get('/', function(req, res){
    
    db.users.find(function(err, docs){
      
        res.render('index',{
            title: "Node Express App",
            users: docs
        });
        
    })
    
})

app.post('/users/add', function(req, res){
    
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('index',{
            title: "Node Express App",
            users: docs,
            errors: errors
        });
    }else {
        var newUser = {
            first_name : req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
    }
    
    db.users.insert(newUser, function(err, docs){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    })
})

app.listen(8080, function(){
    console.log("Server running on port 8080....")
})