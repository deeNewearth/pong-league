const fs = require('fs')
const { ApolloServer, gql } = require('apollo-server-lambda')

// get the GraphQL schema
const schema = fs.readFileSync('./src/schema.graphql', 'utf8')

// resolver functions
const resolvers = { 
  Query: {
    item: () => {},
  },

  Mutation: {
    createItem: () => {},
  }
};

const server = new ApolloServer({ typeDefs: schema, resolvers })


export const graphqlHandler =server.createHandler();