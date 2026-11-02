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
const joinEventCollection = db.collection('join-events');

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
// manage event 
app.get('/events/manage/:userId', async (req, res) => {
    const { userId } = req.params;
    const events = await eventCollection.find({ userId }).toArray();
    res.send(events);
});
// Update Event 
app.patch('/events/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;

    const query = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            title: updatedData.title,
            category: updatedData.category,
            date: updatedData.date,
            location: updatedData.location,
            image: updatedData.image,
            description: updatedData.description,
        },
    };

        const result = await eventCollection.updateOne(query, updateDoc);
        res.send(result);
});

// Delete Event
app.delete('/events/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await eventCollection.deleteOne(query);
    res.send(result);
});

// join event
app.post('/join-event', async (req, res) => {
    const { event, userId, userName, userEmail } = req.body;
    const eventId = event?._id ;

    if (!eventId || !userId) {
        return res.status(400).send({ error: "Missing required fields (eventId or userId)" });
    }
    const existingJoin = await joinEventCollection.findOne({ eventId, userId });
    if (existingJoin) {
        return res.status(400).send({ error: "You have already joined this event" });
    }
    const joinEventDoc = {
        eventId,
        title: event?.title,
        category: event?.category,
        date: event?.date,
        location: event?.location,
        image: event?.image,
        description: event?.description,
        userId,
        userName,
        userEmail,
        joinedAt: new Date()
    };

    const result = await joinEventCollection.insertOne(joinEventDoc);
    res.send(result);
});
// event join list
app.get('/join-event/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const joinEvents = await joinEventCollection.find({ eventId }).toArray();
    res.send(joinEvents);
});
// event join list by user
app.get('/joined-event/:userId', async (req, res) => {
    const userId = req.params.userId;
    const joinEvents = await joinEventCollection.find({ userId }).toArray();
    res.send(joinEvents);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});