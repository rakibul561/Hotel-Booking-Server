const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//  midleware

app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fmdvppd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection = client.db('hotelbooking').collection('serviecs');

    const bookingCollection = client.db('hotelService').collection('bookings')

    app.get('/serviecs', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    // room services is here
    app.get('/serviecs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const options = {
        projection: { description: 1, room_size: 1, price_per_night: 1, room_image: 1, },
      }
      const result = await serviceCollection.findOne(query, options);
      res.send(result)
    })





    // id here
    app.get('/newRoom/:id', async (req, res) => {
      const result = await serviceCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result)
    })

    // bookings
    app.get('/bookings', async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result)
    })

    // uppdated get oparetion
    app.get('/bookings/:id', async (req, res) => {
      const id = req.params;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.findOne(query)
      res.send(result)
    })


    // this is a bookings
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result)
    });

    // update oparetion
    app.put('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateRoom = req.body;
      const room = {
        $set: {
          date: updateRoom.date
        }
      }
      const result = await bookingCollection.updateOne(filter, room, options);
      res.send(result)
    })





    // delete oparetion mybooking thake 

    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.deleteOne(query);
      res.send(result);

    })












    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
  res.send('hotel booking is running')
})
app.listen(port, () => {
  console.log(`hotel booking server is running on port ${port}`);
})