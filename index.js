const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uujg3og.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const servicesCollection =client.db('touristguide').collection('services')
        const reviewsCollection =client.db('touristguide').collection('reviews')
        app.get('/services', async(req,res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/homeservices', async(req,res)=>{
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.send(service);
        })
        //  add new services 
        app.post('/service', async(req,res)=>{
            const query = req.body;
            const result = await servicesCollection.insertOne(query)
            res.send(result);
            console.log(result);

        })

        // add the reviews collection 

        app.post('/reviews', async(req, res) => {
            const query = req.body;
            const reviews = await reviewsCollection.insertOne(query)
            res.send(reviews)
            console.log(reviews)
          });
      
          app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.email) {
              query = {email: req.query.email}
            }
            console.log(query);
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray()
            res.send(reviews)
          })

        //   delete a review 

        app.delete('/reviews/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewsCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(error=> console.error(error))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})