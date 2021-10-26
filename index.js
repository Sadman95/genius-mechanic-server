const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

//MIDDLEWARE:
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.a65gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function geniusServer() {
  try {
    await client.connect();
    // console.log('database is connected');

    const database = client.db("geniusMechanic");
    const servicesCollection = database.collection("services");

    //GET API:
    app.get('/services', async(req, res) =>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    })

    //POST API:
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    //GET API FOR SPECIFIC ID:
    app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await servicesCollection.findOne(query);
        res.json(result);
    })
    
//UPDATE API:
app.put('/services/:id', async(req, res) =>{
    const id = req.params.id;
    const filter = {_id: ObjectId(id)};
    const options = { upsert: true };
    const updateServiceDoc = {
        $set: {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            img: req.body.img
        },
        };
// console.log(updateServiceDoc)
const result = await servicesCollection.updateOne(filter, updateServiceDoc, options);
// console.log(result)
res.json(result);
})

    //DELETE API:
    app.delete('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
    })
  } finally {
    // await client.close();
  }
}

geniusServer().catch(console.dir);

const port = 5000;

app.get("/", (req, res) => {
  res.send("response from server");
});

app.listen(port, () => {
  console.log("server is running at ", port);
});
