import { MongoClient, ServerApiVersion } from "mongodb";
import "../loadEnvironment.js";
import mongoose from "mongoose";

// Replace the uri string with your connection string
const uri = process.env.ATLAS_URI || "";
const db = await mongoose.connect(uri, {
    dbName:"Arcana_db",
})
.catch(error =>{
    throw error;
});

/*
const client = new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let conn;

try{
    conn = await client.connect();
}
catch(e){
    console.error(e);
}
*/

//let db = conn.db("Arcana_db");

export default db;
