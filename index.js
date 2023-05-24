const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bq2ef3t.mongodb.net/?retryWrites=true&w=majority`;

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
		// await client.connect();

		const toyCollection = client.db("babyToy").collection("toys");
		const addCollection = client.db("babyToy").collection("addtoys");

		// toys
		app.get("/toys", async (req, res) => {
			const cursor = toyCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/toys/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };

			const options = {
				projection: {
					_id: 1,
					img: 1,
					name: 1,
					seller: 1,
					price: 1,
					rating: 1,
					category: 1,
					quantity: 1,
					email: 1,
					desc: 1,
				},
			};

			const result = await toyCollection.findOne(query, options);
			res.send(result);
		});

		// addtoys
		app.get("/addtoys", async (req, res) => {
			console.log(req.query.email);
			let query = {};
			if (req.query?.email) {
				query = { email: req.query.email };
			}
			const result = await addCollection.find(query).toArray();
			res.send(result);
		});

		app.get("/addtoys/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };

			const options = {
				projection: {
					_id: 1,
					img: 1,
					name: 1,
					seller: 1,
					price: 1,
					rating: 1,
					category: 1,
					quantity: 1,
					email: 1,
					desc: 1,
				},
			};

			const result = await addCollection.findOne(query, options);
			res.send(result);
		});

		app.post("/addtoys", async (req, res) => {
			const addtoy = req.body;
			console.log(addtoy);
			const result = await addCollection.insertOne(addtoy);
			res.send(result);
		});

		app.put("/addtoys/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: new ObjectId(id) };
			const option = { upsert: true };
			const updatedToy = req.body;
			console.log(updatedToy);
			const addToy = {
				$set: {
					name: updatedToy.name,
					seller: updatedToy.seller,
					price: updatedToy.price,
					quantity: updatedToy.quantity,
					email: updatedToy.email,
					img: updatedToy.img,
					rating: updatedToy.rating,
					description: updatedToy.description,
				},
			};
			const result = await addCollection.updateOne(filter, addToy, option);
			res.send(result);
		});

		app.delete("/addtoys/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await addCollection.deleteOne(query);
			res.send(result);
		});

		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log("Pinged your deployment. You successfully connected to MongoDB!");
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.get("/", (req, res) => {
	res.send("Baby Toy is running");
});

app.listen(port, () => {
	console.log(`Baby Toy server is running on port: ${port}`);
});
