var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');

var app = express();

//creating custom middleware
/*var logger = function(req, res, next){
    console.log("logging....");
    next();
}
app.use(logger); */

//Set up the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//Middleware for static resources
app.use(express.static(path.join(__dirname, 'public')));

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
})

//Express validator Middleware
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


var people  = [
    {
        first_name:"Anish",
        last_name:"Kumar",
        age:"29"
    },
    {
        first_name:"Bikahs",
        last_name:"Joshi",
        age:"29"
    },
    {
        first_name:"Robby",
        last_name:"Williams",
        age:"25"
    }
]

//Route Handler
app.get("/", function(req, res){
    res.render("index", {
        title: "Customers",
        people: people
    });
})

app.post('/users/add', function(req, res){
    
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render("index", {
            title: "Customers",
            people: people,
            errors: errors
        });
    }else{
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
    }
    }
    
});


//Listening to the application
app.listen(3000, function(){
    console.log("Server started on port 3000..");
})