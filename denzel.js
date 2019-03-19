
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const assert = require('assert');
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


app.get("/movies",  (request,response)=>{
  collection.find({metascore:{$gt:70}}).toArray((error,result)=>{

    if(error)
    {
      return response.status(500).send(error)
    }
  response.send(result);
  });
});


app.get("/movies/search",  (request,response)=>{
//  console.log("blooooooooooooop");
  var score= request.query.metascore ==undefined ? Number(request.query.metascore) : 0;;
  var limitmax= request.query.limit ==undefined ? Number(request.query.limit) : 5;

    collection.find({ metascore : { $gt: score } }).limit(limitmax).sort({ metascore: -1 }).toArray((error, result) => {
      if(error) {
          return response.status(500).send(error);
      }
      console.log(result);
    });
});

app.post("/movies/:id", (request, response) => {
    var review = response.body.review;
    var date = response.body.date;
    collection.aggregate([{$match:{"id": request.params.id}},{$set:{review:review,date:date}}], (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/movies/:id",  (request,response)=>{
  collection.find({"id":request.params.id}).toArray((error,result)=>{

    if(error)
    {
      return response.status(500).send(error)
    }
  response.send(result);
  });
});
