var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('vendorapp', ['users']);

var app = express();

/*
var logger = function(req, res, next){
    console.log("Logging...");
    next();
}

app.use(logger);
*/

//BodyParser Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//set static path, Middleware for static folder to store static resources
app.use(express.static(path.join(__dirname, 'public')));

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Global Vars
app.use(function(resq, res, next){
    res.locals.errors = null;
    next();
})

//Express validator middleware
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


/*
var people = [
    {
        id: 1,
        first_name:"Anish",
        last_name: "Kumar",
        emai:"akumar@gmail.com"
    },
    {
        id: 2,
        first_name:"Raghav",
        last_name: "Ram",
        emai:"ram@gmail.com"
    },
    {
        id: 3,
        first_name:"Dhanush",
        last_name: "Singh",
        emai:"dsingh@gmail.com"
    },
    {
        id: 4,
        first_name:"Mary",
        last_name: "Patel",
        emai:"mpatel@gmail.com"
    }
];

*/

app.get('/', function(req, res){
    // find everything
        db.users.find(function (err, docs) {
            console.log(docs);// docs is an array of all the documents in users in the database
            res.render('index', {
                title: "Customers",
                people: docs
    });
        })
})

app.post('/people/add', function(req, res){
    
    req.checkBody("first_name", "First Name is required").notEmpty();
    req.checkBody("last_name", "Last Name is required").notEmpty();
    req.checkBody("email", "Email is required").notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('index', {
            title: "Customers",
            people: people,
            errors: errors
    });
    }else {
        var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
    }
    db.users.insert(newUser, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
    }
    
    
});

app.listen(3000, function(){
    console.log("Server started on port 3000...");
})













