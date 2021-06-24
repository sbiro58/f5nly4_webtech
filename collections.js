/*Mongo DB*/
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var books = [{
      id:1,
      "isbn": "9781593275846",
      "cim": "Harry Potter és a Főnix Rendje",
      "szerzo": "JK Rowling",
      "kiadas": "2004",
      "ar": 472,
      "db" : 12,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "Fantasy,12",
      "website": "http://harrypotter.com"
    },
    {
      id:2,
      "isbn": "9781449331818",
      "cim": "Narnia Krónikái 1.",
      "szerzo": "CS Lewis",
      "kiadas": "1960",
      "ar": 254,
      "db" : 7,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "fantasy,családi film"
    },
    {
      id:3,
      "isbn": "9781449365035",
      "cim": "Ragyogás",
      "szerzo": "Stephen King",
      "kiadas": "1980",
      "ar": 460,
      "db" : 56,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "Horror"
    },
    {
      id:4,
      "isbn": "9781491950296",
      "cim": "Pál utcai fiúk",
      "szerzo": "Móra Ferenc",
      "kiadas": "1940",
      "ar": 254,
      "db" : 11,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "Ifjusági,kaland regény"
    },
    {
      id:5,
      "isbn": "9781593277574",
      "cim": "A túlélés törvényei",
      "szerzo": "Edward Micheal Grylls",
      "kiadas": "2008",
      "ar": 352,
      "db" : 125,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "Túlélás kezdőknek"
    },
    {
      id:6,
      "isbn": "9781491904244",
      "cim": "AZ(It'S)",
      "szerzo": "Stephen King",
      "kiadas": "1975",
      "ar": 1278,
      "db" : 1,
      "img":"https://sh-s7-live-s.legocdn.com/is/image/LEGO/21315",
      "leiras": "Krajcáros a gyilkos bohóc elrabolja a gyerekeket",
    },
    ];

MongoClient.connect(url, function(err, db) {
 
  var dbo = db.db("mydb");

/*User Collection*/

  dbo.createCollection("user", function(err, res) {

    console.log("Collection created!");
  });

/*Items Collection*/


  dbo.createCollection("items", function(err, res) {
     
      console.log("Collection created!");
      dbo.collection("items").insertMany(books, function(error, inserted) {
           if(error) {
               console.error(error);
           }
           else {
               console.log("Successfully inserted: " , inserted );
           }
       }); // end of insert

    });

});
