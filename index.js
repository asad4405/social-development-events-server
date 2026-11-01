import express from "express";
import cors from 'cors';
import 'dotenv/config';
import { MongoClient } from 'mongodb';

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

app.get("/", (req, res) => {
  res.send("Server Checking");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});