const express                 =   require('express');
const router                  =   express.Router();
const MongoClient             =   require("mongodb").MongoClient;
const MONEY                   =   10000; //alapból ennyit kap most mindenki
var db, users
var mongourl                  =   "mongodb://localhost:27017/mydb";
const uuid = require("uuid");
MongoClient.connect(mongourl, (err, database) => {
    if (err) return console.log(err);
    db = database.db("mydb");
});





router.get("/", (req, res) => {
    if(req.session.uid) { //ha már be van jelentkezve, akkor megkapja az adatait
      db.collection('user').find({id: req.session.uid }).toArray(function(err, result) {
        if(err) throw err;
        res.json(result);
      });
    } else {
      res.json([]);
    }
});

//add user
router.post('/', (req, res) => {

    db.collection("user").insertOne({
      id      : uuid.v4(),
      name    : req.body.name,
      pswd    : req.body.pswd,
      email   : req.body.email,
      birth   : req.body.birth,
      address : req.body.address,
      money   : req.body.money||MONEY,
      cart    : []
    });
    res.json({success:true});
});

//update user
router.put("/:id", (req, res) => {
  var myquery = { id: req.params.id };
  var newvalues = { $set: req.body };
  db.collection("user").update(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");

  }, {upsert:true});
  res.send('ok');
});

/*default session user update*/
router.put("/", (req, res) => {
  if(!req.session.uid) return false;
  var myquery = { id: req.session.uid };
  delete req.body["_id"];
  var newvalues = { $set: req.body };
  db.collection("user").update(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");

  }, {upsert:false});
  res.send('ok');
});

router.delete('/:id', (req, res) => {
  var myquery = { id: req.params.id };
  db.collection("user").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");

  });
  res.send('ok');
});




module.exports = router;
