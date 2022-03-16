import * as mongoDB from "mongodb";
import { ObjectId } from 'bson';

const fs = require('fs')
const { ApolloServer, gql, UserInputError } = require('apollo-server-lambda');

// get the GraphQL schema
const schema = fs.readFileSync('./src/schema.graphql', 'utf8');

type Player = {
  _id: ObjectId;
  name: string;
  rank: 0;
}

type Match = {
  _id?: ObjectId;
  winnerPhoneNumber: string;
  looserPhoneNumber: string;
  tournament:string;
}


// resolver functions
const resolvers = {
  Query: {
    playerByPartialName: async (root, args, context, info) => {
      try {
        const mongo = await new (mongoDB as any).MongoClient(`mongodb://localhost:27017`).connect();
        const collection = mongo.db('league').collection('players');


        const players: Player[] = (await collection.find({}).toArray()) as any;

        console.log(`i am here ${JSON.stringify(players)}`);

        return players;

      } catch (error) {
        throw new UserInputError('failed to get players');
      }
    },
    matchById: async (root, args, context, info) => {
      return {
        winner: {
          id: '2',
          name: 'ssss',
          rank: 3
        },
        looser: {
          id: '2',
          name: 'ssss',
          rank: 3
        },
        id: '123'
      };
    },
  },

  Mutation: {
    createMatch: async (root, args, context, info) => {
      const { winnerPhoneNumber, looserPhoneNumber, winnerName, looserName , tournament} = args;
      try {
        //const mongo = await new (mongoDB as any).MongoClient(`mongodb://localhost:27017`).connect();
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();

        const playerCollection = mongo.db('league').collection('players');

        await Promise.all([
          { type: 'winner', nuumber: winnerPhoneNumber, name: winnerName },
          { type: 'looser', nuumber: looserPhoneNumber, name: looserName }
        ].map(async t => {
          if (!t.nuumber) {

            throw new Error('phone number is required');
          }

          if (!!t.name) {
            console.debug(`creating new player :${t.name} - ${t.nuumber}`);
            await playerCollection.insertOne({
              name: t.name,
              phoneNumber: t.nuumber,
              rank: 0
            });
          }else{
            const found = await playerCollection.find({phoneNumber:t.nuumber}).toArray();
            if(found.length != 1){
              throw new Error( ` ${t.type} phone number not found`);
            }
          }


        }));

        const match:Match = {
          winnerPhoneNumber,
          looserPhoneNumber,
          tournament,
        }

        const matchCollection = mongo.db('league').collection('matches');

        await matchCollection.insertOne(match);

        return match._id;


      } catch (error) {
        console.error(error);
        //todo NON user friendly errors
        throw new UserInputError(`failed to register : ${error}`);
      }


    },
    registerPlayer: async (root, args, context, info) => {
      const { name } = args;
      try {
        const mongo = await new (mongoDB as any).MongoClient(`mongodb://localhost:27017`).connect();
        const collection = mongo.db('league').collection('players');


        collection.insertOne({
          name,
          rank: 0
        });

      } catch (error) {
        throw new UserInputError('failed to register');
      }

    }
  }
};

const server = new ApolloServer({ typeDefs: schema, resolvers })


export const graphqlHandler = server.createHandler();