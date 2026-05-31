const fs = require('fs');
const { MongoClient } = require('mongodb');

// Replace this with your MongoDB Atlas connection string
// Example: "mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
const uri = process.env.MONGO_URI || "mongodb+srv://pateldrupcd:Drup%40123@cluster0.rgcm6if.mongodb.net/ecommerce_db?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db("ecommerce_db"); // You can change the database name here
    const collection = db.collection("customers"); // You can change the collection name here

    console.log("Reading JSON file...");
    const rawData = fs.readFileSync('ecommerce_customer_churn_dataset.json');
    const data = JSON.parse(rawData);

    console.log(`Found ${data.length} records. Inserting into MongoDB...`);
    
    // Insert many documents at once
    const result = await collection.insertMany(data);
    
    console.log(`${result.insertedCount} documents were inserted.`);
  } catch (err) {
    console.error("Error connecting or inserting data:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
