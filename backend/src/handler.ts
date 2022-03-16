/*
export const hello = (event, context, cb) => cb(null,
  { message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!', event }
);
*/

/*
export const hello = async (event, context) => {

  const body = await new Promise(resolve => {
    setTimeout(() => {
      resolve(
        {
          message: `Hello, this is your lambda speaking. Today is bbbb!`,
          event
        }
      );
    }, 2000);
  });
  return {
    statusCode: 200,
    body,
  };

}
*/

import { ApolloServer } from 'apollo-server-lambda';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/types';
import characterSource from './graphql/ds/character';
import movieSource from './graphql/ds/movie';


// creating the server
const server = new ApolloServer({
  // passing types and resolvers to the server
  typeDefs,
  resolvers,

  // initial context state, will be available in resolvers
  context: () => ({}),

  // an object that goes to the "context" argument
  // when executing resolvers
  dataSources: () => {
      return {
          characterSource,
          movieSource,
      } as any;
  },
});

export const hello = (event, context, callback) => {
  const handler = server.createHandler();

  // tell AWS lambda we do not want to wait for NodeJS event loop
  // to be empty in order to send the response
  context.callbackWaitsForEmptyEventLoop = false;

  // process the request
  return handler(event, context, callback);
};
