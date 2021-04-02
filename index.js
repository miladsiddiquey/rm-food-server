const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()



const app = express()
const port =process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3tkh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err',err)
  const foodCollection = client.db("foodStore").collection("product");
  const orderCollection = client.db("foodStore").collection("order");



  app.get('/foods',(req, res) => {
    foodCollection.find()
    .toArray((err, items) =>{
      res.send(items)
      

    })
  })


  //post
  app.post('/addFood',(req,res)=>{
    const newEvent = req.body;
    console.log('adding new event', newEvent)
    foodCollection.insertOne(newEvent)
    .then(result => {
      console.log('inserted count',result.insertedCount)
      res.send(result.insertedCount > 0)

    })
  })


app.delete('/deleteFood/:id',(req, res) =>{
  const id = ObjectID(req.params.id);
  console.log('delate this',id);
  foodCollection.findOneAndDelete({_id:id})
  .then(documents => res.send(!!documents.value))


})


app.post('/addOrder',(req,res)=>{
  const order = req.body;
  console.log('adding new event', order)
  orderCollection.insertOne(order)
  .then(result => {
    console.log('inserted count',result.insertedCount)
    res.send(result.insertedCount > 0)

  })
})

app.get('/orders',(req,res) => {
  orderCollection.find({email:req.query.email})
  .toArray((err, documents)=>{
    res.send(documents);
  })
})


});




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})