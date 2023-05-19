const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)




app.get("/", (req, res) => {
	res.send("Baby Toy is running");
});

app.listen(port, () => {
	console.log(`Baby Toy server is running on port: ${port}`);
});
