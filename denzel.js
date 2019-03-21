
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
    var random = Math.floor(Math.random() * Math.floor(result.length));

  response.send(random);
  });
});


app.get("/movies/search",  (request,response)=>{
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


const graphqlHTTP = require('express-graphql');
const {GraphQLSchema} = require('graphql');


const port = 9292;

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLFloat
} = require('graphql');

 movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        year: { type: GraphQLInt }

    }
});

 movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
      //_id: { type: GraphQLID },
       id: { type: GraphQLString },
       link: { type: GraphQLString },
       metascore: { type: GraphQLInt },
       poster: { type: GraphQLString },
       rating: { type: GraphQLFloat },
       synopsis: { type: GraphQLString },
       title: { type: GraphQLString },
       votes: { type: GraphQLFloat},
       year: { type: GraphQLInt },

       date:{type: GraphQLString},
       review:{type:GraphQLString}

    }
});
 const queryType = new GraphQLObjectType({
     name: 'Query',
     fields: {
         hello: {
             type: GraphQLString,

             resolve: function () {
                 return "Hello World";
             }
         },

         randomMovie: {
     type: movieType,
     resolve: async function() {

       const res = await collection.find({metascore:{$gte:70}}).toArray();
       var random = Math.floor(Math.random() * Math.floor(res.length));
       return res[random];

     }
   },

   specMovie: {
  type: movieType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async function(source,args) {
    return fetch(`http://localhost:9292/movies/${args.id}`)
    .then(res => res.json())
  }
},
searchMovie: {
    type: movieType,
    args: {
      limit: { type: GraphQLInt },
      metascore: {type: GraphQLInt}
    },
    resolve: async function(source,args) {
      const res = await fetch(`http://localhost:9292/movies/search?limit=${args.limit}&metascore=${args.metascore}`)
      const finalResult = await res.json();
      return finalResult.results;
    }
  }



     }
 });
 const schema = new GraphQLSchema({ query: queryType });



//Setup the nodejs GraphQL server
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));

console.log(`GraphQL Server Running at localhost:${port}`);
