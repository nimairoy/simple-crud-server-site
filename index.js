const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 7000;

// middlewares
app.use(cors());
app.use(express.json());


//username: nimairoy718
//pass: lwEU4a2mmExDTmOR


const uri = "mongodb+srv://nimairoy718:lwEU4a2mmExDTmOR@cluster0.as9pvg2.mongodb.net/?retryWrites=true&w=majority";

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

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    // delete a specific user 
    app.delete('/users/:id', async(req, res)=> {
        const id = req.params.id;
        console.log(id)
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result);

    })


    // update a specific user
    app.get('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result);
    })


    // read all the users 
    app.get('/users', async(req, res)=> {
        const cursor = userCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // create a new user 
    app.post('/users', async(req, res)=> {
        const user = req.body;
        console.log(user)
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    // update a single element 
    app.put('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const user = req.body;
      console.log( id,user)

      const filter = { _id: new ObjectId(id) }
      const options = {upsert: true};

      const updatedUser = {
        $set: {
          name : user.name,
          email: user.email
        }
      }

      const result = await userCollection.updateOne(filter, updatedUser, options);
      res.send(result)

    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.get('/', (req, res)=> {
    res.send('Server is Running');
})



app.listen(port, ()=>{
    console.log(`Simple Crud Server is Running on PORT ${port}`)
})