const express                 =   require('express');
const app                     =   express();
const path                    =   require('path');
const port                    =   process.env.PORT || 8080;
const logger                  =   require('./middleware/logger');
const MongoClient             =   require("mongodb").MongoClient;
var users                     =   require('./middleware/api/user');
var items                     =   require('./middleware/api/items');
var db;
var mongourl                  =   "mongodb://localhost:27017/mydb";
var cookieParser              =   require('cookie-parser');
var expressSession            =   require('express-session');
const bodyParser              =   require('body-parser');
const uuid = require("uuid");

/* Login */
var loggedUser = false;
MongoClient.connect(mongourl, (err, database) => {
    if (err) return console.log(err);
    db = database.db("mydb");
    app.listen(port, () => {
        console.log("Server running on " + port + "....");
    });
});

app.use(cookieParser());
app.use(expressSession({
    secret: 'logininfo',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
  extended: true
}));

/*homepage exit>,false "set" sessiont, majd továbbmegyünk*/
app.get('/', (req, res, next)=>{
    req.session.uid = false;
    next();
});

app.get('/login', (req, res, next)=>{
  if(!req.session.uid) {
    res.redirect('/')
  } else {
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.post("/login", (req, res) => {
    db.collection("user").find(req.body).toArray(function(err, result){
      if(err) throw err;
      if(result.length == 0) { 
        res.redirect("/error.html");
      } else { 
        var id = result[0]['id']; 
        req.session.uid = id;
        res.redirect('/login');
      }
    });
});

app.post("/register", (req, res) => {
    req.body['money'] = 10000; 
    req.body["id"]    = uuid.v4(); //
    req.body["cart"]  = []; 
    db.collection("user").insertOne(req.body);
    console.log("inserted");
    res.redirect("/success.html");
});

/*
 login nélkül> kezdőlapra küldjük
különben futhat tovább ( next )
*/

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);
app.use("/api/users", users);
app.use("/api/items", items);



app.get('*', (req, res, next) => {
  if(!req.session.uid) {
    res.redirect('/')
  } else {
    next();
  }
});
