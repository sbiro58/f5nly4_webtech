const express                 =   require('express');
const router                  =   express.Router();
const MongoClient             =   require("mongodb").MongoClient;
const MONEY                   =   10000; //alapból ennyit kap most mindenki
var db, items
var mongourl                  =   "mongodb://localhost:27017/mydb";
const uuid = require("uuid");
MongoClient.connect(mongourl, (err, database) => {
    if (err) return console.log(err);
    db = database.db("mydb");
});




/*összes item*/
router.get("/", (req, res) => {
    db.collection('items').find().toArray(function(err, result) {
      if(err) throw err;
      res.json(result);
    });
});

//add item
router.post('/', (req, res) => {
    db.collection("items").insertOne({
      id        :   uuid.v4(),
      isbn      :   req.body.isbn,
      szerzo    :   req.body.szerzo,
      cim       :   req.body.cim,
      kiadas    :   req.body.kiadas,
      ar        :   req.body.ar,
      db        :   req.body.db,
      img       :   req.body.img,
      leiras    :   req.body.leiras
    });
    res.json({success:true});
});

//update item
router.put("/:id", (req, res) => {
  var myquery = { id: req.params.id };
  var newvalues = { $set: {
    isbn      :   req.body.isbn,
    szerzo    :   req.body.szerzo,
    cim       :   req.body.cim,
    kiadas    :   req.body.kiadas,
    ar        :   req.body.ar,
    db        :   req.body.db,
    img       :   req.body.img,
    leiras    :   req.body.leiras
  } };
  db.collection("items").update(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");

  }, {upsert:true});
  res.send('ok');
});

router.put("/:id/add", (req, res)=>{
  var myquery = { id: req.params.id };
  db.collection("items").updateOne(myquery, {
    $inc: { db:1 }
  }, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");

  });
  res.send('ok');
});


router.delete('/:id', (req, res) => {
  var myquery = { id: req.params.id };
  db.collection("items").deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");

  });
  res.send('ok');
})
module.exports = router;
