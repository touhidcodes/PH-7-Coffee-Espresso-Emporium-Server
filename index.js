const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.57whvd4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const coffeeCollection = client
			.db("CoffeeDB")
			.collection("coffee_collection");

		// Get data from db
		app.get("/coffee", async (req, res) => {
			const cursor = coffeeCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		// Send data to the DB
		app.post("/coffee", async (req, res) => {
			const coffee = req.body;
			const result = await coffeeCollection.insertOne(coffee);
			res.send(result);
		});

		app.delete("/coffee/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await coffeeCollection.deleteOne(query);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Coffee Espresso Emporium Server is running......");
});

app.listen(port, () => {
	console.log(`Coffee Espresso Emporium Server app listening on port ${port}`);
});
