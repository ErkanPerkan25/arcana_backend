const { MongoClient, ServerApiVersion } = require("mongodb");
require("../loadEnvironment.js");

// Replace the uri string with your connection string
const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri,{
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db('sample_mflix');
        const movies = database.collection('movies');

        // Queries for a movie that has a title value of 'Back to the Future'
        const query = { title: 'Back to the Future' };
        const movie = await movies.findOne(query);

        console.log(movie);
    } finally {
        await client.close();
    }
}
run().catch(console.dir);
