const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGO_URL;

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB");

        // Drop the users collection
        const db = mongoose.connection.db;
        await db.collection('users').drop();
        console.log("Users collection dropped successfully!");

        mongoose.connection.close();
        process.exit(0);
    })
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });
