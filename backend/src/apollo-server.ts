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
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();
        const collection = mongo.db('league').collection('players');

        const { name} = args;

        const q = !!name?collection.find({name:new RegExp(name,'i')}):collection.find({});

        const players: Player[] = (await q.limit(20).toArray()) as any;
        
        return players;

      } catch (error) {
        throw new UserInputError('failed to get players');
      }
    },
    topPlayers: async (root, args, context, info) => {
      try {
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();
        const collection = mongo.db('league').collection('players');
        

        const players: Player[] = (await collection.find().sort({rank:-1}).limit(20).toArray()) as any;
        
        return players;

      } catch (error) {
        throw new UserInputError('failed to get players');
      }
    },
    playerByPartialNumber: async (root, args, context, info) => {
      try {
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();
        const collection = mongo.db('league').collection('players');

        const { number} = args;

        const q = !!number?collection.find({number:new RegExp(number,'i')}):collection.find({});

        const players: Player[] = (await q.limit(20).toArray()) as any;
        
        return players;

      } catch (error) {
        throw new UserInputError('failed to get players');
      }
    },

    matchById: async (root, args, context, info) => {
      try {
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();
        const playerCollection = mongo.db('league').collection('players');
        const matchCollection = mongo.db('league').collection('matches');

        const { id} = args;
        const matches: Match[] = (await matchCollection.find({_id:new ObjectId(id)}).toArray()) as any;
        if(matches.length != 1){
          throw new Error( ` match ${id} not found`);
        }

        const match = matches[0];

        const [winner,looser] = await Promise.all([match.winnerPhoneNumber,match.looserPhoneNumber]
          .map(async p=>{
            const found:Player[] = (await playerCollection.find({phoneNumber:p}).toArray()) as any;
            if(found.length != 1){
              throw new Error( ` ${p} phone number not found`);
            }
            return found[0];
          }));
        
        return {
          _id:match._id,
          winner,
          looser,
          details:{
            tournament:match.tournament
          }
        };

      } catch (error) {
        throw new UserInputError('failed to get match');
      }
    },

    matchesByPlayer: async (root, args, context, info) => {
      try {
        // @ts-ignore: Unreachable code error
        const mongo = await new (mongoDB ).MongoClient(`mongodb://localhost:27017`).connect();
        const playerCollection = mongo.db('league').collection('players');
        const matchCollection = mongo.db('league').collection('matches');

        const { phoneNumber} = args;
        const matches: Match[] = (await matchCollection.find({$or:[
            {winnerPhoneNumber:phoneNumber},
            {looserPhoneNumber:phoneNumber}
          ]}).toArray()) as any;

      
        return await Promise.all(matches.map(async match=>{
          const [winner,looser] = await Promise.all([match.winnerPhoneNumber,match.looserPhoneNumber]
            .map(async p=>{
              const found:Player[] = (await playerCollection.find({phoneNumber:p}).toArray()) as any;
              if(found.length != 1){
                throw new Error( ` ${p} phone number not found`);
              }
              return found[0];
            }));
          
          return {
            _id:match._id,
            winner,
            looser,
            details:{
              tournament:match.tournament
            }
          };
        })); 

      } catch (error) {
        throw new UserInputError('failed to get match');
      }
    },


  },

  Mutation: {
    createMatch: async (root, args, context, info) => {
      const { winnerPhoneNumber, looserPhoneNumber, winnerName, looserName , tournament} = args;
      try {
        
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

        //for rank
        const uniqueWins = await matchCollection.distinct("looserPhoneNumber",{winnerPhoneNumber:winnerPhoneNumber});

        await playerCollection.updateOne({phoneNumber: winnerPhoneNumber},{$set:{rank:uniqueWins.length}});

        return match._id;


      } catch (error) {
        console.error(error);
        //todo NON user friendly errors
        throw new UserInputError(`failed to register : ${error}`);
      }

    }
  }
};

const server = new ApolloServer({ typeDefs: schema, resolvers })


export const graphqlHandler = server.createHandler();