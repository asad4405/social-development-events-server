import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
const PORT = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const client = new MongoClient(`${process.env.MONGODB_URL}`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        return client;
    } catch (err) {
        console.dir(err);
    }
}

const connectedClient = await connectToMongoDB();
const db = connectedClient.db('social-development-events');
const eventCollection = db.collection('events');

app.get("/", (req, res) => {
  res.send("Server Checking");
});

app.post('/create-event', async (req, res) => {
    const data = req.body;
    const result = await eventCollection.insertOne(data);
    res.send(result);
});

app.get('/events', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const events = await eventCollection.find({
        date: { $gte: today }
    }).toArray();

    res.send(events);
});
// event details
app.get('/events/:id', async (req, res) => {
    const { id } = req.params;
    const event = await eventCollection.findOne({ _id: new ObjectId(id) });
    res.send(event);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});