var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId= mongojs.ObjectId;

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

//Global vars
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


//An array of Objects
/*var users = [
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
] */


app.get('/', function(req, res){
    db.users.find(function (err, docs) {
	   //console.log(docs);
        res.render('index', {
            title: "Customers",
            users: docs
        });
    })
}) 

app.post('/users/add', function(req, res){
    
    req.checkBody('first_name', 'First Name is Requied').notEmpty();
    req.checkBody('last_name', 'Last Name is Requied').notEmpty();
    req.checkBody('email', 'Email is Requied').notEmpty();
    
    var errors = req.validationErrors();
    
    if(errors){
        res.render('index', {
            title: "Customers",
            users: users,
            errors: errors
        });
    }else{
        var newUser = {
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email
        }
      //  console.log('SUCCESS');
        db.users.insert(newUser, function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
        })
    }
    
}) 


/*
app.get('/', function(req, res){
    res.json(users);
})
*/

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        res.redirect('/');
    })
});



app.listen(3000, function(){
    console.log("Server started on port 3000...");
});
