
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const IMDB = require('./src/imdb');
const DENZEL_IMDB_ID = 'nm0000243';


const CONNECTION_URL = "mongodb+srv://aptoblop:1234@clusteractor-ddkdt.gcp.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "denzel";

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movies");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});



app.get("/movies/populate",async (request,response)=>{
  const movies=await IMDB( DENZEL_IMDB_ID);
  console.log("salut à toi brave voyageur");
  collection.insert(movies,(error,)=>{
    if(error){
      return response.status(500).send(error);
    }
    response. send(result.result);
  })

  response.send("nbr movies: "+movies.length);
});

app.post("/person", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

/*app.get("/people", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/person/:id", (request, response) => {
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

//curl -X POST -H 'content-type:application/json' -d '{"firstname":"Maria","lastname":"Raboy"}' http://localhost:3000/person
*/
