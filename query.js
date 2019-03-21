
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt
} = require('graphql');

// Define Movie Type
movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        year: { type: GraphQLInt }

    }
});



//Define the Query
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,

            resolve: function () {
                return "Hello World";
            }
        },
        movies:{
            type: GraphQLString,

            resolve: function () {
              collection.find({metascore:{$gt:70}}).toArray((error,result)=>{

                if(error)
                {
                  return response.status(500).send(error)
                }
                var lereturn= result;
                return "ok";
            //  response.send(result);
              });
            }
        }
    }
});



exports.queryType = queryType;
